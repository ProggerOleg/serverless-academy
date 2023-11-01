const fs = require('fs');
const path = require('path');

const processFile = () => {
    try {
        const filename = 'data.json';
        const fileContents = fs.readFileSync(path.join(__dirname, filename), 'utf-8');
        return JSON.parse(fileContents);
    } catch (error) {
        console.log("Couldn't find data.json file in the folder");
    }

};

const transformJson = (items) => {
    const users = {};

    items.forEach(item => {
        const { _id, name } = item.user;
        const { startDate, endDate } = item;

        if (!users[_id]) {
            users[_id] = {
                userId: _id,
                userName: name,
                vacations: [{ startDate, endDate }]
            };
        } else {
            users[_id].vacations.push({ startDate, endDate });
        }
    });

    const result = Object.values(users);
    fs.writeFileSync(path.join(__dirname, 'result.json'), JSON.stringify(result, null, 2));

    return result;
};

const initCLI = () => {
    const content = processFile();
    transformJson(content);
};

initCLI();
