const authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user || !allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ error: "Access denied. Insufficient permissions." });
        }
        next();
    };
};

module.exports = authorizeRoles;


// Basic  examle usage:

/* // Only "admin" can access this route
router.get("/admin-route", authenticateUser, authorizeRoles("admin"), (req, res) => {
    res.json({ message: "Welcome, Admin!" });
});

// Both "admin" and "participant" can access this route
router.get("/common-route", authenticateUser, authorizeRoles("admin", "participant"), (req, res) => {
    res.json({ message: "Hello, user!" });
}); */