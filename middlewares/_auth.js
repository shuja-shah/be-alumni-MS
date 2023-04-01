const jwt = require('jsonwebtoken');
const key = 'c0fa1bc00531bd78ef38c628449c5102aeabd49b5dc3a2a516ea6ea959d6658e';


const authCheck = (req, res, next) => {
    const token = req.header('Authorization').replace('Bearer ', '');
    if (!token) {
        return res.status(401).send({ error: 'Authentication error: no token provided' });
    }
    try {
        const decoded = jwt.verify(token, key);
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).send({ error: 'Authentication error: invalid token' });
    }
};

const isAdmin = (req, res, next) => {

    if (req.user && req.user.is_admin) {
        next();
    } else {
        res.status(401).send({ error: 'Unauthorized' });
    }
};

module.exports = {
    authCheck,
    isAdmin,
};
