import type{ Request, Response } from "express";
import ModuleAction from "../models/ModuleAction.js";
import Module from "../models/Module.js";
import Action from "../models/Action.js";

// 1. Get List View 
export const getModuleActions = async (req: Request, res: Response) => {
  try {
    const list = await ModuleAction.findAll({
      include: [
        { model: Module, attributes: ['id', 'name', 'code'] },
        { model: Action, attributes: ['id', 'name'] }
      ]
    });
    return res.status(200).json({ data: list });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Error fetching module actions" });
  }
};

// 2. Create Module Action
export const createModuleAction = async (req: Request, res: Response) => {
  try {
    const { module_id, action_id } = req.body;

    if (!module_id || !action_id) {
      return res.status(400).json({ message: "module_id and action_id are required" });
    }

    //Check if this specific pair already exists to prevent duplicates
    const existing = await ModuleAction.findOne({ where: { module_id, action_id } });
    if (existing) {
      return res.status(400).json({ message: "This action is already assigned to this module" });
    }

    const newAssignment = await ModuleAction.create({ module_id, action_id });
    return res.status(201).json({ message: "Created successfully", data: newAssignment });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// 3. Delete Module Action
export const deleteModuleAction = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) return res.status(400).json({ message: "Invalid ID" });

    const deletedCount = await ModuleAction.destroy({ where: { id } });

    if (deletedCount === 0) {
      return res.status(404).json({ message: "Record not found" });
    }

    return res.status(200).json({ message: "Deleted successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};
