// Initial Game Data
let gameData = Array(5).fill(null).map((_, i) => ({
    q: `Round ${i+1} Question?`,
    a: Array(8).fill(null).map((_, j) => ({ t: `ANSWER ${j+1}`, p: 10 }))
}));

let extremeRound = {
    q: "EXTREME SOLO QUESTION?",
    a: Array(8).fill(null).map((_, j) => ({ t: `HARD ANS ${j+1}`, p: 20 }))
};

let currentRound = 0;
let strikes = 0;
let roundBank = 0;
let totalScores = [0, 0];
let activeTeam = null; // 1 or 2
let isExtreme = false;

// UI Control
function showScreen(id) {
    document.querySelectorAll('.screen').forEach(s => s.classList.add('hidden'));
    document.getElementById(id).classList.remove('hidden');
    if(id === 'screen-editor') renderEditor();
}

// Editor Logic
function renderEditor() {
    const container = document.getElementById('editor-container');
    container.innerHTML = "<h2>Standard Rounds</h2>";
    
    gameData.forEach((rd, rIdx) => {
        let html = `<div class="editor-round">
            Round ${rIdx+1}: <input type="text" id="q-${rIdx}" value="${rd.q}" style="width:70%"><br><br>`;
        rd.a.forEach((ans, aIdx) => {
            html += `Ans: <input type="text" id="a-${rIdx}-${aIdx}" value="${ans.t}"> 
                     Pts: <input type="number" id="p-${rIdx}-${aIdx}" value="${ans.p}" style="width:50px"> `;
            if(aIdx % 2 !== 0) html += `<br>`;
        });
        container.innerHTML += html + `</div>`;
    });

    container.innerHTML += "<h2>Extreme Round (Solo)</h2>";
    let exHtml = `<div class="editor-round" style="background:#300">
        Question: <input type="text" id="ex-q" value="${extremeRound.q}" style="width:70%"><br><br>`;
    extremeRound.a.forEach((ans, aIdx) => {
        exHtml += `Ans: <input type="text" id="ex-a-${aIdx}" value="${ans.t}"> 
                   Pts: <input type="number" id="ex-p-${aIdx}" value="${ans.p}" style="width:50px"> `;
        if(aIdx % 2 !== 0) exHtml += `<br>`;
    });
    container.innerHTML += exHtml + `</div>`;
}

function saveData() {
    gameData.forEach((rd, rIdx) => {
        rd.q = document.getElementById(`q-${rIdx}`).value;
        rd.a.forEach((ans, aIdx) => {
            ans.t = document.getElementById(`a-${rIdx}-${aIdx}`).value.toUpperCase();
            ans.p = parseInt(document.getElementById(`p-${rIdx}-${aIdx}`).value) || 0;
        });
    });
    extremeRound.q = document.getElementById(`ex-q`).value;
    extremeRound.a.forEach((ans, aIdx) => {
        ans.t = document.getElementById(`ex-a-${aIdx}`).value.toUpperCase();
        ans.p = parseInt(document.getElementById(`ex-p-${aIdx}`).value) || 0;
    });
    showScreen('screen-menu');
}

// Game Play Logic
function initGame() {
    isExtreme = false;
    currentRound = 0;
    totalScores = [0, 0];
    activeTeam = null;
    document.getElementById('t1-label').innerText = document.getElementById('team1-name-input').value;
    document.getElementById('t2-label').innerText = document.getElementById('team2-name-input').value;
    document.getElementById('team2-ui').classList.remove('hidden');
    loadRound();
    showScreen('screen-game');
}

function startExtremeMode() {
    isExtreme = true;
    totalScores = [0, 0];
    activeTeam = 1; // Solo
    document.getElementById('t1-label').innerText = "SOLO PLAYER";
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
    
    const board = document.getElementById('board');
    board.innerHTML = "";
    rd.a.forEach((ans, i) => {
        board.innerHTML += `
            <div class="slot" id="slot-${i}" onclick="revealAnswer(${i})">
                <div class="num">${i+1}</div>
                <div class="text">${ans.t}</div>
                <div class="pts">${ans.p}</div>
            </div>`;
    });
    // Reset selection
    document.getElementById('team1-ui').classList.remove('active-selection');
    document.getElementById('team2-ui').classList.remove('active-selection');
}

function selectTeam(n) {
    activeTeam = n;
    document.getElementById('team1-ui').classList.remove('active-selection');
    document.getElementById('team2-ui').classList.remove('active-selection');
    document.getElementById(`team${n}-ui`).classList.add('active-selection');
}

function revealAnswer(i) {
    const slot = document.getElementById(`slot-${i}`);
    if(!slot.classList.contains('revealed')) {
        slot.classList.add('revealed');
        const rd = isExtreme ? extremeRound : gameData[currentRound];
        roundBank += rd.a[i].p;
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
        if(strikes >= 3) showNextButton();
    }, 1200);
}

function renderStrikes() {
    const cont = document.getElementById('strike-dots');
    cont.innerHTML = "";
    for(let i=0; i<3; i++) {
        cont.innerHTML += `<div class="dot ${i < strikes ? 'active' : ''}"></div>`;
    }
}

function checkRoundOver() {
    if(document.querySelectorAll('.slot.revealed').length === 8) showNextButton();
}

function showNextButton() {
    document.getElementById('btn-next-round').classList.remove('hidden');
}

function advanceRound() {
    if(!activeTeam) {
        alert("GM: Click a team card first to award points!");
        return;
    }
    totalScores[activeTeam-1] += roundBank;
    document.getElementById(`t${activeTeam}-score`).innerText = totalScores[activeTeam-1];

    if(isExtreme || currentRound >= 4) {
        showEndScreen();
    } else {
        currentRound++;
        loadRound();
    }
}

function showEndScreen() {
    showScreen('screen-end');
    const res = document.getElementById('final-results');
    let html = `<h2>${document.getElementById('t1-label').innerText}: ${totalScores[0]}</h2>`;
    if(!isExtreme) html += `<h2>${document.getElementById('t2-label').innerText}: ${totalScores[1]}</h2>`;
    res.innerHTML = html;
}
