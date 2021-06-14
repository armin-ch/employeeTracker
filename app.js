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
        "Add Department"
      ]
    }])
    .then(res=>{
      if (res.action =='View All Employees') {showAllEmployees()}
      else if (res.action == "View All Employees By Role") {showEmpsByRole()}
    })
    .catch(err => console.log(err))

}
const showAllEmployees = () =>{
  db.query('SELECT e.id, e.first_name, e.last_name, role.title, department.name AS department, role.salary, m.last_name AS manager FROM employee e LEFT JOIN employee m ON e.manager_id = m.id INNER JOIN role ON e.role_id = role.id INNER JOIN department ON role.department_id = department.id', (err, employees) => {
    if (err) { console.log(err) }
    console.table(employees)
  })
}
const showEmpsByRole = () => {
  db.query('SELECT title FROM employee_db.role', (err, roles) => {
    if (err) { console.log(err) }
    let roleArray=[]
    for (let i=0; i<roles.length; i++) {roleArray.push(roles[i].title)}
    prompt({
      name: "role",
      type: "list",
      message: "Which role would you like to search?",
      choices: roleArray
    })
    .then(res=>{
      db.query(`SELECT e.id AS ID, e.first_name AS 'First Name', e.last_name AS 'Last Name', role.title AS Title, department.name AS Department, role.salary AS Salary, m.last_name AS Manager FROM employee e LEFT JOIN employee m ON e.manager_id = m.id INNER JOIN role ON e.role_id = role.id INNER JOIN department ON role.department_id = department.id WHERE role.title = '${res.role}'`, (error, employees)=>{
        console.table(employees)
      })
    })
})
}
runApp()
