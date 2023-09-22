var dict = [];
var hints = [];

async function fetchDictionary() {
    const res = await fetch("https://api.masoudkf.com/v1/wordle", {
        headers: {
            "x-api-key": "sw0Tr2othT1AyTQtNDUE06LqMckbTiKWaVYhuirv",
        },
    });
    
    const data = await res.json();
    return {dict: data.dictionary.map((word) => word.word), hints: data.dictionary.map((word) => word.hint)};
}

const state = {
    secret: '',
    grid: Array(5).fill().map(() => Array(4).fill('')),
    currentRow: 0,
    currentCol: 0,
};

var light = document.getElementById("light");
light.onclick = function() {
    document.body.classList.toggle("light-mode");
}


function updateGrid() {
    for (let i = 0; i < state.grid.length; i++){
        for (let j = 0; j < state.grid[i].length; j++) {
            const box = document.getElementById(`box${i}${j}`);
            box.textContent = state.grid[i][j];
        }
    }
}

function drawBox(container, row, col, letter = '') {
    const box = document.createElement('div');
    box.className = 'box';
    box.id = `box${row}${col}`;
    box.textContent = letter;

    container.appendChild(box);

    state.grid[row][col] = letter;

    return box;
}


function drawGrid(container) {
    const grid = document.createElement('div');
    grid.className = 'grid';

    for (let i = 0; i < 5; i++) { 
        for (let j = 0; j < 4; j++) { 
            drawBox(grid, i, j);
        }
    }

    container.appendChild(grid);
}

function registeredKeyboardEvents() {
    document.body.onkeydown = (e) => {
        const key = e.key;
        if (key == 'Enter') {
            if (state.currentCol === 4) {
                const currentWord = getCurrentWord(state.currentRow);
                if (isWordValid(currentWord)) {
                    revealWord(currentWord);
                    state.currentRow++;
                    state.currentCol = 0;
                } else {
                    alert('Not a valid word');
                }
            }
            else if (state.currentCol < 4){
                alert('Word is not long enough')
            }
        }
    
        if (key === 'Backspace') {
            removeLetter();
        }
    
        if (isLetter(key)) {
            addLetter(key);
        }
    
        updateGrid();
    };
}

function getCurrentWord(row) {
    return state.grid[row].reduce((prev, curr) => prev + curr);
}
  
function isWordValid(word) {
    return dict.includes(word);
}  

function revealWord(guess) {
    const row = state.currentRow;
    const animation_duration = 500;

    for (let i = 0; i < 4; i++) {
        const box = document.getElementById(`box${row}${i}`);
        const letter = box.textContent;

        setTimeout(() => {
            if (letter === state.secret[i]) {
                box.classList.add('right');
            }
            
            else if (state.secret.includes(letter)) {
                box.classList.add('wrong');
            }

            else {
                box.classList.add('empty');
            }
        }, ((i + 1) * animation_duration) / 2);

        box.classList.add('animated');
        box.style.animationDelay = `${(i * animation_duration) / 2} ms`
    }

    const isWinner = state.secret === guess;
    const isGameOver = state.currentRow === 4;

    setTimeout(() => {
        if (isWinner) {
            alert('Congrats! You win!');
        }

        else if (isGameOver) {
            alert(`Good try! The word was ${state.secret}.`);
        }
    }, 3 * animation_duration);
}

function isLetter(key) {
    return key.length === 1 && key.match(/[a-z]/i);
}

function addLetter(letter) {
    if (state.currentCol === 4) {
        return;
    }
    state.grid[state.currentRow][state.currentCol] = letter;
    state.currentCol++;
}

function removeLetter() {
    if (state.currentCol === 0) {
        return;
    }
    state.grid[state.currentRow][state.currentCol - 1] = '';
    state.currentCol--;
}

function showHint() {
    const hint = data[currentWordIndex].hint;
  
    const hintElement = document.getElementById('hint');
  
    hintElement.textContent = `Hint: ${hint}`;
  
    hintElement.style.display = 'block';
  }

function startOver() {
    state.secret = dict[Math.floor(Math.random() * dict.length)];
    state.grid = Array(5).fill().map(() => Array(4).fill(''));
    state.currentRow = 0;
    state.currentCol = 0;
  
    for (let i = 0; i < state.grid.length; i++){
        for (let j = 0; j < state.grid[i].length; j++) {
            const box = document.getElementById(`box${i}${j}`);
            box.classList.remove('right', 'wrong', 'empty');
        }
    }
  
    updateGrid();
    console.log(state.secret);
}
  
document.getElementById('start-over').addEventListener('click', startOver);

const infoBtn = document.getElementById('info');
const invisibleDiv = document.getElementById('invisible');
  
infoBtn.addEventListener('click', () => {
    invisibleDiv.classList.toggle('hide');
});

document.addEventListener('DOMContentLoaded', function() {
    const helpBtn = document.getElementById('help');
    const hint = document.getElementById('hint');
  
    function showHint() {
        hint.style.visibility = 'visible';
    }
  
    helpBtn.addEventListener('click', showHint);
});

async function startup() {
    const game = document.getElementById('game');
    const data = await fetchDictionary();
    dict = data.dict;
    hints = data.hints;

    const randomIndex = Number.parseInt(Math.random() * dict.length);
    var worddd = dict[randomIndex];
    word = worddd.toUpperCase();
    var hint = hints[randomIndex];

    state.secret = dict[Math.floor(Math.random() * dict.length)];

    drawGrid(game);

    registeredKeyboardEvents();

    console.log(state.secret);
}

 startup();