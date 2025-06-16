import nodemailer from 'nodemailer';
import express from 'express';
import cors from 'cors';
import { writeRegisterData } from './Firebase.mjs';

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const otpStore = {};

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'tobia166@gmail.com',
        pass: 'mtyh gfrd noaf aejh'
    }
});

function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

// Register
app.post('/register', async (req, res) => {
    try {
        const { email, firstName, lastName, password, role } = req.body;
        if (!email || !firstName || !lastName || !password) {
            return res.status(400).json({ success: false, error: 'All fields are required' });
        }
        const user = await writeRegisterData(email, firstName, lastName, password, role);
        console.log('User Registered:', user);

        const otp = generateOTP();
        otpStore[email] = { otp, expires: Date.now() + 3 * 60 * 1000 };

        try {
            await transporter.sendMail({
                from: '"Infinity" <tobia166@gmail.com>',
                to: email,
                subject: 'OTP Code',
                text: `Your OTP Code ${otp}`
            });
        } catch (error) {
            console.log('Error sending email:', error);
            return res.status(500).json({ success: false, error: 'Failed to send Email' });
        }

        return res.json({ success: true });
    } catch (error) {
        console.log('User not registered:', error);
        return res.status(500).json({ success: false, error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});