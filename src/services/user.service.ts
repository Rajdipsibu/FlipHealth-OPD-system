import bcrypt from "bcrypt";
import { UserRepository } from "../repositories/user.repository.js";
import type { CreateUserInput } from "../schema/user.schema.js";

const userRepository = new UserRepository();

export class UserService {

  async registerUser(userData: CreateUserInput){
    
    const { email, password, phone, ...otherData } = userData;

    const existing = await userRepository.findByEmail(userData.email);

    if(existing){
      throw new Error("EMAIL_ALREADY_EXISTS");
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10);

    const newUser = await userRepository.create({
      ...otherData,
      email,
      password:hashedPassword,
      ...(phone !== undefined && {phone})
    });

    return newUser;
  }
  
}