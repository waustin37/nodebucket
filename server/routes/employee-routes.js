const express = require('express');
const router = express.Router();
const Employee = require('../models/employees.js');

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
  
  

  module.exports = router; 