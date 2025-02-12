module.exports = `#graphql
  scalar Date

  type User {
    username: String
    email: String
    password: String
    created_at: Date
    updated_at: Date
  }

  type Employee {
    first_name: String
    last_name: String
    email: String
    gender: String
    designation: String
    salary: Float
    date_of_joining: Date
    department: String
    employee_photo: String
    created_at: Date
    updated_at: Date
  }

  input UserInput {
    username: String
    email: String
    password: String
  }

  input EmployeeInput {
    first_name: String
    last_name: String
    email: String
    gender: String
    designation: String
    salary: Float
    date_of_joining: String
    department: String
    employee_photo: String
  }

  input UpdateEmployeeInput {
    first_name: String
    last_name: String
    email: String
    gender: String
    designation: String
    salary: Float
    department: String
    employee_photo: String
  }

  type Query {
    login(username: String!, password: String!): User!
    getEmployees: [Employee]
    getEmployeeById(ID: ID!): Employee!
    getEmployeeByDesc(designationOrDepartment: String!): [Employee]
  }

  type Mutation {
    signup(userInput: UserInput): User!
    createEmployee(employeeInput: EmployeeInput): Employee!
    updateEmployee(ID: ID!, updateEmployeeInput: UpdateEmployeeInput): String
    deleteEmployee(ID: ID!): String
  }
`;
