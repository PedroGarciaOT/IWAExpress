const userService = require('../services/users-service');

module.exports = basicAuthHandler;

async function basicAuthHandler(req, res, next) {
    // allow all GETs by default
    if (req.method === 'GET') {
        return next();
    }
    // allow user authentication and registration
    if (req.path = "/auth" || req.path === '/users/authenticate' || req.path === '/users/register') {
        return next();
    }

    // check for basic auth header
    if (!req.headers.authorization || req.headers.authorization.indexOf('Basic ') === -1) {
        return res.status(401).json({ message: 'Missing Authorization Header' });
    }

    // verify auth credentials
    const base64Credentials = req.headers.authorization.split(' ')[1];
    const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
    const [username, password] = credentials.split(':');
    const user = await userService.authenticateByUsername({ username, password });
    if (!user) {
        return res.status(401).json({ message: 'Invalid Authentication Credentials' });
    }

    // attach user to request object
    req.user = user

    next();
}