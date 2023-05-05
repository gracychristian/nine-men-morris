const player1 = "X";
const player2 = "O";

let currentPlayer = player1;
let player1Markers = 9;
let player2Markers = 9;

const player1Coins = document.getElementById("player1");
const player2Coins = document.getElementById("player2");
const inputs = document.querySelectorAll('input');
let isWin = false;

let isMil = null;
let isMove = false;

const turnIndicator = document.getElementById('turn-indicator');

const possibleState = [
    [0, 0], [0, 3], [0, 6], [1, 1], [1, 3], [1, 5], [2, 2], [2, 3], [2, 4], [3, 0], [3, 1], [3, 2], [3, 4], [3, 5], [3, 6], [4, 2], [4, 3], [4, 4], [5, 1], [5, 3], [5, 5], [6, 0], [6, 3], [6, 6],
]

const winningState = [
    // Row
    [[0, 0], [0, 3], [0, 6]],
    [[1, 1], [1, 3], [1, 5]],
    [[2, 2], [2, 3], [2, 4]],
    [[3, 0], [3, 1], [3, 2]],
    [[3, 4], [3, 5], [3, 6]],
    [[4, 2], [4, 3], [4, 4]],
    [[5, 1], [5, 3], [5, 5]],
    [[6, 0], [6, 3], [6, 6]],

    // Column
    [[0, 0], [3, 0], [6, 0]],
    [[1, 1], [3, 1], [5, 1]],
    [[2, 2], [3, 2], [4, 2]],
    [[0, 3], [1, 3], [2, 3]],
    [[4, 3], [5, 3], [6, 3]],
    [[2, 4], [3, 4], [4, 4]],
    [[1, 5], [3, 5], [5, 5]],
    [[0, 6], [3, 6], [6, 6]],
]

let coin = "add";
player1Coins.textContent = `Player 1 (${player1}): ${player1Markers} markers left`;
player2Coins.textContent = `Player 2 (${player2}): ${player2Markers} markers left`;
function switchPlayer() {
    if (currentPlayer === player1) {
        currentPlayer = player2;
    }
    else {
        currentPlayer = player1;
    }
    // if (!isMil) {
    turnIndicator.textContent = `Current player: ${currentPlayer}`;

    // }
}


player1Coins.addEventListener("click", function () {
    if (currentPlayer === player1 || player1Markers === 0) {
        return;
    }
    switchPlayer()
});

player2Coins.addEventListener("click", function () {
    if (currentPlayer === player2 || player1Markers === 0) {
        return;
    }
    switchPlayer()
    player2Coins.classList.add("active");
    player1Coins.classList.remove("active");
});

const cell = document.querySelectorAll('.boardCell');
cell.forEach((input) => {
    input.addEventListener('click', () => myFunction(input));

})

const allSame = (arr) => {
    return arr.every(elem => elem === arr[0] && elem !== null && elem !== '')
}

function checkAndGetValue(X, Y) {
    let inputElement = document.querySelector(`[data-row='${X}'][data-column='${Y}']`)
    return inputElement === null ? null : inputElement.value
}

function getElement(X, Y) {
    let inputElement = document.querySelector(`[data-row='${X}'][data-column='${Y}']`)
    return inputElement
}


function getNext(X, Y, isRow = true) {
    if (isRow) {
        if ((X == 0 || X == 1 || X == 2) && Y < 6 - X) {
            return getElement(X, Y + (6 - (2 * X)) / 2)
        } else if (X == 3 && Y < 6 && Y != 2) {
            return getElement(X, Y + 1)
        } else if ((X == 4 || X == 5 || X == 6) && Y < X) {
            return getElement(X, Y + (X - 3))
        }
    } else {
        if ((Y == 0 || Y == 1 || Y == 2) && X < 6 - Y) {
            return getElement(X + (6 - (2 * Y)) / 2, Y)
        } else if (Y == 3 && X < 6 && X != 2) {
            return getElement(X + 1, Y)
        } else if ((Y == 4 || Y == 5 || Y == 6) && X < Y) {
            return getElement(X + (Y - 3), Y)
        }
    }
    return null
}

function getPrevious(X, Y, isRow = true) {
    if (isRow) {
        if ((X == 0 || X == 1 || X == 2) && Y > X) {
            return getElement(X, Y - (6 - (2 * X)) / 2)
        } else if (X == 3 && Y > 0 && Y != 4) {
            return getElement(X, Y - 1)
        } else if ((X == 4 || X == 5 || X == 6) && 6 - X - Y != 0) {
            return getElement(X, Y - (X - 3))
        }
    } else {
        if ((Y == 0 || Y == 1 || Y == 2) && X > Y) {
            return getElement(X - (6 - (2 * Y)) / 2, Y)
        } else if (Y == 3 && X > 0 && X != 4) {
            return getElement(X - 1, Y)
        } else if ((Y == 4 || Y == 5 || Y == 6) && 6 - X - Y != 0) {
            return getElement(X - (Y - 3), Y)
        }
    }
    return null
}

function doMill(X, Y) {
    const currentElement = getElement(X, Y)

    if (currentElement.value != isMil) {
        currentElement.value = "";
        switchPlayer();
        isMil = null;
    }
}


function checkCondition(previousElement, afterElement, currentElement) {
    if (previousElement != null && afterElement != null && (previousElement.value == currentElement.value && afterElement.value == currentElement.value)) {
        return true
    }
    return false;
}

function canKill(X, Y) {
    // console.log('--------------------')

    const currentElement = getElement(X, Y)
    // for row
    let previousElement = getPrevious(X, Y)
    let afterElement = getNext(X, Y)
    // console.log('[ROW] previousElement', previousElement)
    // console.log('[ROW] afterElement', afterElement)

    if (checkCondition(previousElement, afterElement, currentElement)) {
        return true
    } else if (afterElement == null) {
        afterElement = getPrevious(parseInt(previousElement.getAttribute('data-row')), parseInt(previousElement.getAttribute('data-column')))
        // console.log("[ROW] afterElement == null", afterElement);
        if (checkCondition(previousElement, afterElement, currentElement)) {
            // console.log("[ROW] afterElement == null", true);
            return true
        }
    } else if (previousElement == null) {
        previousElement = getNext(parseInt(afterElement.getAttribute('data-row')), parseInt(afterElement.getAttribute('data-column')))
        // console.log("[ROW] previousElement == null", previousElement);
        if (checkCondition(previousElement, afterElement, currentElement)) {
            // console.log("[ROW] afterElement == null", true);
            return true
        }
    }
    // for column
    previousElement = getPrevious(X, Y, false)
    afterElement = getNext(X, Y, false)
    // console.log('[COLUMN] previousElement', previousElement)
    // console.log('[COLUMN] afterElement', afterElement)

    if (checkCondition(previousElement, afterElement, currentElement)) {
        return true
    } else if (afterElement == null) {
        afterElement = getPrevious(parseInt(previousElement.getAttribute('data-row')), parseInt(previousElement.getAttribute('data-column')), false)
        // console.log("[COLUMN] afterElement == null", afterElement);
        if (checkCondition(previousElement, afterElement, currentElement)) {
            // console.log("[COLUMN] afterElement == null", true);
            return true
        }
    } else if (previousElement == null) {
        previousElement = getNext(parseInt(afterElement.getAttribute('data-row')), parseInt(afterElement.getAttribute('data-column')), false)
        // console.log("[COLUMN] previousElement == null", previousElement);
        if (checkCondition(previousElement, afterElement, currentElement)) {
            // console.log("[COLUMN] previousElement == null", true);
            return true
        }
    }
    return null
}

function decreaseMarkers() {
    // console.log('currentPlayer', currentPlayer)
    if (currentPlayer === player1) {
        player1Markers--;
        player1Coins.innerHTML = `Player 1 (${player1}): ${player1Markers} markers left`;

    }
    else {
        // this.classList.add('green-bg');
        player2Markers--;
        player2Coins.innerHTML = `Player 2 (${player2}): ${player2Markers} markers left`;

    }
}

function checkWin(player) {
    playerCount = 0;
    inputs.forEach(input => {
        if(input.value === player && playerCount <3) {
            playerCount++;
        }
    });
    if(playerCount < 3) {
        if (player === player1) {
            return player2;
        } else {
            return player1;
        }
    }
    return false;
}



function increaseMarkers() {
    if (currentPlayer === player1) {
        ++player1Markers;
        // this.classList.add('red-bg');
        player1Coins.innerHTML = `player 1 (${player1}): ${player1Markers} markers left`;
    }
    else if (currentPlayer === player2) {
        // this.classList.add('green-bg');
        ++player2Markers;
        player2Coins.innerHTML = `player 2 (${player2}): ${player2Markers} markers left`;
    }
}

function enableMovablePlace(element) {
    if (element?.value === "") {
        element?.removeAttribute("disabled");
    }
}

function moveCoin(X, Y, selectedElement) {
    const checkRowNextNeighbour = getNext(X, Y)
    const checkRowPreviousNeighbour = getPrevious(X, Y)
    const checkColNextNeighbour = getNext(X, Y, false)
    const checkColPreviousNeighbour = getPrevious(X, Y, false)

    // assuming all input elements are to be disabled

    if (
        currentPlayer === selectedElement.value &&
        (
            checkRowNextNeighbour?.value === '' ||
            checkRowPreviousNeighbour?.value === '' ||
            checkColNextNeighbour?.value === '' ||
            checkColPreviousNeighbour?.value === ''
        )
    ) {
        console.log('hi')
        isMove = true;
        inputs.forEach(input => {
            input.setAttribute("disabled", "")
        });
        enableMovablePlace(checkRowNextNeighbour)
        enableMovablePlace(checkRowPreviousNeighbour)
        enableMovablePlace(checkColNextNeighbour)
        enableMovablePlace(checkColPreviousNeighbour)
        console.log(selectedElement);
        selectedElement.value = '';
        increaseMarkers();
    }
}


function myFunction(input) {
    // console.log('input.target', input.value)
    // console.log('player1Markers', player1Markers)
    // console.log('player2Markers', player2Markers)
    let X = parseInt(input.getAttribute('data-row'))
    let Y = parseInt(input.getAttribute('data-column'))
    // console.log(`X=${X}, Y=${Y}`);

    const disableMarkers = document.querySelectorAll(`input`);
    for (let input of disableMarkers) {
        input.removeAttribute("disabled");
    }
    if (isMil) {
        doMill(X, Y);
        isWin = checkWin(currentPlayer)
        if(isWin) {
            console.log("OVER winner is", isWin);
        }
        return;
    }
    // console.log('(player1Markers === 0 || player2Markers === 0) && input.value !== ""', (player1Markers === 0 || player2Markers === 0) && input.value !== "")
    if ((player1Markers === 0 || player2Markers === 0) && input.value !== "") {
        // console.log('say hi im already used', input.value, X, Y)
        // console.log('currentPlayer', currentPlayer)
        // console.log('currentPlayer', player1)
        // if (input.value === player1) {
        // console.log('player1', player1)
        moveCoin(X, Y, input)
        // }
        // return
    }

    if (input.value !== "") {
        return;
    }
    if (currentPlayer === player1 && player1Markers === 0) {
        // alert("player 1 has already placed their markers");
        return;
    }
    if (currentPlayer === player2 && player2Markers === 0) {
        // alert("player 2 has already placed their markers");
        return;
    }
    console.log("isMove", isMove);
    if(!isMove) {
        input.value = currentPlayer;
    }

    // check if player can kill
    const playerCanKill = canKill(X, Y)
    if (playerCanKill && !isMove) {
        if (currentPlayer === player1) {
            turnIndicator.textContent = `Player X you can remove: O`;
        }
        else if (currentPlayer === player2) {
            turnIndicator.textContent = `Player O you can remove: X`;
        }
        isMil = currentPlayer;
        const disableMarkers = document.querySelectorAll(`input[value='${currentPlayer}'], input[value='']`);
        for (let input of disableMarkers) {
            input.setAttribute("disabled", "");
        }
    }

    if (!isMove) {
        decreaseMarkers()
    }

    if (!isMil && !isMove) {
        switchPlayer();
    }
    isMove = false;
}
