import bcrypt from "bcrypt";
import { UserRepository } from "../repositories/user.repository.js";
import type { CreateUserInput } from "../schema/user.schema.js";
import OAuthAccount from "../models/OAuthAccount.js";
import sequelize from "../config/database.js";
import User from "../models/User.js";

const userRepository = new UserRepository();

export class UserService {
  async registerUser(userData: CreateUserInput) {
    const { email, password, phone, ...otherData } = userData;

    const existing = await userRepository.findByEmail(userData.email);

    if (existing) {
      throw new Error("EMAIL_ALREADY_EXISTS");
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10);

    const newUser = await userRepository.create({
      ...otherData,
      email,
      password: hashedPassword,
      ...(phone !== undefined && { phone }),
    });

    return newUser;
  }

  async handleOAuthLogin(profile: any, provider: "google" | "github") {
    const transaction = await sequelize.transaction();

    try {
      // 1. Check if this specific Social Account is already linked
      let oauthAcc = await OAuthAccount.findOne({
        where: { provider, provider_acc_id: profile.id },
        transaction,
      });

      if (oauthAcc) {
        // User has logged in with this Google/Github account before
        const user = await User.findByPk(oauthAcc.dataValues?.user_id, {
          transaction,
        });

        await transaction.commit();
        return user;
      }

      // 2. If OAuth entry doesn't exist, check if the Email exists in Users table
      let user = await User.findOne({
        where: { email: profile.emails[0].value },
        transaction,
      });

      if (!user) {
        //create new user
        user = await User.create(
          {
            name: profile.displayName,
            email: profile.emails[0].value,
            password: "OAUTH_USER",
            user_type: "customer",
            is_verified: true,
          },
          { transaction },
        );
      }

      // 4. Create the Link in oauth_accounts
      await OAuthAccount.create(
        {
          user_id: user.id,
          provider,
          provider_acc_id: profile.id,
        },
        { transaction },
      );

      await transaction.commit();
      return user;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
}
