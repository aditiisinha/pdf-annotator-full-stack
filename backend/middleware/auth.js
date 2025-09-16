import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
  try {
    // check for token in headers
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    // verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // attach user info to request
    req.user = decoded;

    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token is not valid' });
  }
};

