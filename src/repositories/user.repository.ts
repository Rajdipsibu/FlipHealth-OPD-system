import User, { type UserCreationAttributes } from "../models/User.js";



export class UserRepository {
  async findByEmail(email:string){
    return await User.findOne({where:{email,is_deleted:false} });
  }
  
  async create(data: UserCreationAttributes) {
    return await User.create(data);
  }
}