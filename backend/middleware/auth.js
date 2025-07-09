const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        // Extract the token from the "Authorization" header
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ error: 'Missing authorization header' });
        }

        const token = authHeader.split(' ')[1]; // Expecting format: Bearer <token>
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        req.auth = { userId: decodedToken.userId }; // Attach user info to request
        next(); // Proceed
    } catch (error) {
        res.status(401).json({ error: 'Invalid or expired token' });
    }
};