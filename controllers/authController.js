const pool = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const registerUser = async (req,res)=>{
    try {
        const { name, email, password } = req.body;

        if (
            typeof name !== 'string' || !name.trim() ||
            typeof email !== 'string' || !email.trim() ||
            typeof password !== 'string' || password.length < 8
        ) {
            return res.status(400).json({
                message: 'Enter a valid name, email and password of at least 8 characters'
            });
        }

        const normalizedEmail = email.trim().toLowerCase();

       
        const existingUser = await pool.query(
            'SELECT id FROM users WHERE email = $1',
            [normalizedEmail]
        );

        if (existingUser.rows.length > 0) {
            return res.status(409).json({
                message: 'Email already registered'
            });
        }

      
        const hashedPassword = await bcrypt.hash(password, 10);

       
        const result = await pool.query(
            `INSERT INTO users (name, email, password)
             VALUES ($1, $2, $3)
             RETURNING id, name, email`,
            [name.trim(), normalizedEmail, hashedPassword]
        );

        return res.status(201).json({
            message: 'User registered successfully',
            data: result.rows[0]
        });

    } catch (err) {
        console.error(err.message);
        return res.status(500).json({
            message: 'Registration failed'
        });
    }

}

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (
            typeof email !== 'string' || !email.trim() ||
            typeof password !== 'string' || !password
        ) {
            return res.status(400).json({
                message: 'Email and password are required'
            });
        }

        const normalizedEmail = email.trim().toLowerCase();

    
        const result = await pool.query(
            'SELECT * FROM users WHERE email = $1',
            [normalizedEmail]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({
                message: 'Email does not exist'
            });
        }

        const user = result.rows[0];

        
        const isPasswordValid = await bcrypt.compare(
            password,
            user.password
        );

        if (!isPasswordValid) {
            return res.status(401).json({
                message: 'Invalid password'
            });
        }

        
        const token = jwt.sign(
            {
                userId: user.id,
                email: user.email
            },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        return res.status(200).json({
            message: 'Login successful',
            token: token
        });

    } catch (err) {
        console.error(err.message);
        return res.status(500).json({
            message: 'Login failed'
        });
    }
};

module.exports = { registerUser, loginUser };
