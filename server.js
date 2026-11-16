require('dotenv').config();

if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is missing. Please set it in your .env file.');
}

const app = require('./app');

const port = Number(process.env.PORT) || 3000;

app.listen(port, () => {
    console.log(`server is running on port ${port}`);
});

