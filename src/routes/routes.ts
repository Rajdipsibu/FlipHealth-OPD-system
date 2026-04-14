import express from "express";
import { changePassword, forgotPassword, getProfile, googleCallback, googleLoginRedirect, login, logout, refreshToken, regisgter, requestSSOToken, resetPassword, sendOtp, tokenExchange, verifyOtp } from "../controllers/auth.controller.js";
import { userPolicy } from "../middlewares/userPolicy.js";
import { userAccess } from "../middlewares/userAccess.js";
import { createUser, deleteUser, getListUser, getUserById, updateUser, updateUserType } from "../controllers/user.controller.js";
import { createModules, deleteModule, getListModules, updateModule } from "../controllers/modules.controller.js";
import { createModuleAction, deleteModuleAction, getModuleActions } from "../controllers/module-action.controller.js";
import { createRolePermission, deleteRolePermission, getRolePermissions } from "../controllers/permission-role.controller.js";
import { assignUserRole, getUserRoles, removeUserRole } from "../controllers/user-role.controller.js";
import { createRole, deleteRole, getRoles, updateRole } from "../controllers/role.controller.js";
import { createAction, deleteAction, getActions, updateAction } from "../controllers/action.controller.js";
import { validate } from "../middlewares/validate.js";
import { createSchema, updateSchema, updateUserTypeSchema } from "../schema/user.schema.js";
import { loginMFAChallenge, resetMFA, setupMFA, verifyAndEnableMFA } from "../controllers/mfa.controller.js";
import { iamSecurityMiddleware } from "../middlewares/iamSecurity.middleware.js";

const router = express.Router();

//auth
router.post('/auth/register',validate(createSchema),regisgter);
router.post('/auth/login',login)
router.post('/auth/logout',userPolicy,logout)
router.post('/auth/refresh-token',refreshToken)
router.post('/auth/forgot-password',forgotPassword)
router.post('/auth/reset-password',resetPassword)
router.post('/auth/verify-otp', verifyOtp);
router.post('/auth/send-otp', sendOtp);
router.get('/auth/profile',userPolicy,getProfile);
router.patch('/auth/change-password',userPolicy,changePassword)
//login with google
router.get('/auth/google',googleLoginRedirect);
router.get('/auth/google/callback',googleCallback);
//SSO
router.post('/auth/sso/request-token',iamSecurityMiddleware,requestSSOToken);
router.post('/auth/sso/token-exchange',tokenExchange)

// MFA setup
router.post('/auth/setup',userPolicy,setupMFA);
// activate MFA
router.post('/auth/verify-enable',userPolicy, verifyAndEnableMFA)
// MFA login
router.post('/auth/login-verify', loginMFAChallenge);
// reset MFA
router.post('/auth/reset-mfa',userPolicy,resetMFA)


//user
router.get('/users',userPolicy,userAccess("user","listview"),getListUser) //list users
router.get('/users/:id',userPolicy,userAccess("user","view"),getUserById) //get user
router.post('/users',userPolicy, validate(createSchema), userAccess("user","create"),createUser) //create user
router.patch('/users/:id',userPolicy, userAccess("user","update"), validate(updateUserTypeSchema), updateUserType) //update user_type
router.put('/users/:id',userPolicy,validate(updateSchema), userAccess("user","update"),updateUser) //update user
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
router.get('/module-actions',userPolicy,userAccess("module_action","listview"), getModuleActions)
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