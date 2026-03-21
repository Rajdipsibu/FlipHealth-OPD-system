import type{ Request, Response } from "express";
import PermissionRole from "../models/PermissionRole.js";
import ModuleAction from "../models/ModuleAction.js";
import Module from "../models/Module.js";
import Action from "../models/Action.js";

// 1. Get all permissions assigned to a specific Role
export const getRolePermissions = async (req: Request, res: Response) => {
  try {
    const roleId = Number(req.params.roleId);
    if (isNaN(roleId)) return res.status(400).json({ message: "Invalid Role ID!" });

    const permissions = await PermissionRole.findAll({
      where: { role_id: roleId },
      include: [
        {
          model: ModuleAction,
          include: [
            { model: Module, attributes: ['name', 'code'] },
            { model: Action, attributes: ['name'] }
          ]
        }
      ]
    });

    return res.status(200).json({ data: permissions });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Error fetching permissions!" });
  }
};

// 2. Assign a Module Action to a Role
export const createRolePermission = async (req: Request, res: Response) => {
  try {
    const role_id = Number(req.params.roleId);
    const { module_action_id } = req.body;

    if (isNaN(role_id) || !module_action_id) {
      return res.status(400).json({ message: "Role ID and Module Action ID are required!" });
    }

    // Check if the permission already exists for this role (Unique check)
    const existing = await PermissionRole.findOne({ 
      where: { role_id, module_action_id } 
    });

    if (existing) {
      return res.status(400).json({ message: "This permission is already assigned to this role!" });
    }

    const permission = await PermissionRole.create({ 
      role_id, 
      module_action_id 
    });

    return res.status(201).json({ message: "Permission assigned successfully!", data: permission });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error!" });
  }
};

// 3. Remove a specific permission by ID
export const deleteRolePermission = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) return res.status(400).json({ message: "Invalid ID!" });

    const deleted = await PermissionRole.destroy({ where: { id } });

    if (!deleted) {
      return res.status(404).json({ message: "Permission record not found!" });
    }

    return res.status(200).json({ message: "Permission removed successfully!" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error!" });
  }
};
