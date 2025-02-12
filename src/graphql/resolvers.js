const User = require("../models/User");
const Employee = require("../models/Employee");
const { isValidGender } = require("../utils/isValidGender");
const { GraphQLError } = require("graphql");

module.exports = {
  Query: {
    async login(_, { username, password }) {
      const user = await User.findOne({ username: username });

      // If user does not exist, throw error.
      if (user == null) {
        throw new GraphQLError(
          `ERROR: Account with username ${username} does not exist.`,
          {
            extensions: {
              code: "BAD_USER_INPUT",
              argumentName: "username",
            },
          }
        );
      }

      // If the password does not match, throw error.
      if (password != user.password) {
        throw new GraphQLError("ERROR: Password is incorrect.", {
          extensions: {
            code: "BAD_USER_INPUT",
            argumentName: "password",
          },
        });
      }

      return user;
    },

    async getEmployees(_) {
      return await Employee.find({});
    },

    async getEmployeeById(_, id) {
      const employee = await Employee.findById(id.ID);

      return employee;
    },

    async getEmployeeByDesc(_, searchWord) {
      const search = searchWord.designationOrDepartment;

      const employees = await Employee.find({
        $or: [
          { designation: { $regex: search, $options: "i" } },
          { department: { $regex: search, $options: "i" } },
        ],
      });

      return employees;
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

      return res;
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
      // If the gender option is not one of the pre-defined values, do not continue.
      try {
        if (!isValidGender(gender)) {
          throw new Error();
        }
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

        const newEmployee = await createdEmployee.save();

        return newEmployee;
      } catch (err) {
        console.log("ERROR: Invalid input.");
      }
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
