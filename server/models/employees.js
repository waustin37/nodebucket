/*
============================================
; Title:  employees.js
; Author: William Austin
; Date:   October 28, 2023
; Description: Employee Mongoose model
;===========================================
*/
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let taskSchema = new Schema({
  taskId: { type: Schema.Types.ObjectId, auto: true },
  description: { type: String, required: true },
});


// Define the Employee schema
let employeeSchema = new Schema({
  employeeId: { type: String, unique: true, required: true },
  firstName: { type: String, unique: false, required: true },
  lastName: { type: String, unique: false, required: true },
  todoTasks: [taskSchema],
  doneTasks: [taskSchema],
});

// Export the Employee model
module.exports = mongoose.model('Employee', employeeSchema);
