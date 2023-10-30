const fs = require('fs');
const path = require('path');
const { performance } = require('perf_hooks');


function processFiles() {
    const usernamesInFiles = {};
    const allUsernames = new Set();

    for (let i = 0; i <= 19; i++) {
        const filename = `out${i}.txt`;
        const fileContents = fs.readFileSync(path.join(__dirname, 'files', filename), 'utf-8');
        const usernames = fileContents.split('\n');

        const uniqueUsernames = new Set(usernames);

        uniqueUsernames.forEach(username => {
            allUsernames.add(username);

            if (usernamesInFiles[username]) {
                usernamesInFiles[username].push(i);
            } else {
                usernamesInFiles[username] = [i];
            }
        });
    }

    return { usernamesInFiles, allUsernames };
}

function uniqueValues() {
    const { allUsernames } = processFiles();
    return allUsernames.size;
}

function existInAllFiles() {
    const { usernamesInFiles } = processFiles();
    return Object.values(usernamesInFiles).filter(files => files.length === 20).length;
}


function existInAtleastTen() {
    const { usernamesInFiles } = processFiles();
    return Object.values(usernamesInFiles).filter(files => files.length >= 10).length;
}


let startTime = performance.now();

console.log('Number of unique usernames:', uniqueValues());
console.log('Usernames occurring in all 20 files:', existInAllFiles());
console.log('Usernames occurring in at least 10 files:', existInAtleastTen());

let endTime = performance.now();
console.log(`All process took ${endTime - startTime} milliseconds`);