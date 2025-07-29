// Deposit some money 
// collect the bet on
// determine number of lines to bet on
// spin the slot machine 
// check if the palyer won 
// play again 

const prompt = require('prompt-sync')();

const ROWS = 3;
const COLUMNS = 3;
 

const SYMBOLS_COUNT = {
    A: 2,
    B: 4,
    C: 6,
    D: 8,
};

const SYMBOLS_VALUES = {
    A: 5,
    B: 4,
    C: 3,
    D: 2,
};





const deposit = () => {
    while(true){
        const depositAmount = prompt('Enter deposit amount: ');
        if (isNaN(depositAmount) || depositAmount <= 0) {
            console.log('Please enter a valid deposit amount.');
            return deposit();
        }else {
        console.log(`You have deposited $${depositAmount}`);
        return parseFloat(depositAmount);
        }
    }
}

const getNumberOfLines = () => {
    while(true){
        const lines = prompt('Enter the number of lines to bet on (1-3): ');
        const numberOfLines = parseInt(lines);

        if(isNaN(numberOfLines) || numberOfLines <= 0 || numberOfLines >3){
            console.log('INVALID, Please enter a valid number of lines (1-3).');
        } else {
            return numberOfLines;
        }
    }
};

const getBet = (balance, lines) => {
    while(true){
        const bet = prompt('Enter the bet amount per line: $ ');
        const betAmount = parseInt(bet);

        if(isNaN(betAmount) || (betAmount*lines) <= 0 || (betAmount*lines) > balance){
            console.log('INVALID, Please enter the correct value for the bet.');
        } else {
            return betAmount ;
        }
    }
};


const spin = () =>{
    const symbols = [];
    for (const[symbol,count]  of Object.entries(SYMBOLS_COUNT)) {
        for (let i = 0; i < count; i++) {
            symbols.push(symbol);
        }
    }

    const reels = [];
    for(let i=0; i < COLUMNS; i++){
        reels.push([]); 
        // add the remaining symbols to the reels
        // copy symbols array to reelsymbols
        const reelsymbols = [...symbols];
        for (let j=0;j < ROWS; j++){
            // Math.floor to round down the numb er
            const selectedsymbols = reelsymbols[Math.floor(Math.random() * reelsymbols.length)];
            reels[i].push(selectedsymbols);
            // remove from the above array.
            reelsymbols.splice(reelsymbols.indexOf(selectedsymbols), 1); // remove the selected symbol
    }
}
return reels;
};


// transpose the array
const transpose = (reels) =>{
     const rows = [];
     
     for (let i = 0; i < ROWS; i++) {
         rows.push([]);
            for (let j = 0; j < COLUMNS; j++) {
                rows[i].push(reels[j][i]);
            }
        }
        return rows;
};

const printRows = (rows) => {
    for (const row of rows) {
        let rowString = '';
        for (const symbol of row) {
            rowString += symbol + ' | ';
        }
        console.log(rowString);
    }
};

const wonLine = (rows, line) =>{
    if(rows[line][0] === rows[line][1] && rows[line][0] === rows[line][2]){
        return true;
    }
    return false;
};

const won_game = (rows, bet, lines) => {
    let winning = 0; 
    for (let i = 0; i < ROWS; i++) {
        if (wonLine(rows, i)) {
            winning += SYMBOLS_VALUES[rows[0][i]] * bet;
            console.log(`You won on line ${i + 1}!`);
        }
    }
    return winning;
}

const first = () => {
    let balance = deposit(); 
    console.log(`You have a balance of $${balance}`);
    const numberOfLines = getNumberOfLines();
    const bet = getBet(balance,numberOfLines);
    const reels = spin();
    const newreel = transpose(reels);
    console.log(newreel);
    printRows(newreel);

    const winnings = won_game(newreel, bet, numberOfLines);
    balance += winnings - (bet * numberOfLines);
    console.log(`You have a balance of $${balance}`);
    const second = () => {
        while (true){
            const reels = spin();
            const newreel = transpose(reels);
            printRows(newreel);
            const winnings = won_game(newreel, bet, numberOfLines);
            balance += winnings - (bet * numberOfLines);
            console.log(`You have a balance of $${balance}`);
            if (balance <= 0) {
                console.log('You have no balance left. Game over!');
                break;
            }
            const playAgain = prompt('Press Y to exit ').toLowerCase();
            if (playAgain !== 'y') {
                continue;
            } else {
                console.log('Thanks for playing!');
                break;
            }
        }
    };
    second();
}


first();

