import express from 'express';
import cors from 'cors';
import { writeRegisterData } from './Firebase.mjs';

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Register
app.post('/save-user', async (req, res) => {
    try {
        const { email, firstName, lastName, password, role } = req.body;
        if (!email || !firstName || !lastName || !password) {
            return res.status(400).json({ success: false, error: 'All fields are required' });
        }
        const user = await writeRegisterData(email, firstName, lastName, password, role);
        console.log('User Registered:', user);
        return res.json({ success: true });
    } catch (error) {
        console.log('User not registered:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

