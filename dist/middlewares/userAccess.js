export const userAccess = (moduleName, actionName) => {
    return (req, res, next) => {
        try {
            const policies = req.policies;
            if (!policies)
                return res.status(403).json({ message: "No permissions found" });
            //super admin bypass
            if (req.user?.role === "super_admin") {
                return next();
            }
            //check permission:
            const allowed = policies.some((policy) => {
                return (policy.module === moduleName &&
                    policy.actions.includes(actionName));
            });
            if (!allowed) {
                return res.status(403).json({
                    message: "Forbidden: Access denied"
                });
            }
            next();
        }
        catch (error) {
            return res.status(500).json({
                message: "Authorization error",
            });
        }
    };
};
//# sourceMappingURL=userAccess.js.map