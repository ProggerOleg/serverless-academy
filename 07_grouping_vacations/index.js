// Sample original JSON data
const originalData = [
    {
        "_id": "6196a33a3a853300128602eb",
        "user": {
            "_id": "60b7c1f04df06a0011ef0e76",
            "name": "Laurence Knox"
        },
        "usedDays": 3,
        "startDate": "2021-11-19",
        "endDate": "2021-11-23"
    },
    {
        "_id": "61a3c3bb3a85330012864b5b",
        "user": {
            "_id": "60b7c1f04df06a0011ef0e76",
            "name": "Laurence Knox"
        },
        "usedDays": 2,
        "startDate": "2021-12-09",
        "endDate": "2021-12-10"
    }
];

// Transforming the original JSON
const transformedData = originalData.reduce((result, item) => {
    const foundUser = result.find(user => user.userId === item.user._id);
    const { _id, name } = item.user;
    const { startDate, endDate } = item;

    if (!foundUser) {
        result.push({
            userId: _id,
            userName: name,
            vacations: [{ startDate, endDate }]
        });
    } else {
        foundUser.vacations.push({ startDate, endDate });
    }
    return result;
}, []);

// Output the transformed JSON
console.log(JSON.stringify(transformedData, null, 2));