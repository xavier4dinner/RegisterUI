import nodemailer from 'nodemailer';
import express from 'express';
import cors from 'cors';
import { OTPData } from './Firebase.mjs';
import { fullUserInformation} from'./Firebase.mjs'

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
        const user = await OTPData(email, firstName, lastName, password, role);
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

//OTP verification
app.post('/verify-otp', (req, res) => {
    const { email, otp } = req.body;
    const record = otpStore[email];
    if (!record) {
        return res.status(400).json({ success: false, error: 'No OTP Found' })
    }
    if (Date.now() > record.expires) {
        return res.status(400).json({ success: false, error: 'OTP Expired' })
    }
    if (String(record.otp) !== String(otp).trim()) {
        return res.status(400).json({ success: false, error: 'Invalid OTP' })
    }
    delete otpStore[email];
    return res.json({success: true, message: 'OTP Verified.'})
})

app.post('/Additional-Information', async (req, res) => {
    const { contactNumber, city, state, country, zipCode } = req.body;
    if (!contactNumber || !city || !state || !country || !zipCode) {
        return res.status(400).json({ success: false, error: 'All fields are required' })
    }
    try{
    await fullUserInformation(contactNumber, city, state, country, zipCode)
    return res.json({success: true,})
    } catch (error) {
        return res.status(500).json({success: false, error: 'Failed to Save additional data'})
    }
})



app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});