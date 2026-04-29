let gameData = [
    { q: "Name a noisy pet.", a: [{t:"DOG", p:50}, {t:"BIRD", p:20}, {t:"CAT", p:10}, {t:"HAMSTER", p:5}, {t:"PARROT", p:5}, {t:"FISH", p:1}, {t:"SNAKE", p:1}, {t:"RAT", p:1}] },
    { q: "Name a yellow fruit.", a: [{t:"BANANA", p:60}, {t:"LEMON", p:20}, {t:"PINEAPPLE", p:10}, {t:"MANGO", p:5}, {t:"STARFRUIT", p:2}, {t:"PEAR", p:1}, {t:"APPLE", p:1}, {t:"MELON", p:1}] },
    // Defaults for rounds 3, 4, 5... (truncated for brevity, same structure)
];
// Fill empty slots if less than 5 rounds provided
while(gameData.length < 5) gameData.push(gameData[0]);

let currentRound = 0;
let strikes = 0;
let roundBank = 0;
let team1Score = 0;
let team2Score = 0;
let revealedCount = 0;
let isExtreme = false;
let teamNames = ["Team 1", "Team 2"];

function showScreen(id) {
    document.querySelectorAll('.screen').forEach(s => s.classList.add('hidden'));
    document.getElementById(id).classList.remove('hidden');
    if(id === 'screen-editor') renderEditor();
}

// EDITOR LOGIC
function renderEditor() {
    const container = document.getElementById('editor-container');
    container.innerHTML = "";
    gameData.forEach((rd, rIdx) => {
        let html = `<div class="editor-round"><h3>Round ${rIdx+1} Question: <input type="text" value="${rd.q}" id="q-${rIdx}"></h3>`;
        rd.a.forEach((ans, aIdx) => {
            html += `Ans ${aIdx+1}: <input type="text" value="${ans.t}" id="a-${rIdx}-${aIdx}"> 
                     Pts: <input type="number" value="${ans.p}" id="p-${rIdx}-${aIdx}" style="width:50px"> <br>`;
        });
        html += `</div>`;
        container.innerHTML += html;
    });
}

function saveData() {
    gameData.forEach((rd, rIdx) => {
        rd.q = document.getElementById(`q-${rIdx}`).value;
        rd.a.forEach((ans, aIdx) => {
            ans.t = document.getElementById(`a-${rIdx}-${aIdx}`).value.toUpperCase();
            ans.p = parseInt(document.getElementById(`p-${rIdx}-${aIdx}`).value);
        });
    });
    showScreen('screen-menu');
}

// GAME LOGIC
function initGame() {
    isExtreme = false;
    teamNames = [document.getElementById('team1-name-input').value, document.getElementById('team2-name-input').value];
    document.getElementById('t1-label').innerText = teamNames[0];
    document.getElementById('t2-label').innerText = teamNames[1];
    document.getElementById('team2-ui').classList.remove('hidden');
    currentRound = 0;
    team1Score = 0;
    team2Score = 0;
    loadRound();
    showScreen('screen-game');
}

function startExtremeMode() {
    isExtreme = true;
    currentRound = 0;
    team1Score = 0;
    document.getElementById('t1-label').innerText = "SOLO PLAYER";
    document.getElementById('team2-ui').classList.add('hidden');
    // Set a hard custom round or just use first round
    gameData[0].q = "EXTREME: Name something people are afraid of!";
    loadRound();
    showScreen('screen-game');
}

function loadRound() {
    strikes = 0;
    roundBank = 0;
    revealedCount = 0;
    const rd = gameData[currentRound];
    document.getElementById('current-question').innerText = rd.q;
    document.getElementById('bank-total').innerText = "0";
    document.getElementById('btn-next-round').classList.add('hidden');
    renderStrikes();
    for(let i=0; i<8; i++) {
        const s = document.getElementById(`slot-${i}`);
        s.classList.remove('revealed');
        document.getElementById(`ans-${i}`).innerText = rd.a[i].t;
        document.getElementById(`pts-${i}`).innerText = rd.a[i].p;
    }
}

function checkAnswer() {
    const val = document.getElementById('user-input').value.trim().toUpperCase();
    document.getElementById('user-input').value = "";
    const rd = gameData[currentRound];
    let idx = rd.a.findIndex(ans => ans.t === val);

    if(idx !== -1 && !document.getElementById(`slot-${idx}`).classList.contains('revealed')) {
        document.getElementById(`slot-${idx}`).classList.add('revealed');
        roundBank += rd.a[idx].p;
        revealedCount++;
        document.getElementById('bank-total').innerText = roundBank;
        if(revealedCount === 8) showNextButton();
    } else {
        doStrike();
    }
}

function doStrike() {
    strikes++;
    renderStrikes();
    document.getElementById('strike-x').innerText = "X".repeat(strikes);
    document.getElementById('strike-overlay').style.display = 'flex';
    setTimeout(() => {
        document.getElementById('strike-overlay').style.display = 'none';
        if(strikes >= 3) showNextButton();
    }, 1000);
}

function renderStrikes() {
    const cont = document.getElementById('strike-dots');
    cont.innerHTML = "";
    for(let i=0; i<3; i++) cont.innerHTML += `<div class="dot ${i < strikes ? 'active' : ''}"></div>`;
}

function showNextButton() {
    // Auto-reveal all
    for(let i=0; i<8; i++) document.getElementById(`slot-${i}`).classList.add('revealed');
    document.getElementById('btn-next-round').classList.remove('hidden');
}

function advanceRound() {
    // Score accumulation logic
    if(!isExtreme) {
        // Simple logic: give points to team whose turn it is (or current leading team)
        // For simplicity, we add bank to both if they didn't strike out, 
        // but here we'll just add to T1 if it's even round, T2 if odd.
        if(currentRound % 2 === 0) team1Score += roundBank;
        else team2Score += roundBank;
    } else {
        team1Score += roundBank;
    }

    document.getElementById('t1-score').innerText = team1Score;
    document.getElementById('t2-score').innerText = team2Score;

    if(isExtreme || currentRound >= 4) {
        showEndScreen();
    } else {
        currentRound++;
        loadRound();
    }
}

function showEndScreen() {
    showScreen('screen-end');
    let res = `<h3>${teamNames[0]}: ${team1Score}</h3>`;
    if(!isExtreme) res += `<h3>${teamNames[1]}: ${team2Score}</h3>`;
    document.getElementById('final-results').innerHTML = res;
}

// Enter key support
document.getElementById('user-input').addEventListener('keyup', e => { if(e.key==='Enter') checkAnswer(); });
