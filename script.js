const gameData = [
    {
        question: "Name something people do when they wake up.",
        answers: [
            { text: "STRETCH", pts: 35 }, { text: "GO TO BATHROOM", pts: 25 },
            { text: "BRUSH TEETH", pts: 15 }, { text: "CHECK PHONE", pts: 10 },
            { text: "DRINK COFFEE", pts: 8 }, { text: "SNOOZE ALARM", pts: 4 },
            { text: "SHOWER", pts: 2 }, { text: "MAKE BED", pts: 1 }
        ]
    },
    {
        question: "Name a fruit you might eat in the morning.",
        answers: [
            { text: "BANANA", pts: 40 }, { text: "ORANGE", pts: 20 },
            { text: "GRAPEFRUIT", pts: 15 }, { text: "APPLE", pts: 10 },
            { text: "BERRIES", pts: 8 }, { text: "MELON", pts: 4 },
            { text: "PEAR", pts: 2 }, { text: "MANGO", pts: 1 }
        ]
    },
    {
        question: "Name something you find in a kitchen.",
        answers: [
            { text: "FRIDGE", pts: 45 }, { text: "STOVE", pts: 20 },
            { text: "SINK", pts: 12 }, { text: "MICROWAVE", pts: 8 },
            { text: "FORKS/KNIVES", pts: 6 }, { text: "PANS", pts: 5 },
            { text: "TOASTER", pts: 3 }, { text: "DISHWASHER", pts: 1 }
        ]
    },
    {
        question: "Name a popular superpower.",
        answers: [
            { text: "FLIGHT", pts: 50 }, { text: "INVISIBILITY", pts: 20 },
            { text: "STRENGTH", pts: 15 }, { text: "SPEED", pts: 8 },
            { text: "TELEPATHY", pts: 3 }, { text: "TIME TRAVEL", pts: 2 },
            { text: "HEALING", pts: 1 }, { text: "SHAPESHIFT", pts: 1 }
        ]
    },
    {
        question: "Name a place where you have to be quiet.",
        answers: [
            { text: "LIBRARY", pts: 60 }, { text: "CHURCH", pts: 15 },
            { text: "MOVIE THEATER", pts: 10 }, { text: "HOSPITAL", pts: 8 },
            { text: "BEDROOM", pts: 3 }, { text: "CLASSROOM", pts: 2 },
            { text: "COURTROOM", pts: 1 }, { text: "FUNERAL", pts: 1 }
        ]
    }
];

let currentRound = 0;

function startGame() {
    currentRound = 0;
    loadRound(currentRound);
}

function loadRound(index) {
    const round = gameData[index];
    document.getElementById('current-question').innerText = `ROUND ${index + 1}: ${round.question}`;
    
    for (let i = 0; i < 8; i++) {
        const slot = document.querySelectorAll('.slot')[i];
        slot.classList.remove('revealed');
        document.getElementById(`ans-${i}`).innerText = round.answers[i].text;
        document.getElementById(`pts-${i}`).innerText = round.answers[i].pts;
    }
}

function reveal(index) {
    const slots = document.querySelectorAll('.slot');
    slots[index].classList.add('revealed');
}

function nextRound() {
    if (currentRound < 4) {
        currentRound++;
        loadRound(currentRound);
    } else {
        alert("Game Over! Thanks for playing.");
    }
}

function prevRound() {
    if (currentRound > 0) {
        currentRound--;
        loadRound(currentRound);
    }
}


.input-area {
    margin: 20px 0;
    display: flex;
    justify-content: center;
    gap: 10px;
}

input[type="text"] {
    padding: 10px;
    font-size: 1.2rem;
    border-radius: 5px;
    border: none;
    width: 300px;
}

.round-bank {
    font-size: 1.5rem;
    color: #f1c40f;
    margin-bottom: 10px;
}

/* The Big Red X Overlay */
.strike-overlay {
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.5);
    z-index: 1000;
    justify-content: center;
    align-items: center;
}

.x-container {
    font-size: 20rem;
    color: #e74c3c;
    font-family: 'Arial', sans-serif;
    font-weight: bold;
    text-shadow: 0 0 50px #000;
    animation: shake 0.5s;
}

@keyframes shake {
    0% { transform: scale(0.5); }
    50% { transform: scale(1.2); }
    100% { transform: scale(1); }
}
