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
      try {
        const isMatch = await user.comparePassword(password);

        if (isMatch) {
          return user;
        } else {
          throw new Error();
        }
      } catch (err) {
        throw new GraphQLError("ERROR: Password is incorrect.", {
          extensions: {
            code: "BAD_USER_INPUT",
            argumentName: "password",
          },
        });
      }
    },

    async getEmployees(_) {
      return await Employee.find({});
    },

    async getEmployeeById(_, id) {
      try {
        const employee = await Employee.findById(id.ID);

        // If employee does not exist, throw an error.
        if (employee == null) {
          throw new GraphQLError(
            `ERROR: Employee with ID ${id.ID} does not exist.`,
            {
              extensions: {
                code: "BAD_USER_INPUT",
                argumentName: "ID",
              },
            }
          );
        }

        return employee;
      } catch (err) {
        // If we get here, the objectID is invalid.
        // This stops Mongo from throwing it's own error.
        throw new GraphQLError(
          `ERROR: Employee with ID ${id.ID} does not exist.`,
          {
            extensions: {
              code: "BAD_USER_INPUT",
              argumentName: "ID",
            },
          }
        );
      }
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
      // Ensure given email does not belong to another account.
      const checkDuplicates = await User.findOne({ email: email });

      if (checkDuplicates !== null) {
        throw new GraphQLError(
          `ERROR: Account with email ${email} already exists.`,
          {
            extensions: {
              code: "BAD_USER_INPUT",
              argumentName: "email",
            },
          }
        );
      }

      const createdUser = new User({
        username: username,
        email: email,
        password: password,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });

      await createdUser.save();

      return createdUser;
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
      if (!isValidGender(gender)) {
        throw new GraphQLError(
          `ERROR: Gender input invalid, please choose ["MALE", "FEMALE", or "OTHER"]`,
          {
            extensions: {
              code: "BAD_USER_INPUT",
              argumentName: "gender",
            },
          }
        );
      }

      // If email is not unique, throw error.
      const checkDuplicates = await Employee.findOne({ email: email });

      if (checkDuplicates !== null) {
        throw new GraphQLError(
          `ERROR: Employee with email ${email} already exists.`,
          {
            extensions: {
              code: "BAD_USER_INPUT",
              argumentName: "email",
            },
          }
        );
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
      // Ensure email isn't being changed to one already in use.
      const checkDuplicates = await Employee.findOne({ email: email });

      if (checkDuplicates !== null) {
        throw new GraphQLError(
          `ERROR: Employee with email ${email} already exists.`,
          {
            extensions: {
              code: "BAD_USER_INPUT",
              argumentName: "email",
            },
          }
        );
      }

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
            updated_at: new Date().toISOString(),
          }
        )
      ).modifiedCount;

      if (edited) {
        return `Employee #${ID} has been updated successfully.`;
      }
    },

    async deleteEmployee(_, { ID }) {
      try {
        const deleted = (await Employee.deleteOne({ _id: ID })).deletedCount;

        if (deleted) {
          return `Employee #${ID} was deleted successfully.`;
        } else {
          // This means we likely already deleted the user, as the ID is valid but no longer belongs to anyone.
          // Throw error to reach the catch block and avoid issues.
          throw new Error();
        }
      } catch (err) {
        throw new GraphQLError(
          `ERROR: Employee with ID ${ID} does not exist.`,
          {
            extensions: {
              code: "BAD_USER_INPUT",
              argumentName: "ID",
            },
          }
        );
      }
    },
  },
};
