import type{ Request, Response } from "express";
import UserRole from "../models/UserRole.js";
import Role from "../models/Role.js"; // Ensure you import the Role model

// 1. Get all roles for a specific User
export const getUserRoles = async (req: Request, res: Response) => {
  try {
    const user_id = Number(req.params.id);
    if (isNaN(user_id)) return res.status(400).json({ message: "Invalid User ID!" });

    const roles = await UserRole.findAll({
      where: { user_id },
      include: [
        { model: Role, attributes: ['id', 'name'] } // Fetches the actual Role details
      ]
    });

    return res.status(200).json({ data: roles });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Error fetching user roles!" });
  }
};

// 2. Assign a Role to a User
export const assignUserRole = async (req: Request, res: Response) => {
  try {
    
    const user_id = Number(req.params.id);
    const { role_id } = req.body;
    
    if (isNaN(user_id) || !role_id) {
      return res.status(400).json({ message: "User ID and Role ID are required!" });
    }
      
    // Check if the user already has this role
    const existing = await UserRole.findOne({ 
      where: { user_id, role_id } 
    });

    if (existing) {
      return res.status(400).json({ message: "This role is already assigned to this user!" });
    }

    const assignedRole = await UserRole.create({ user_id, role_id });
    
    return res.status(201).json({ message: "Role assigned successfully!", data: assignedRole });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error!" });
  }
};

// 3. Remove a specific Role from a User
export const removeUserRole = async (req: Request, res: Response) => {
  try {
    const user_id = Number(req.params.id);
    const role_id = Number(req.params.roleId);

    if (isNaN(user_id) || isNaN(role_id)) {
      return res.status(400).json({ message: "Invalid User or Role ID!" });
    }

    const deleted = await UserRole.destroy({ 
      where: { user_id, role_id } 
    });

    if (!deleted) {
      return res.status(404).json({ message: "Role assignment not found for this user!" });
    }

    return res.status(200).json({ message: "Role removed successfully!" });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error!" });
  }
};
