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

let currentRound = 0;
let strikes = 0;
let roundBank = 0;
let totalScore = 0;
let revealedCount = 0;

// Listen for "Enter" key on input
document.getElementById('user-input').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') checkAnswer();
});

function loadRound(index) {
    const round = gameData[index];
    strikes = 0;
    roundBank = 0;
    revealedCount = 0;
    updateDisplays();
    
    document.getElementById('current-question').innerText = `ROUND ${index + 1}: ${round.question}`;
    
    for (let i = 0; i < 8; i++) {
        const slot = document.querySelectorAll('.slot')[i];
        slot.classList.remove('revealed');
        document.getElementById(`ans-${i}`).innerText = round.answers[i].text;
        document.getElementById(`pts-${i}`).innerText = round.answers[i].pts;
    }
}

function checkAnswer() {
    const input = document.getElementById('user-input').value.trim().toUpperCase();
    if (!input) return;

    const round = gameData[currentRound];
    let foundIndex = -1;

    // Check if input matches any answer
    round.answers.forEach((ans, index) => {
        if (ans.text === input || input.includes(ans.text) && ans.text.length > 3) {
            // Check if it's already revealed
            const slot = document.querySelectorAll('.slot')[index];
            if (!slot.classList.contains('revealed')) {
                foundIndex = index;
            }
        }
    });

    if (foundIndex !== -1) {
        reveal(foundIndex);
        roundBank += round.answers[foundIndex].pts;
        revealedCount++;
        updateDisplays();
        
        // If all answers found, move on
        if (revealedCount === 8) endRound(true);
    } else {
        showStrike();
    }

    document.getElementById('user-input').value = "";
}

function showStrike() {
    strikes++;
    const overlay = document.getElementById('strike-overlay');
    const xText = document.getElementById('strike-x');
    
    // Show X, XX, or XXX
    xText.innerText = "X".repeat(strikes);
    overlay.style.display = 'flex';

    setTimeout(() => {
        overlay.style.display = 'none';
        if (strikes >= 3) {
            endRound(false);
        }
    }, 1500);
}

function reveal(index) {
    document.querySelectorAll('.slot')[index].classList.add('revealed');
}

function endRound(success) {
    // Reveal everything
    for (let i = 0; i < 8; i++) reveal(i);
    
    if (success) {
        totalScore += roundBank;
    } else {
        alert("3 Strikes! You earned 0 for this round.");
        roundBank = 0;
    }

    document.getElementById('team1-score').innerText = totalScore;

    setTimeout(() => {
        if (currentRound < 4) {
            alert("Moving to next round!");
            currentRound++;
            loadRound(currentRound);
        } else {
            alert(`Game Over! Final Score: ${totalScore}`);
        }
    }, 3000);
}

function updateDisplays() {
    document.getElementById('bank-total').innerText = roundBank;
    document.getElementById('team1-score').innerText = totalScore;
}

// Initialize
loadRound(0);

