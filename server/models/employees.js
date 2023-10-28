/*
============================================
; Title:  employees.js
; Author: William Austin
; Date:   October 28, 2023
; Description: Employee Mongoose model
;===========================================
*/
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let employeeSchema = new Schema({
    employeeId: {type: String, unique: true, required: true},
    firstName: {type: String, unique: false, required: true},
    lastName: {type: String, unique: false, required: true},
    todoTasks: {type: Array, unique: false, required: false},
    doneTasks: {type: Array, unique: false, required: false}

})

module.exports = mongoose.model('Employee', employeeSchema);