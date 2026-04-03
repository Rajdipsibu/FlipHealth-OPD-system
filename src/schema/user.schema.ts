import {z} from 'zod' ;
import User from '../models/User.js';

export const createSchema = z.object({
  body:z.object({
    name:z.string().min(3,"Name must be at least 3 characters"),
    email:z.string()
      .email("Invalid email format"),
    password:z.string()
      .min(6,{message: "Password must be at least 6 characters long"})
      .max(10,{message: "Password cannot exceed 32 characters" }),
    phone: z.string()
      .min(10, "Phone number too short")
      .max(10, "Phone number too long")
      .refine((val) => /^\d+$/.test(val), "Phone must only contain digits")
      .optional().nullable()
      .or(z.literal(''))
  })
})

export const updateSchema = z.object({
  // Validate the ID in the URL
  params: z.object({
    id: z.string().regex(/^\d+$/, "ID must be a valid number"),
  }),
  // Validate the body - everything is optional()
  body: z.object({
    name:z.string().min(3,"Name must be at least 3 characters").optional(),
    email:z.string().email("Invalid email format").optional(),
    phone:z.string() 
      .min(10, "Phone number too short")
      .max(10, "Phone number too long")
      .refine((val) => /^\d+$/.test(val), "Phone must only contain digits")
      .optional().nullable()
      .or(z.literal('')),
    status:z.boolean().optional(),
    is_verified: z.boolean().optional()
  })
})

export const updateUserTypeSchema = z.object({
   params: z.object({
    id: z.string().regex(/^\d+$/, "ID must be a valid number"),
  }),
  body:z.object({
    user_type: z.enum(["super_admin","admin","customer","doctor","pharmacy_owner"],
      { message: "Invalid user type provided"}
    ),
  }),
})





export type CreateUserInput = z.infer<typeof createSchema>['body'];
export type UpdateUserInput = z.infer<typeof updateSchema>['body'];
export type UpdateUserTypeInput = z.infer<typeof updateUserTypeSchema>['body'];