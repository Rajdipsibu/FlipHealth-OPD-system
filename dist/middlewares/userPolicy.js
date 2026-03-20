import jwt from 'jsonwebtoken';
import env from "../config/env.js";
export const userPolicy = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ message: "No token provided" });
        }
        const token = authHeader.split(" ")[1];
        if (!token) {
            return res.status(401).json({ message: "Invalid token format" });
        }
        const decoded = jwt.verify(token, env.JWT_SECRET);
        //attach to the request:
        req.user = {
            id: decoded.id,
            email: decoded.email
        };
        req.policies = decoded.policies || [];
        next();
    }
    catch (err) {
        console.error(err);
        return res.status(401).json({ message: "Unauthorized" });
    }
};
//# sourceMappingURL=userPolicy.js.map