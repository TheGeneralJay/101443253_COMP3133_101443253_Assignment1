module.exports = `#graphql
  type User {
    username: String
    email: String
    password: String
    created_at: String # Make this Date later.
    updated_at: String # Make this Date later.
  }

  type Employee {
    first_name: String
    last_name: String
    email: String
    gender: String
    designation: String
    salary: Float
    date_of_joining: String # Make this Date later.
    department: String
    employee_photo: String
    created_at: String # Make this Date later.
    updated_at: String # Make this Date later.
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
  }

  type Mutation {
    signup(userInput: UserInput): User!
    createEmployee(employeeInput: EmployeeInput): Employee!
    updateEmployee(ID: ID!, updateEmployeeInput: UpdateEmployeeInput): String
    deleteEmployee(ID: ID!): String
  }
`;
