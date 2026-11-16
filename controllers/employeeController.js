const pool = require('../config/db');

const getEmployees= async (req,res)=>{
    try{
        const result = await pool.query("SELECT * FROM EMPLOYEE")

        res.status(200).json({   
            message:'Employees fetched Succesfully',
            data: result.rows
            })
    }
    catch(err){
        res.status(500).json({
            message:"Error fetching Employees",
            Error:err
        })
    }
}

const getEmployeeById= async (req,res)=>{
    try{
        const {id} = req.params
        const result = await pool.query("SELECT * FROM EMPLOYEE WHERE ID=$1",[id])

        if (result.rows.length===0){
            res.status(404).json({
                messsage:"Employee not found"
            })
        }
        else{
            res.status(200).json({
                message:'Employee fetched Succesfully',
                data: result.rows[0]
            })
        }
    }
    catch(err){
         res.status(500).json({
            message:"Error fetching Employees",
            Error:err
        })
    }
}

const addEmployee= async (req,res)=>{
    try{

        const {id,name,city,department}=req.body
        const existingEmployee= await pool.query('SELECT ID FROM EMPLOYEE WHERE ID=$1',[id])
        if(existingEmployee.rows.length>0){
            res.status(409).json({
                message:"ID already exists"
            })
        }
        else if (!id){
            res.status(400).json({
                message:"Please enter emp id"
            })
        }
        else if (name.trim()==""){
            res.status(400).json({
                message:"Please enter valid name"
            })
        }
        else if (city.trim()=="" ){
            res.status(400).json({
                message:"Please enter  valid city"
            })
        }
        else if (!["HR", "Sales", "IT", "Management"].includes(department)){
            res.status(400).json({
                message:"Please enter a valid department should be HR, Sales, IT, Management"
            })
        }
        else{
            const result=await pool.query("INSERT INTO EMPLOYEE VALUES ( $1 ,$2 ,$3 ,$4) RETURNING *",[id,name.trim(),city.trim(),department])
            res.status(201).json({
                message:"New user created successfully",
                data: result.rows[0]
            })
        }
    }
    catch(err){
        res.status(500).json({
            message:"Failed to create user",
            error:err
        })

    }
    
}

const deleteEmployee= async (req,res)=>{
    try{
        const {id}=req.params
        const existingEmployee= await pool.query("SELECT ID FROM EMPLOYEE WHERE ID=$1",[id])
        if (existingEmployee.rows.length===0){
            res.status(404).json({
                message:"Id does not exists"
            })
        }
        else{
            const result = await pool.query("DELETE FROM EMPLOYEE WHERE ID=$1 RETURNING *",[id])

            res.status(200).json({
                messsage:`Employee with ID:${id} deleted successfully`,
                data:result.rows[0]
        })
        }
        
    }
    catch(err){
        res.status(500).json({
            message:"Unable to delete",
            error:err
        })
    }
}


const updateEmployee = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, city, department } = req.body;

    
        if (!name || typeof name !== "string" || !name.trim()) {
            return res.status(400).json({
                message: "Please enter a valid name"
            });
        }

        if (!city || typeof city !== "string" || !city.trim()) {
            return res.status(400).json({
                message: "Please enter a valid city"
            });
        }

        if (!["HR", "Sales", "IT", "Management"].includes(department)) {
            return res.status(400).json({
                message: "Please enter a valid department"
            });
        }

        const exists = await pool.query(
            "SELECT id FROM employee WHERE id = $1",
            [id]
        );

        if (exists.rows.length === 0) {
            return res.status(404).json({
                message: "Employee does not exist"
            });
        }

        const result = await pool.query(
            `UPDATE employee
             SET name = $1, city = $2, department = $3
             WHERE id = $4
             RETURNING *`,
            [name.trim(), city.trim(), department, id]
        );

        return res.status(200).json({
            message: "Employee updated successfully",
            data: result.rows[0]
        });

    } catch (err) {
        console.error(err.message);

        return res.status(500).json({
            message: "Unable to update employee"
        });
    }
};


module.exports={
    getEmployees,
    getEmployeeById,
    addEmployee,
    deleteEmployee,
    updateEmployee
}
