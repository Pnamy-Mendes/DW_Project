// authMiddleware.js
const User = require('../models/User');
const Permission = require('../models/Permission');

module.exports = {
    checkPermission: (requiredPermissionLevel) => {
        return async (req, res, next) => {
            try {
                const userId = req.user._id; // Assuming you store the user's info in req.user after authentication
                const user = await User.findById(userId);

                if (!user) {
                    return res.status(401).json({ message: "User not found" });
                }

                // Check if the user has the required permission level
                const hasPermission = user.typeUser.permissions.some(permissionId => {
                    const permission = Permission.findById(permissionId);
                    return permission.level === requiredPermissionLevel;
                });

                if (!hasPermission) {
                    return res.status(403).json({ message: "Permission denied" });
                }

                // User has the required permission, proceed to the route handler
                next();
            } catch (error) {
                console.error(error);
                res.status(500).json({ message: "Internal server error" });
            }
        };
    }
};
