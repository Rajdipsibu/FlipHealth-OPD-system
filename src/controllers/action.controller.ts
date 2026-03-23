import type{ Request, Response } from "express";
import { Op } from "sequelize";
import Action from "../models/Action.js";

// 1. List all actions
export const getActions = async (req: Request, res: Response) => {
  try {
    const actions = await Action.findAll({where:{is_deleted:false}});
    return res.status(200).json({ data: actions });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Error fetching actions!" });
  }
};

// 2. Create a new action
export const createAction = async (req: Request, res: Response) => {
  try {
    const { name, code } = req.body;

    if (!name || !code) {
      return res.status(400).json({ message: "Name and code are required!" });
    }

    // Check for unique code
    const existingAction = await Action.findOne({ where: { code } });
    if (existingAction) {
      return res.status(400).json({ message: `Action code '${code}' is already in use!` });
    }

    const newAction = await Action.create({ name, code });
    return res.status(201).json({ message: "Action created successfully!", data: newAction });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error!" });
  }
};

// 3. Update an action
export const updateAction = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const { name, code } = req.body;

    if (isNaN(id)) return res.status(400).json({ message: "Invalid ID!" });

    const actionInstance = await Action.findByPk(id);
    if (!actionInstance) return res.status(404).json({ message: "Action not found!" });

    // If code is being changed, check if the new code is already taken by another record
    if (code) {
      const conflict = await Action.findOne({
        where: {
          code,
          id: { [Op.ne]: id }
        }
      });
      if (conflict) {
        return res.status(400).json({ message: "This code is already assigned to another action!" });
      }
    }

    await actionInstance.update({ name, code });
    return res.status(200).json({ message: "Action updated successfully!", data: actionInstance });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error!" });
  }
};

// 4. Delete an action
export const deleteAction = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) return res.status(400).json({ message: "Invalid ID!" });

    //check action is already deleted or doesn't exist
    const action = await Action.findOne({ where: { id, is_deleted: false } });
    if (!action) {
      return res.status(404).json({ message: "action not found or already deleted!" });
    }

    await Action.update({is_deleted:true},{ where: { id } });

    return res.status(200).json({ message: "Action deleted successfully!" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error!" });
  }
};
