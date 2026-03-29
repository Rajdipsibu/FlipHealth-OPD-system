import type{ Request, Response } from "express";
import { Op } from "sequelize";
import User from "../models/User.js";
import bcrypt from "bcrypt"; // Recommended for passwords
import { buildWhereClause } from "../helper/filterBuilder.js";
import type { CreateUserInput, UpdateUserInput, UpdateUserTypeInput } from "../schema/user.schema.js";
import { UserService } from "../services/user.service.js";

// Get List of Users
export const getListUser = async (req: Request, res: Response) => {
  try {
    // const token = req.token;
    const {limit, offset} = req.pagging ;

    const where = buildWhereClause(
      req.query, 
      ['email', 'phone', 'user_type'], // Allowed exact matches
      ['name', 'email']              // Fields to check during 'search'
    );

    const { count, rows: users } = await User.findAndCountAll({
      where,
      limit:limit,
      offset:offset,
      attributes: { exclude: ['password'] },
      order: [['createdAt', 'DESC']]
    });

    //total count:
    // const totalCount = await User.count({where:{is_deleted:false}});

    return res.status(200).json({ 
      data: users,
      count:{
        totalItems:count,
        currentPage: (offset / limit) + 1,
        limit
      }
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Error fetching users!" });
  }
};

// Get Single User
export const getUserById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const user = await User.findOne({
      where: { id, is_deleted: false },
      attributes: { exclude: ['password'] }
    });

    if (!user) return res.status(404).json({ message: "User not found!" });
    return res.status(200).json({ data: user });
  } catch (err) {
    return res.status(500).json({ message: "Internal server error!" });
  }
};

// Create User
// export const createUser = async (req: Request, res: Response) => {
//   try {
//     const { name, email, password, phone }:CreateUserInput = req.body;

//     if (!name || !email || !password) {
//       return res.status(400).json({ message: "Name, email, and password are required!" });
//     }

//     // Check if email already exists
//     const existing = await User.findOne({ where: { email } });
//     if (existing) return res.status(400).json({ message: "Email already registered!" });

//     // Hash password
//     const hashedPassword = await bcrypt.hash(password, 10);

//     const newUser = await User.create({
//       name,
//       email,
//       password: hashedPassword,
//       phone: phone as string
//       // user_type is handled by DB default "customer"
//     }as any);

//     // Remove password from response
//     const { password: _, ...userData } = newUser.toJSON();
//     return res.status(201).json({ message: "User created successfully!", data: userData });
//   } catch (err) {
//     console.error(err);
//     return res.status(500).json({ message: "Error creating user!" });
//   }
// };

const userService = new UserService();

export const createUser = async (req: Request, res: Response) => {
  try{
    const result = await userService.registerUser(req.body);

    return res.status(201).json({
      status:"success",
      message:"User created successfully",
      data:result,
    })
  }catch(error:any){
    // Handle specific business errors
    if(error.message === "EMAIL_ALREADY_EXISTS"){
      return res.status(400).json({message : "Email is already in use"})
    }
    return res.status(500).json({message:"Internal server error !!"});
  }
}

// Update User
export const updateUser = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const { name, email, phone, status, is_verified }:UpdateUserInput = req.body;

    const userInstance = await User.findOne({ where: { id, is_deleted: false } });
    if (!userInstance) return res.status(404).json({ message: "User not found!" });

    // Email unique check (excluding current user)
    if (email) {
      const emailCheck = await User.findOne({
        where: { email, id: { [Op.ne]: id } }
      });
      if (emailCheck) return res.status(400).json({ message: "Email is already taken!" });
    }

    await userInstance.update({
      ...(name && { name }),
      ...(email && { email }),
      ...(phone !== undefined && { phone }),
      ...(status !== undefined && { status }),
      ...(is_verified !== undefined && { is_verified }),
    });

    return res.status(200).json({ message: "User updated successfully!", data: userInstance });
  } catch (err) {
    return res.status(500).json({ message: "Internal server error!" });
  }
};

// Soft Delete User
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const user = await User.findByPk(id);

    if (!user || user.is_deleted) {
      return res.status(404).json({ message: "User not found!" });
    }

    // Set is_deleted to true instead of removing the row
    await user.update({ is_deleted: true });

    return res.status(200).json({ message: "User deleted successfully (soft delete)!" });
  } catch (err) {
    return res.status(500).json({ message: "Internal server error!" });
  }
};

export const updateUserType = async (req: Request, res: Response) =>{
  try{
    const id = Number(req.params.id);
    const {user_type}:UpdateUserTypeInput = req.body;
    if(!user_type)return res.status(401).json({message:"user type not given !!"})

    const user = await User.findByPk(id);

    if (!user || user.is_deleted) {
      return res.status(404).json({ message: "User not found!" });
    }
    await user.update({user_type});
    return res.status(200).json({message:"success",user})

  } catch (err) {
    return res.status(500).json({ message: "Internal server error!" });
  }
}