# employeeTracker

## Description

This application will allow business owners to view and manage the departments, roles, and employees in their company
so they can organize and plan the business. 

## Installation

This app requires installing the following npm modules:
* [MySQL](https://www.npmjs.com/package/mysql) NPM package to connect to your MySQL database and perform queries.

* [InquirerJs](https://www.npmjs.com/package/inquirer/v/0.2.3) NPM package to interact with the user via the command-line.

* [console.table](https://www.npmjs.com/package/console.table) to print MySQL rows to the console. There is a built-in version of `console.table`, but the NPM package formats the data a little better for our purposes.

## Usage

1. Run `node app.js` in the command line to start the application.
2. Select from the menu to view or add employees, roles, departments, or managers
3. Follow prompts in the command line using up and down arrow keys.
