const gameData = [
    { question: "Name something people do when they wake up.", answers: [{text: "STRETCH", pts: 35}, {text: "GO TO BATHROOM", pts: 25}, {text: "BRUSH TEETH", pts: 15}, {text: "CHECK PHONE", pts: 10}, {text: "DRINK COFFEE", pts: 8}, {text: "SNOOZE ALARM", pts: 4}, {text: "SHOWER", pts: 2}, {text: "MAKE BED", pts: 1}] },
    { question: "Name a fruit you might eat in the morning.", answers: [{text: "BANANA", pts: 40}, {text: "ORANGE", pts: 20}, {text: "GRAPEFRUIT", pts: 15}, {text: "APPLE", pts: 10}, {text: "BERRIES", pts: 8}, {text: "MELON", pts: 4}, {text: "PEAR", pts: 2}, {text: "MANGO", pts: 1}] },
    { question: "Name something you find in a kitchen.", answers: [{text: "FRIDGE", pts: 45}, {text: "STOVE", pts: 20}, {text: "SINK", pts: 12}, {text: "MICROWAVE", pts: 8}, {text: "FORKS", pts: 6}, {text: "PANS", pts: 5}, {text: "TOASTER", pts: 3}, {text: "DISHWASHER", pts: 1}] },
    { question: "Name a popular superpower.", answers: [{text: "FLIGHT", pts: 50}, {text: "INVISIBILITY", pts: 20}, {text: "STRENGTH", pts: 15}, {text: "SPEED", pts: 8}, {text: "TELEPATHY", pts: 3}, {text: "TIME TRAVEL", pts: 2}, {text: "HEALING", pts: 1}, {text: "SHAPESHIFT", pts: 1}] },
    { question: "Name a place where you have to be quiet.", answers: [{text: "LIBRARY", pts: 60}, {text: "CHURCH", pts: 15}, {text: "MOVIE THEATER", pts: 10}, {text: "HOSPITAL", pts: 8}, {text: "BEDROOM", pts: 3}, {text: "CLASSROOM", pts: 2}, {text: "COURTROOM", pts: 1}, {text: "FUNERAL", pts: 1}] }
];

let currentRound = 0;
let strikes = 0;
let roundBank = 0;
let totalScore = 0;
let revealedCount = 0;

function loadRound(index) {
    const round = gameData[index];
    strikes = 0;
    roundBank = 0;
    revealedCount = 0;
    document.getElementById('current-question').innerText = `ROUND ${index + 1}: ${round.question}`;
    document.getElementById('bank-total').innerText = "0";
    renderStrikes();
    
    for (let i = 0; i < 8; i++) {
        const slot = document.getElementById(`slot-${i}`);
        slot.classList.remove('revealed');
        document.getElementById(`ans-${i}`).innerText = round.answers[i].text;
        document.getElementById(`pts-${i}`).innerText = round.answers[i].pts;
    }
}

function checkAnswer() {
    const input = document.getElementById('user-input').value.trim().toUpperCase();
    if (!input) return;
    document.getElementById('user-input').value = "";

    const round = gameData[currentRound];
    let foundIndex = round.answers.findIndex(a => a.text === input);

    if (foundIndex !== -1) {
        const slot = document.getElementById(`slot-${foundIndex}`);
        if (!slot.classList.contains('revealed')) {
            slot.classList.add('revealed');
            roundBank += round.answers[foundIndex].pts;
            revealedCount++;
            document.getElementById('bank-total').innerText = roundBank;
            if (revealedCount === 8) endRound(true);
        }
    } else {
        triggerStrike();
    }
}

function triggerStrike() {
    strikes++;
    renderStrikes();
    const overlay = document.getElementById('strike-overlay');
    document.getElementById('strike-x').innerText = "X".repeat(strikes);
    overlay.style.display = 'flex';

    setTimeout(() => {
        overlay.style.display = 'none';
        if (strikes >= 3) endRound(false);
    }, 1200);
}

function renderStrikes() {
    const container = document.getElementById('strike-dots');
    container.innerHTML = "";
    for (let i = 0; i < 3; i++) {
        const dot = document.createElement('div');
        dot.className = i < strikes ? 'dot active' : 'dot';
        container.appendChild(dot);
    }
}

function endRound(success) {
    if (success) {
        totalScore += roundBank;
    } else {
        roundBank = 0; // Lost the round bank
    }
    
    // Show all answers
    for (let i = 0; i < 8; i++) document.getElementById(`slot-${i}`).classList.add('revealed');
    document.getElementById('total-score').innerText = totalScore;

    setTimeout(() => {
        if (currentRound < 4) {
            currentRound++;
            loadRound(currentRound);
        } else {
            document.getElementById('current-question').innerText = "GAME OVER!";
            alert(`Game Finished! Total Score: ${totalScore}`);
        }
    }, 3000);
}

// Press Enter to submit
document.getElementById('user-input').addEventListener('keypress', (e) => { if (e.key === 'Enter') checkAnswer(); });

// Initialize
loadRound(0);
