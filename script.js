// --- DATA STRUCTURE ---
let gameData = [
    { q: "Name a noisy pet.", a: Array(8).fill({t:"EMPTY", p:0}) },
    { q: "Name a yellow fruit.", a: Array(8).fill({t:"EMPTY", p:0}) },
    { q: "Round 3", a: Array(8).fill({t:"EMPTY", p:0}) },
    { q: "Round 4", a: Array(8).fill({t:"EMPTY", p:0}) },
    { q: "Round 5", a: Array(8).fill({t:"EMPTY", p:0}) }
];
let extremeRound = { q: "EXTREME: Hardest Question!", a: Array(8).fill({t:"HARD", p:10}) };

let currentRound = 0;
let strikes = 0;
let roundBank = 0;
let scores = [0, 0]; // Team 1, Team 2
let activeTeam = null; // 1 or 2
let isExtreme = false;

// --- NAVIGATION ---
function showScreen(id) {
    document.querySelectorAll('.screen').forEach(s => s.classList.add('hidden'));
    document.getElementById(id).classList.remove('hidden');
    if(id === 'screen-editor') renderEditor();
}

// --- EDITOR ---
function renderEditor() {
    const container = document.getElementById('editor-container');
    container.innerHTML = "";
    gameData.forEach((rd, rIdx) => {
        container.innerHTML += createEditorBlock(rd, rIdx, "Round");
    });
    
    // Extreme Editor
    const exCont = document.getElementById('extreme-ans-container');
    exCont.innerHTML = "";
    document.getElementById('q-extreme').value = extremeRound.q;
    extremeRound.a.forEach((ans, aIdx) => {
        exCont.innerHTML += `Ans: <input type="text" value="${ans.t}" id="ex-a-${aIdx}"> Pts: <input type="number" value="${ans.p}" id="ex-p-${aIdx}"><br>`;
    });
}

function createEditorBlock(rd, rIdx, label) {
    let html = `<div class="editor-round"><h3>${label} ${rIdx+1} Question: <input type="text" value="${rd.q}" id="q-${rIdx}"></h3>`;
    rd.a.forEach((ans, aIdx) => {
        html += `A${aIdx+1}: <input type="text" value="${ans.t}" id="a-${rIdx}-${aIdx}"> Pts: <input type="number" value="${ans.p}" id="p-${rIdx}-${aIdx}" style="width:45px"> `;
        if(aIdx % 2 !== 0) html += `<br>`;
    });
    return html + `</div>`;
}

function saveData() {
    gameData.forEach((rd, rIdx) => {
        rd.q = document.getElementById(`q-${rIdx}`).value;
        rd.a = rd.a.map((_, aIdx) => ({
            t: document.getElementById(`a-${rIdx}-${aIdx}`).value.toUpperCase(),
            p: parseInt(document.getElementById(`p-${rIdx}-${aIdx}`).value) || 0
        }));
    });
    extremeRound.q = document.getElementById('q-extreme').value;
    extremeRound.a = extremeRound.a.map((_, aIdx) => ({
        t: document.getElementById(`ex-a-${aIdx}`).value.toUpperCase(),
        p: parseInt(document.getElementById(`ex-p-${aIdx}`).value) || 0
    }));
    showScreen('screen-menu');
}

// --- GAMEPLAY ---
function initGame() {
    isExtreme = false;
    scores = [0, 0];
    currentRound = 0;
    activeTeam = null;
    document.getElementById('t1-label').innerText = document.getElementById('team1-name-input').value;
    document.getElementById('t2-label').innerText = document.getElementById('team2-name-input').value;
    document.getElementById('team2-ui').classList.remove('hidden');
    loadRound();
    showScreen('screen-game');
}

function startExtremeMode() {
    isExtreme = true;
    scores = [0, 0];
    activeTeam = 1; // Solo player is always Team 1
    document.getElementById('t1-label').innerText = "EXTREME CHALLENGER";
    document.getElementById('team2-ui').classList.add('hidden');
    loadRound();
    showScreen('screen-game');
}

function loadRound() {
    strikes = 0;
    roundBank = 0;
    const rd = isExtreme ? extremeRound : gameData[currentRound];
    document.getElementById('current-question').innerText = rd.q;
    document.getElementById('bank-total').innerText = "0";
    document.getElementById('btn-next-round').classList.add('hidden');
    renderStrikes();
    for(let i=0; i<8; i++) {
        const slot = document.getElementById(`slot-${i}`);
        slot.classList.remove('revealed');
        document.getElementById(`ans-${i}`).innerText = rd.a[i].t;
        document.getElementById(`pts-${i}`).innerText = rd.a[i].p;
    }
}

function selectTeam(num) {
    activeTeam = num;
    document.getElementById('team1-ui').classList.remove('active-selection');
    document.getElementById('team2-ui').classList.remove('active-selection');
    document.getElementById(`team${num}-ui`).classList.add('active-selection');
}

function revealAnswer(idx) {
    const slot = document.getElementById(`slot-${idx}`);
    if(!slot.classList.contains('revealed')) {
        slot.classList.add('revealed');
        const pts = (isExtreme ? extremeRound : gameData[currentRound]).a[idx].p;
        roundBank += pts;
        document.getElementById('bank-total').innerText = roundBank;
        checkRoundOver();
    }
}

function triggerStrike() {
    strikes++;
    renderStrikes();
    document.getElementById('strike-x').innerText = "X".repeat(strikes);
    document.getElementById('strike-overlay').style.display = 'flex';
    setTimeout(() => {
        document.getElementById('strike-overlay').style.display = 'none';
        if(strikes >= 3) showNextStep();
    }, 1000);
}

function renderStrikes() {
    const cont = document.getElementById('strike-dots');
    cont.innerHTML = "";
    for(let i=0; i<3; i++) cont.innerHTML += `<div class="dot ${i < strikes ? 'active' : ''}"></div>`;
}

function checkRoundOver() {
    const revealed = document.querySelectorAll('.slot.revealed').length;
    if(revealed === 8) showNextStep();
}

function showNextStep() {
    document.getElementById('btn-next-round').classList.remove('hidden');
}

function advanceRound() {
    if(activeTeam) {
        scores[activeTeam-1] += roundBank;
    } else {
        alert("Please click a Team Name first to award the bank!");
        return;
    }

    document.getElementById('t1-score').innerText = scores[0];
    document.getElementById('t2-score').innerText = scores[1];

    if(isExtreme || currentRound >= 4) {
        endGame();
    } else {
        currentRound++;
        loadRound();
    }
}

function endGame() {
    showScreen('screen-end');
    let html = `<h2>${document.getElementById('t1-label').innerText}: ${scores[0]}</h2>`;
    if(!isExtreme) html += `<h2>${document.getElementById('t2-label').innerText}: ${scores[1]}</h2>`;
    document.getElementById('final-results').innerHTML = html;
}
