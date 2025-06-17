import nodemailer from 'nodemailer';
import express from 'express';
import cors from 'cors';
import bcrypt from 'bcrypt';
import { OTPsave, getOTP, deleteOTP, fullUserInformation, usernameChecker} from './Firebase.mjs';

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());


//Register Start
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

// OTP Save
app.post('/OTP-save', async (req, res) => {
    try {
        const { email, firstName, lastName, username, password, role } = req.body;
        if (!email || !firstName || !lastName || !username ||  !password) {
            return res.status(400).json({ success: false, error: 'All fields are required' });
        }

        if(await usernameChecker(username)) {
            return res.status(400).json({success: false, error: 'Username already exists'})
        }


        const otp = generateOTP();
        const expire =  Date.now() + 3 * 60 * 1000;

        const hashedPassword = await bcrypt.hash(password, 10);

        await OTPsave(email, firstName, lastName, username, hashedPassword, role, otp, expire);

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
app.post('/verify-otp', async (req, res) => {
    const { email, otp } = req.body;
    const record = await getOTP(email);
    if (!record) {
        return res.status(400).json({ success: false, error: 'No OTP Found' })
    }
    if (Date.now() > record.Expire) {
        return res.status(400).json({ success: false, error: 'OTP Expired' })
    }
    if (String(record.OTP) !== String(otp).trim()) {
        return res.status(400).json({ success: false, error: 'Invalid OTP' })
    }
    await deleteOTP(email);
    return res.json({success: true, message: 'OTP Verified.'})
})

app.post('/Additional-Information', async (req, res) => {
    const { email, contactNumber, city, state, country, zipCode } = req.body;
    if (!email || !contactNumber || !city || !state || !country || !zipCode) {
        return res.status(400).json({ success: false, error: 'All fields are required' })
    }
    try{
    const pending = await getOTP(email);
    if (!pending) {
        return res.status(400).json({ success: false, error: 'No pending registration found for this email.'})
    }

    const fullInformation = {
        Email: email,
        FirstName: pending.FirstName,
        LastName: pending.LastName,
        Username: pending.Username,
        Password: pending.Password,
        Role: pending.Role,
        ContactNumber: contactNumber,
        City: city,
        State: state,
        Country: country,
        ZipCode: zipCode
    }
    await fullUserInformation(fullInformation);

    await deleteOTP(email);

    return res.json({success: true,})
    } catch (error) {
        return res.status(500).json({success: false, error: 'Failed to Save additional data'})
    }
})
//Register End

//Login Start


app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});