import inquirer from 'inquirer';
import fs from 'fs';

const questions = [
    {
        type: 'input',
        name: 'name',
        message: "Enter the user's name. To cancel press ENTER: ",
    },
    {
        type: "list",
        name: "gender",
        message: "Choose your Gender. ",
        choices: ['male', 'female'],
        when: (answers) => answers.name !== '',
    },
    {
        type: 'input',
        name: 'age',
        message: "Enter your age: ",
        validate: function (input) {
            return (parseFloat(input)) ? true : "Age field must contain number. Please enter a valid age.";
        },
        when: (answers) => answers.name !== '',
    },
    {
        type: 'confirm',
        name: 'search',
        message: 'Would you want to search values in DB? ',
        when: (answers) => answers.name == '',
        default: undefined
    }
];

let users = [];

const searchUser = () => {
    inquirer.prompt({
        type: 'input',
        name: 'nameToFind',
        message: "Enter user's name you wanna find in DB: ",
    },).then(({ nameToFind }) => {
        const fileContent = fs.readFileSync('./db.txt', 'utf-8');
        let allUsers = JSON.parse(fileContent);
        const result = allUsers.find(user => user.name.toLowerCase() === nameToFind.toLowerCase());
        console.log(result ? `User ${nameToFind} was found.\n${JSON.stringify(result)} ` : "There is no user with such name.");
    });
};

const saveUsers = (users) => {
    try {
        const fileContent = fs.readFileSync('./db.txt', 'utf-8');
        let result = fileContent ? JSON.parse(fileContent) : [];
        users.forEach(user => {
            result.push(user);
        });
        console.log(result);
        fs.writeFileSync('./db.txt', JSON.stringify(result));
    } catch (error) {
        fs.writeFileSync('./db.txt', '');
        const fileContent = fs.readFileSync('./db.txt', 'utf-8');
        let result = fileContent ? JSON.parse(fileContent) : [];
        users.forEach(user => {
            result.push(user);
        });
        console.log(result);
        fs.writeFileSync('./db.txt', JSON.stringify(result));
    }
};

const addUsers = (name, gender, age) => {
    users.push({ name, gender, age });
};

const initClI = () => {
    inquirer.prompt(questions).then((answers) => {
        if (answers.search == undefined) {
            addUsers(answers.name, answers.gender, answers.age);
            initClI();
        } else if (answers.search == false) {
            saveUsers(users);
            process.exit(1);
        } else {
            saveUsers(users);
            searchUser();
        }
    }).catch(error => console.log(error));
};

initClI();