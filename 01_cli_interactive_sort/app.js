#! /usr/bin/env node

const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout,
});

function initCLI() {
    readline.question(`Hello. Enter few words or digits dividing them in spaces (or type "exit" to quit): `, (input) => {
        if (input.toLowerCase() === 'exit') {
            readline.close();
            return;
        }
        const wordsDictionary = input.split(' ');
        getSortingOption(wordsDictionary);
    });
}

function getSortingOption(data) {
    readline.question(`
How would you like to sort values:
1. Sort words alphabetically
2. Show numbers from smallest to greatest
3. Show numbers from greatest to smallest
4. Display words in ascending order by the number of letters
5. Show only unique words
6. Display only unique values from the set of words and numbers entered by the user
Select (1-5) and press Enter (or type "exit" to quit): `, (num) => {
        if (num.toLowerCase() === 'exit') {
            readline.close();
            return;
        }

        switch (num) {
            case '1':
                console.log(data.filter(item => (!parseFloat(item) && item)).sort());
                break;
            case '2':
                console.log(data.filter(item => parseFloat(item)).map(parseFloat).sort((a, b) => a - b));
                break;
            case '3':
                console.log(data.filter(item => parseFloat(item)).map(parseFloat).sort((a, b) => b - a));
                break;
            case '4':
                console.log(data.filter(item => (!parseFloat(item) && item)).sort((a, b) => a.length - b.length));
                break;
            case '5':
                const words = data.filter(item => !parseFloat(item) && item);
                console.log([...new Set(words)]);
                break;
            case '6':
                console.log([...new Set(data.filter(item => item))]);
                break;
            default:
                console.log('Invalid option. Please select a valid sorting option (1-6).');
        }

        initCLI();
    });
}

initCLI();
