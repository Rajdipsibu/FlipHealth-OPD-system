import express from "express";
import { login, regisgter } from "../controllers/auth.controller.js";
import { userPolicy } from "../middlewares/userPolicy.js";
import { userAccess } from "../middlewares/userAccess.js";
const router = express.Router();
//auth
router.post('/auth/register', regisgter);
router.post('/auth/login', login);
/*
router.post('/auth/logout')
router.post('/auth/refresh-token')
router.post('/auth/verify-otp')
router.post('/auth/forgot-password')
router.post('/auth/reset-password')
*/
//user
// router.get('/users/reset-password') //list users
// router.get('/users/:id') //get user
// router.post('/users') //create user
// router.put('/users/:id',) //update user
/*
router.delete('/users/:id') //soft delete
router.patch('/users/:id/status')//activate/deactivate

//---------------------PERMISSION (RBAC)----------------------

//role (RBAC)
router.get('/roles')
router.post('/roles')
router.put('/roles/:id')
router.delete('/roles/:id')

// Modules
router.get('/modules')
router.post('/modules')
router.put('/modules/:id')
router.delete('/modules/:id')

// Actions
router.get('/actions')
router.post('/actions')
router.put('/actions/:id')
router.delete('/actions/:id')

// Module Actions
router.get('/module-actions')
router.post('/module-actions')
router.delete('/module-actions/:id')

// Role Permissions
router.get('/permissions/roles/:roleId')
router.post('/permissions/roles/:roleId')
router.delete('/permissions/roles/:id')

// USER ROLE ASSIGNMENT
router.post('/users/:id/roles')//assign role
router.delete('/users/:id/roles/:roleId') //remove role
router.get('/users/:id/roles') //get roles

//-------------BUSINESS MODULE ROUTES----------------

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
//# sourceMappingURL=routes.js.map