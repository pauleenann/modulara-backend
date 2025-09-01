export const authorize = (...allowedRoles) => {
    return (req, res, next) => {
        const { role } = req.decoded;
        console.log(role)

        if (!role || !allowedRoles.includes(role)) {
            return res.status(403).json({ message: 'Forbidden: insufficient permissions' });
        }

        next();
    };
};
