const jwt = require('jsonwebtoken');

function authenticateUser(req, res, next) {
    // Retrieve the token from the cookie
    const token = req.signedCookies[process.env.COOKIE_NAME];

    // Check if the token exists
    if (!token) {
        res.status(401).json({
            errors: {
                common: {
                    msg: 'Authentication Failure',
                },
            },
        });

        return;
    }

    try {
        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Attach the decoded user information to the request object
        req.user = decoded;

        // Continue to the next middleware
        next();
    } catch (error) {
        res.status(401).json({
            errors: {
                common: {
                    msg: 'Authentication Failure',
                },
            },
        });
    }
}

module.exports = authenticateUser;
