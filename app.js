const { prompt } = require('inquirer')
const mysql = require('mysql2')
require('console.table')

const db = mysql.createConnection('mysql://root:rootroot@localhost:3306/employee_db')

const runApp = () => {
  prompt([
    {
      type: "list",
      message: "What would you like to do?",
      name: "action",
      choices: [
        "View All Employees",
        "View All Employees By Role",
        "View all Emplyees By Deparment",
        "Update Employee role",
        "Add Employee",
        "Add Role",
        "Add Department",
        "Exit"
      ]
    }])
    .then(res => {
      if (res.action == 'View All Employees') { showAllEmployees() }
      else if (res.action == "View All Employees By Role") { showEmpsByRole() }
      else if (res.action == "View all Emplyees By Deparment") { showEmpsByDep() }
      else if (res.action == "Add Employee") { addEmployee() }
      else if (res.action == "Add Role") { addRole() }
      else if (res.action == "Add Department") { addDep() }
      else if (res.action == "Update Employee role") { updateRole() }
      else {
        console.log('Goodbye!')
        process.exit()}
    })
    .catch(err => console.log(err))

}
const showAllEmployees = () => {
  db.query('SELECT e.id, e.first_name, e.last_name, role.title, department.name AS department, role.salary, m.last_name AS manager FROM employee e LEFT JOIN employee m ON e.manager_id = m.id INNER JOIN role ON e.role_id = role.id INNER JOIN department ON role.department_id = department.id', (err, employees) => {
    if (err) { console.log(err) }
    console.table(employees)
    runApp()
  })
}
const showEmpsByRole = () => {
  db.query('SELECT title FROM employee_db.role', (err, roles) => {
    if (err) { console.log(err) }
    let roleArray = []
    for (let i = 0; i < roles.length; i++) { roleArray.push(roles[i].title) }
    prompt({
      name: "role",
      type: "list",
      message: "Which role would you like to search?",
      choices: roleArray
    })
      .then(res => {
        db.query(`SELECT e.id AS ID, e.first_name AS 'First Name', e.last_name AS 'Last Name', role.title AS Title, department.name AS Department, role.salary AS Salary, m.last_name AS Manager FROM employee e LEFT JOIN employee m ON e.manager_id = m.id INNER JOIN role ON e.role_id = role.id INNER JOIN department ON role.department_id = department.id WHERE role.title = '${res.role}'`, (error, employees) => {
          console.table(employees)
          runApp()
        })
      })
  })
}
const showEmpsByDep = () => {
  db.query('SELECT name FROM employee_db.department', (err, deps) => {
    if (err) { console.log(err) }
    let depArray = []
    for (let i = 0; i < deps.length; i++) { depArray.push(deps[i].name) }
    prompt({
      name: "dep",
      type: "list",
      message: "Which department would you like to search?",
      choices: depArray
    })
      .then(res => {
        db.query(`SELECT e.id AS ID, e.first_name AS 'First Name', e.last_name AS 'Last Name', role.title AS Title, department.name AS Department, role.salary AS Salary, m.last_name AS Manager FROM employee e LEFT JOIN employee m ON e.manager_id = m.id INNER JOIN role ON e.role_id = role.id INNER JOIN department ON role.department_id = department.id WHERE department.name = '${res.dep}'`, (error, employees) => {
          console.table(employees)
          runApp()
        })
      })
  })
}
const addEmployee = () => {
  prompt([
    {
      name: "firstName",
      type: "input",
      message: "What is the first name of the new employee?"
    },
    {
      name: "lastName",
      type: "input",
      message: "What is the last name of the new employee?"
    },
    {
      name: "roleId",
      type: "input",
      message: "What is the role ID of the new employee?"
    },
    {
      name: "managerId",
      type: "input",
      message: "What is the manager ID of the new employee?"
    }
  ])
    .then(res => {
      db.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id)
                VALUES ("${res.firstName}", "${res.lastName}", ${parseInt(res.roleId)}, ${parseInt(res.managerId)})`, (err, res2) => {
        if (err) { console.log(err) }
        console.log('new employee added!')
        runApp()
      })
    })
}
const addRole = () => {
  prompt([
    {
      name: 'roleTitle',
      type: "input",
      message: 'Enter the title for the new role:'
    },
    {
      name: 'salary',
      type: "input",
      message: 'Enter the salary for the new role:'
    },
    {
      name: 'depId',
      type: "input",
      message: 'Enter the department ID for the new role:'
    }
  ])
    .then(res => {
      db.query(`INSERT INTO role (title, salary, department_id)
                VALUES ("${res.roleTitle}", ${res.salary}, ${parseInt(res.depId)})`, (err, res2) => {
        if (err) { console.log(err) }
        console.log('new role added!')
        runApp()
      })
    })
}
const addDep = () => {
  prompt({
    name: 'depName',
    type: 'input',
    message: 'Enter a name for the new department:'
  })
    .then(res => {
      db.query(`INSERT INTO department (name)
                VALUES ("${res.depName}")`, (err, res2) => {
        if (err) { console.log(err) }
        console.log('new department added!')
        runApp()
      })
    })
}
const updateRole = () => {
  db.query('SELECT * FROM employee', (err, res) => {
    if (err) { console.log(err) }
    let employeeArray = []
    res.forEach(i => {
      employeeArray.push(i.first_name)
    });
    prompt([
      {
        name: 'employeeName',
        type: 'list',
        message: 'Please select the employee',
        choices: employeeArray
      }
    ])
      .then(answer => {
        console.log(answer.employeeName)
        db.query('SELECT * from role', (err2, res2) => {
          if (err2) { console.log(err2) }
          let roleArray = []
          res2.forEach(role => {
            roleArray.push({ name: role.title, value: role.id })
          });
          //ASk the role 
          prompt(
            {
              name: 'roleId',
              type: 'list',
              message: 'Please select the new role:',
              choices: roleArray
            })
            .then(answer2 => {
              db.query('UPDATE employee SET role_id = ? WHERE first_name = ?', [answer2.roleId, answer.employeeName], (err3, res3)=>{
                if (err3) { console.log(err3) }
                console.log(`updated role for ${answer.employeeName}`);
                runApp()
              })
            })
        })
      })
  })
}
runApp()
