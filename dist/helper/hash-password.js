import User from "../models/User.js";
import bcrypt from "bcrypt";
const hashPasswords = async () => {
    try {
        const users = await User.findAll();
        for (const user of users) {
            const plainPassword = user.getDataValue("password");
            if (!plainPassword) {
                console.log(`Skipping user (no password): ${user.email}`);
                continue;
            }
            if (plainPassword.startsWith("$2b$")) {
                console.log(`Already hashed: ${user.email}`);
                continue;
            }
            const hashedPassword = await bcrypt.hash(plainPassword, 10);
            await user.update({ password: hashedPassword });
            console.log(`Updated user: ${user.email}`);
        }
        console.log("All passwords updated successfully");
        process.exit();
    }
    catch (error) {
        console.error(error);
        process.exit(1);
    }
};
hashPasswords();
//# sourceMappingURL=hash-password.js.map