let players = [];
let currentPlayerIndex = 0;
let consecutiveSkipCount = 0;

const button = document.querySelector("#play__btn");
const playerCountInput = document.querySelector("#player_count");
const playerDisplay = document.querySelector("#current-player-display");

button.addEventListener('click', playGame);

function playGame() {
    let count = Number(playerCountInput.value);
    if (count < 1) count = 1;
    if (count > 5) count = 5;
    playerCountInput.value = count;

    button.disabled = true;
    playerCountInput.disabled = true;

    players = initPlayers(count);

    currentPlayerIndex = 0;
    consecutiveSkipCount = 0;
    const container = document.querySelector(".container");
    updateTurn(container);
}

function updateTurn(container) {
    if (consecutiveSkipCount === players.length) {
        alert("ИГРА ОКОНЧЕНА: Ни у кого нет доступных ходов!");
        resetGame();
        return;
    }
    const currentPlayer = players[currentPlayerIndex];
    playerDisplay.innerHTML = `Ход: ${currentPlayer.name}`;
    updateSelectionButtons(container);
}

function initArray(array) {
    for (let i = 1; i <= 12; i++) {
        array.push({ value: i, isChosen: false });
    }
    return array;
}

function randNum() {
    return Math.floor(Math.random() * 6) + 1;
}

function initPressBtn(array, idBtn, isAvailable) {
    const btn = document.createElement("div");
    btn.classList.add("choose");
    if (!isAvailable) btn.classList.add("disabled");
    const content = (idBtn == 1) ? `${array[0]}, ${array[1]}` : `${array[0] + array[1]}`;
    btn.innerHTML = content;
    btn.dataset.values = content;
    return btn;
}

function renderCards(container, chooseNum1, chooseNum2) {
    container.innerHTML = "";
    const currentPlayer = players[currentPlayerIndex];
    currentPlayer.numArray.forEach(card => {
        const num = document.createElement("div");
        num.innerHTML = card.value;
        num.classList.add(card.isChosen ? "chosen" : "border");
        container.appendChild(num);
    });
    container.appendChild(chooseNum1);
    container.appendChild(chooseNum2);
}

function removeCards(event) {
    if (event.target.classList.contains("disabled")) return;
    consecutiveSkipCount = 0;
    const valString = event.target.dataset.values;
    const array = valString.split(",").map(Number);
    const currentPlayer = players[currentPlayerIndex];
    array.forEach(val => {
        const foundObject = currentPlayer.numArray.find(card => card.value == val);
        foundObject.isChosen = true;
    });
    const container = document.querySelector(".container");
    if (currentPlayer.numArray.every(card => card.isChosen)) {
        alert(`ПОБЕДА! ${currentPlayer.name} очистил поле!`);
        resetGame();
        return;
    }
    currentPlayerIndex = (currentPlayerIndex + 1) % players.length;
    updateTurn(container);
}

function updateSelectionButtons(container) {
    const currentPlayer = players[currentPlayerIndex];
    const n1 = randNum(), n2 = randNum();
    const sum = n1 + n2;
    const canPickIndividual = (n1 != n2) && currentPlayer.numArray.find(c => c.value == n1 && !c.isChosen) || currentPlayer.numArray.find(c => c.value == n2 && !c.isChosen);
    const canPickSum = currentPlayer.numArray.find(c => c.value == sum && !c.isChosen);

    if (!canPickIndividual && !canPickSum) {
        alert(`${currentPlayer.name}: Выпало ${n1} и ${n2}. Ходов нет!`);
        consecutiveSkipCount++;
        currentPlayerIndex = (currentPlayerIndex + 1) % players.length;
        updateTurn(container);
        return;
    }
    
    const arrOfChosen = [n1, n2];
    const chooseNum1 = initPressBtn(arrOfChosen, 1, canPickIndividual);
    const chooseNum2 = initPressBtn(arrOfChosen, 2, canPickSum);
    chooseNum1.addEventListener('click', removeCards);
    chooseNum2.addEventListener('click', removeCards);
    renderCards(container, chooseNum1, chooseNum2);
}

function initPlayers(count){
    let array=[]
    for (let i = 1; i <= count; i++) {
        array.push({
            name: `Игрок ${i}`,
            numArray: initArray([]),
            isWinner: false
        });
    }
    return array;
}

function resetGame() {
    button.disabled = false;
    playerCountInput.disabled = false;
    playerDisplay.innerHTML = "Нажмите PLAY, чтобы начать";
    document.querySelector(".container").innerHTML = "";
    consecutiveSkipCount = 0;
}