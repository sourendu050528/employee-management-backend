const express=require("express")

const router= express.Router();

const {getEmployees, getEmployeeById, addEmployee, deleteEmployee, updateEmployee}=require('../controllers/employeeController');

router.get('/',getEmployees);
router.get("/:id",getEmployeeById);
router.post("/",addEmployee);
router.delete("/:id",deleteEmployee)
router.put("/:id",updateEmployee)

module.exports=router 