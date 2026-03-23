import express from "express";
import { forgotPassword, login, logout, refreshToken, regisgter, resetPassword, sendOtp, verifyOtp } from "../controllers/auth.controller.js";
import { userPolicy } from "../middlewares/userPolicy.js";
import { userAccess } from "../middlewares/userAccess.js";
import { createUser, deleteUser, getListUser, getUserById, updateUser, updateUserType } from "../controllers/user.controller.js";
import { createModules, deleteModule, getListModules, updateModule } from "../controllers/modules.controller.js";
import { createModuleAction, deleteModuleAction, getModuleActions } from "../controllers/module-action.controller.js";
import { createRolePermission, deleteRolePermission, getRolePermissions } from "../controllers/permission-role.controller.js";
import { assignUserRole, getUserRoles, removeUserRole } from "../controllers/user-role.controller.js";
import { createRole, deleteRole, getRoles, updateRole } from "../controllers/role.controller.js";
import { createAction, deleteAction, getActions, updateAction } from "../controllers/action.controller.js";

const router = express.Router();

//auth
router.post('/auth/register',regisgter);
router.post('/auth/login',login)
router.post('/auth/logout',userPolicy,logout)
router.post('/auth/refresh-token',refreshToken)
router.post('/auth/forgot-password',forgotPassword)
router.post('/auth/reset-password',resetPassword)
router.post('/auth/verify-otp', verifyOtp);
router.post('/auth/send-otp', sendOtp);

//user
router.get('/users',userPolicy,userAccess("user","listview"),getListUser) //list users
router.get('/users/:id',userPolicy,userAccess("user","view"),getUserById) //get user
router.post('/users',userPolicy,userAccess("user","create"),createUser) //create user
router.patch('/users/:id',userPolicy,userAccess("user","update"),updateUserType) //update user_type
router.put('/users/:id',userPolicy,userAccess("user","update"),updateUser) //update user
router.delete('/users/:id',userPolicy,userAccess("user","delete"),deleteUser) //soft delete

//---------------------PERMISSION (RBAC)----------------------

//role
router.get('/roles',userPolicy,userAccess("role","listview"),getRoles)
router.post('/roles',userPolicy,userAccess("role","create"),createRole)   
router.put('/roles/:id',userPolicy,userAccess("role","update"),updateRole)
router.delete('/roles/:id',userPolicy,userAccess("role","delete"),deleteRole)//soft deleted

// Modules
router.get('/modules',userPolicy,userAccess("module",'listview'),getListModules)
router.post('/modules',userPolicy,userAccess("module","create"), createModules)
router.put('/modules/:id',userPolicy,userAccess("module","update"), updateModule)
router.delete('/modules/:id',userPolicy,userAccess("module","delete"), deleteModule)//soft delete

// Actions
router.get('/actions',userPolicy,userAccess("action",'listview'),getActions)
router.post('/actions',userPolicy,userAccess("action",'create'),createAction)
router.put('/actions/:id',userPolicy,userAccess("action",'update'),updateAction)
router.delete('/actions/:id',userPolicy,userAccess("action",'delete'),deleteAction)//soft delete

// Module Actions
router.get('/module-actions',userPolicy,userAccess("module_action","listview"),getModuleActions)
router.post('/module-actions',userPolicy,userAccess("module_action","create"),createModuleAction)
router.delete('/module-actions/:id',userPolicy,userAccess("module_action","delete"),deleteModuleAction)

// Role Permissions
router.get('/permissions/roles/:roleId',userPolicy,userAccess("role","view"),getRolePermissions)
router.post('/permissions/roles/:roleId',userPolicy,userAccess("role","create"),createRolePermission)
router.delete('/permissions/roles/:id',userPolicy,userAccess("role","delete"),deleteRolePermission)


// USER ROLE ASSIGNMENT
router.post('/users/:id/roles',userPolicy,userAccess("user_role","create"),assignUserRole)//assign role
router.delete('/users/:id/roles/:roleId',userPolicy,userAccess("user_role","delete"),removeUserRole) //remove role
router.get('/users/:id/roles',userPolicy,userAccess("user_role","view"),getUserRoles) //get roles


//-------------BUSINESS MODULE ROUTES----------------

/*
//Doctor (Consultation)
router.get('/consultations')
router.post('/consultations')
router.put('/consultations/:id')
router.delete('/consultations/:id')

//Pharmacy
router.get('/pharmacies')
router.post('/pharmacies')
router.put('/pharmacies/:id')
router.delete('/pharmacies/:id')

router.get('/medicines')
router.post('/medicines')

//Doctor Profile
router.get('/doctor/profile')
router.post('/doctor/profile')
router.get('/doctor/profile')

//Customer Profile
router.get('/customer/profile')
router.post('/customer/profile')
router.put('/customer/profile')

//Pharmacy Profile
router.get('/pharmacy/profile')
router.post('/pharmacy/profile')
router.put('/pharmacy/profile')
 */

export default router;