const express=require("express")

const router= express.Router();

const {getEmployees, getEmployeeById, addEmployee, deleteEmployee, updateEmployee}=require('../controllers/employeeController');
const authorizeRoles = require('../middleware/roleMiddleware');


router.get('/',authorizeRoles('Admin', 'Manager',"Employee"),getEmployees);
router.get("/:id",authorizeRoles('Admin', 'Manager',"Employee"),getEmployeeById);
router.post("/",authorizeRoles('Admin'),addEmployee);
router.delete("/:id",authorizeRoles('Admin', 'Manager'),deleteEmployee)
router.put("/:id",authorizeRoles('Admin', 'Manager'),updateEmployee)

module.exports=router 