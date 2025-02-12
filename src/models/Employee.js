const mongoose = require("mongoose");

const EmployeeSchema = new mongoose.Schema({
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  email: String,
  gender: String,
  designation: { type: String, required: true },
  salary: { type: String, required: true }, // Make work with graphql float later.
  date_of_joining: { type: Date, required: true },
  department: { type: String, required: true },
  employee_photo: String,
  created_at: Date,
  updated_at: Date,
});

const Employee = mongoose.model("Employee", EmployeeSchema);
module.exports = Employee;
