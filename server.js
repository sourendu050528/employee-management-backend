const app = require('./app');

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`server is running on port ${port}`);
});

require('dotenv').config();

console.log(
    "JWT secret loaded:",
    Boolean(process.env.JWT_SECRET)
);