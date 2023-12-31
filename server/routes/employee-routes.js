const express = require('express');
const router = express.Router();
const Employee = require('../models/employees.js');
const mongoose = require('mongoose');

/**
 * findEmployeeById
 * @openapi
 * /api/employees/{employeeId}:
 *   get:
 *     tags:
 *       - Employee
 *     description: API for returning an Employee document
 *     summary: Returns a Single Employee Document
 *     parameters:
 *       - name: employeeId
 *         in: path
 *         required: true
 *         description: Employee Id
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: "Successful retrieval of a document containing the employee"
 *       '400':
 *         description: "Bad Request"
 *       '404':
 *         description: "Not Found"
 *       '500':
 *         description: "Server exceptions"
 */

router.get("/employees/:employeeId", async (req, res) => {
    try {
      const employeeId = req.params.employeeId;
  
      // Find an employee based on the 'employeeId' field from schema
      const employee = await Employee.findOne({ employeeId });
  
      if (!employee) {
        return res.status(404).json({ message: 'Employee not found' });
      }
  
      // If the employee is found, return the employee details
      res.status(200).json(employee);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: `Server Exception: ${err.message}` });
    }
  });
  
/**
 * findAllEmployees
 * @openapi
 * /api/employees:
 *   get:
 *     tags:
 *       - Employees
 *     description: API for returning an array of Employee objects.
 *     summary: returns an array of employees in JSON format.
 *     responses:
 *       '200':
 *         description: Array of Employee documents.
 *       '500':
 *         description: Server Exception.
 *       '501':
 *         description: MongoDB Exception.
 */

  router.get("/employees", async (req, res) => {
    try {
      const employees = await Employee.find({});
      res.json(employees);
    } catch (err) {
      console.error(err);
      res.status(500).send({ message: `Server Exception: ${err.message}` });
    }
  });

/**
 * findAllTasks
 * @openapi
 * /api/employees/{employeeId}/todoTasks:
 *   get:
 *     tags:
 *       - Employee
 *       - Tasks
 *     name: findAllTasks
 *     description: This API will find all the tasks attached to a particular EmployeeId
 *     summary: Finds all Tasks under an EmployeeId
 *     parameters:
 *       - name: EmployeeId
 *         in: path
 *         required: true
 *         description: Employee ID
 *         schema:
 *           type: string
 *   responses:
 *       '200':
 *         description: All Tasks for User
 *       '400':
 *         description: "Bad Request"
 *       '404':
 *         description: "Not Found"
 *       '500':
 *         description: Server Exception
 *       '501':
 *         description: MongoDB Exception
 */

router.get("/employees/:employeeId/todoTasks", async (req, res) => {
  try {
      const employee = await Employee.findOne({ employeeId: req.params.employeeId }).exec();
      if (!employee) {
          return res.status(404).json({ message: "Employee not found" });
      }
      res.json(employee);
  } catch (e) {
      console.log(e);
      res.status(500).send({
          message: `Server Exception: ${e.message}`,
      });
  }
});


/**
 * createTask
 * @openapi
 * /api/employees/{employeeId}/todoTasks:
 *   post:
 *     tags:
 *       - Employee
 *       - Tasks
 *     name: createTask
 *     description: This API will create a new tasks for the employeeId provided
 *     summary: Provide your Employee Id and create a new task for that employee
 *     parameters:
 *       - name: employeeId
 *         in: path
 *         required: true
 *         description: Employee Id
 *         schema:
 *           type: string
 *     requestBody:
 *       description: Task Information
 *       content:
 *         application/json:
 *           schema:
 *             required:
 *               - description 
 *             properties:
 *               description:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Invoice Added to User 
 *       '400':
 *         description: "Bad Request"
 *       '404':
 *         description: "Not Found"
 *       '500':
 *         description: Server Exception
 *       '501':
 *         description: MongoDB Exception
 */

router.post("/employees/:employeeId/todoTasks", async (req, res) => {
  try {
    const employee = await Employee.findOne({ employeeId: req.params.employeeId });

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    const newTask = {
      description: req.body.description,
    };

    employee.todoTasks.push(newTask);
    await employee.save();

    res.json(employee);
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: `Server Exception: ${e.message}` });
  }
});


/**
 * deleteTask
 * @openapi
 * /api/employees/{employeeId}/{taskType}/{taskId}:
 *   delete:
 *     tags:
 *       - Tasks
 *     name: deleteTask
 *     description: API for deleting an existing task document on MongoDB Atlas
 *     summary: Deletes a specific task
 *     parameters:
 *        - name: employeeId
 *          in: path
 *          required: true
 *          description: Employee Id
 *          schema:
 *            type: string
 *        - name: taskType
 *          in: path
 *          required: true
 *          description: Whether the task will be found in "to-do" or "deleted"
 *          schema: 
 *            type: string
 *        - name: taskId
 *          in: path
 *          required: true
 *          description: Task ID
 *          schema:
 *            type: string
 *            format: ObjectId
 *     responses:
 *       '200':
 *         description: Task Deleted
 *       '204':
 *         description: No Content
 *       '400':
 *         description: "Bad Request"
 *       '404':
 *         description: "Not Found"
 *       '500':
 *         description: Server Exception
 *       '501':
 *         description: MongoDB Exception
 */

router.delete("/employees/:employeeId/:taskType/:taskId", async (req, res) => {
  try {
    const employee = await Employee.findOne({ employeeId: req.params.employeeId });

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    const taskType = req.params.taskType; // either 'todoTasks' or 'doneTasks'
    const taskId = new mongoose.Types.ObjectId(req.params.taskId);

    const taskList = taskType === 'doneTasks' ? employee.doneTasks : employee.todoTasks;
    const taskIndex = taskList.findIndex(task => task.taskId.equals(taskId));

    if (taskIndex === -1) {
      return res.status(404).json({ message: "Task not found" });
    }

    taskList.splice(taskIndex, 1);
    await employee.save();

    res.status(200).json({ message: "Task Deleted" });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: `Server Exception: ${e.message}` });
  }
});


  /**
   * updateTask
   * @openapi
   * /api/employees/{employeeId}/todoTasks/{taskId}:
   *   put:
   *     tags:
   *       - Tasks
   *     name: updateTask
   *     description: API for updating an a ToDo task into a Done Task
   *     summary: Update Task
   *     parameters:
   *        - name: employeeId
   *          in: path
   *          required: true
   *          description: Employee Id
   *          schema:
   *            type: string
   *        - name: taskId
   *          in: path
   *          required: true
   *          description: Task ID
   *          schema:
   *            type: string
   *            format: ObjectId
   *     responses:
   *       '200':
   *         description: Task Updated to Completed
   *       '204':
   *         description: No Content
   *       '400':
   *         description: "Bad Request"
   *       '404':
   *         description: "Not Found"
   *       '500':
   *         description: Server Exception
   *       '501':
   *         description: MongoDB Exception
   */

router.put("/employees/:employeeId/todoTasks/:taskId", async (req, res) => {
  try {
    const employee = await Employee.findOne({ employeeId: req.params.employeeId }); 

    if (!employee){
      return res.status(404).json({ message: "Employee not found" });
    }
    const taskId = req.params.taskId;
    const taskIndex = employee.todoTasks.findIndex((task) => task.taskId == taskId);

    if(taskIndex > -1) {
      const [task] = employee.todoTasks.splice(taskIndex, 1);
      employee.doneTasks.push(task);
      await employee.save();
      return res.status(200).json({ message: "Task Moved to Complete!"});

    } else {
      return res.status(404).json({ message: "Task not found in to-do list." });
    }

  } catch (e) {
    console.error(e);
    res.status(500).json({ message: `Server Exception: ${e.message}` });
  }
});

  module.exports = router; 