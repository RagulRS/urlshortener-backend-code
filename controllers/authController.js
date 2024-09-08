const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');

const sendTokenResponse = (user, statusCode, res) => {
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: '1h',
    });

    res.status(statusCode).json({
        success: true,
        token,
    });
};

exports.register = async (req, res) => {
    const { firstName, lastName, email, password } = req.body;

    try {
        const user = await User.create({
            firstName,
            lastName,
            email,
            password,
        });

        // Send activation email
        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const activationLink = `${req.protocol}://${req.get('host')}/api/auth/activate/${user._id}`;

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: 'Account Activation',
            html: `<h2>Click the link below to activate your account:</h2><a href="${activationLink}">Activate Account</a>`,
        });

        res.status(201).json({
            success: true,
            data: 'Activation email sent!',
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.activateAccount = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }

        user.isActive = true;
        await user.save();

        res.status(200).json({ success: true, data: 'Account activated' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(400).json({ success: false, error: 'Invalid credentials' });
        }

        if (!user.isActive) {
            return res.status(400).json({ success: false, error: 'Account not activated' });
        }

        sendTokenResponse(user, 200, res);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// Implement forgot password, reset password, and other necessary controllers here

