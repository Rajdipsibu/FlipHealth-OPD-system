import type{ Request, Response } from "express";
import { Op } from "sequelize";
import Role from "../models/Role.js";

// 1. List all roles
export const getRoles = async (req: Request, res: Response) => {
  try {
    const roles = await Role.findAll();
    return res.status(200).json({ data: roles });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Error fetching roles!" });
  }
};

// 2. Create a new role
export const createRole = async (req: Request, res: Response) => {
  try {
    const { name, code, description } = req.body;

    if (!name || !code) {
      return res.status(400).json({ message: "Name and code are required!" });
    }

    // Check if code is already taken
    const existingRole = await Role.findOne({ where: { code } });
    if (existingRole) {
      return res.status(400).json({ message: "Role code must be unique!" });
    }

    const newRole = await Role.create({ name, code, description });
    return res.status(201).json({ message: "Role created successfully!", data: newRole });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error!" });
  }
};

// 3. Update an existing role
export const updateRole = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const { name, code, description } = req.body;

    if (isNaN(id)) return res.status(400).json({ message: "Invalid ID!" });

    const roleInstance = await Role.findByPk(id);
    if (!roleInstance) return res.status(404).json({ message: "Role not found!" });

    // Ensure the new code isn't used by another role
    if (code) {
      const codeConflict = await Role.findOne({
        where: {
          code,
          id: { [Op.ne]: id }
        }
      });
      if (codeConflict) {
        return res.status(400).json({ message: "This code is already assigned to another role!" });
      }
    }

    await roleInstance.update({ name, code, description });
    return res.status(200).json({ message: "Role updated successfully!", data: roleInstance });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error!" });
  }
};

// 4. Delete a role
export const deleteRole = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) return res.status(400).json({ message: "Invalid ID!" });

    const deleted = await Role.destroy({ where: { id } });
    if (!deleted) return res.status(404).json({ message: "Role not found!" });

    return res.status(200).json({ message: "Role deleted successfully!" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error!" });
  }
};
