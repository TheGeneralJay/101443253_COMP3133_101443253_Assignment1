const User = require("../models/User");
const Employee = require("../models/Employee");

module.exports = {
  Query: {
    async login(username, password) {
      const user = await User.findOne({ username: username });

      // If the password does not match, throw error.
      if (password != user.password) {
        throw new Error();
      }

      return user;
    },

    async getEmployees(_) {
      return await Employee.find({});
    },
  },
  Mutation: {
    async signup(_, { userInput: { username, email, password } }) {
      const createdUser = new User({
        username: username,
        email: email,
        password: password,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });

      const res = await createdUser.save();

      //   console.log("res._doc:");
      //   console.log(res._doc);

      return {
        id: res.id,
        ...res._doc,
      };
    },

    async createEmployee(
      _,
      {
        employeeInput: {
          first_name,
          last_name,
          email,
          gender,
          designation,
          salary,
          date_of_joining,
          department,
          employee_photo,
        },
      }
    ) {
      const createdEmployee = new Employee({
        first_name: first_name,
        last_name: last_name,
        email: email,
        gender: gender,
        designation: designation,
        salary: salary,
        date_of_joining: new Date(date_of_joining).toISOString(),
        department: department,
        employee_photo: employee_photo,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });

      const res = await createdEmployee.save();

      console.log("res._doc:");
      console.log(res._doc);

      return createdEmployee;
    },

    async updateEmployee(
      _,
      {
        ID,
        updateEmployeeInput: {
          first_name,
          last_name,
          email,
          gender,
          designation,
          salary,
          department,
          employee_photo,
        },
      }
    ) {
      const edited = (
        await Employee.updateOne(
          { _id: ID },
          {
            first_name: first_name,
            last_name: last_name,
            email: email,
            gender: gender,
            designation: designation,
            salary: salary,
            department: department,
            employee_photo: employee_photo,
          }
        )
      ).modifiedCount;

      if (edited) {
        return `Employee #${ID} has been updated successfully.`;
      }
    },

    async deleteEmployee(_, { ID }) {
      const deleted = (await Employee.deleteOne({ _id: ID })).deletedCount;

      if (deleted) {
        return `Employee #${ID} was deleted successfully.`;
      }
    },
  },
};
