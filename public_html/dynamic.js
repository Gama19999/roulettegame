/*
 *  Created on : 20 oct. 2022, 23:11:37
 *  Author     : gamars
 */

let bets = [[],[],[]];
let match = 1;
let colors = ["green","red","black","red","black","red","black","red","black",
                  "red","black","red","black","red","black","red","black","red"];
let colorGot;
let winsPy1 = 0, winsPy2 = 0, winsPy3 = 0; 

function getBets() {
    document.getElementById('fortune').innerHTML = "";
    document.getElementById('matchWin').innerHTML = "";
    if (!canStart()) return;
    
    setMatch();
    
    for (let p = 1; p <= 3; ++p) {
        let coins = document.getElementById(`betPy${p}`).value;
        let color;
        
        for (let i of document.getElementsByName(`colorPy${p}`)) {
            if (i.checked) {
                color = i.value;
                break;
            }
        }
        
        bets[match-2].push(`py${p},${coins},${color}`);
    }
    
    console.log(bets);
    // moveStar();
    spin();
    
}

function canStart() {
    if (match > 3) {
        let absoluteWinner = Math.max(winsPy1, winsPy2, winsPy3);
        if (absoluteWinner === 0) document.getElementById('absWin').innerHTML = "Absolute<br>Winner<br>Nobody";
        switch (absoluteWinner) {
            case winsPy1:
                document.getElementById('absWin').innerHTML = "Absolute<br>Winner<br>Player 1";
                break;
            case winsPy2:
                document.getElementById('absWin').innerHTML = "Absolute<br>Winner<br>Player 2";
                break;
            case winsPy3:
                document.getElementById('absWin').innerHTML = "Absolute<br>Winner<br>Player 3";
                break;
        }
        return false;
    }
    
    if (document.getElementById('betPy1').value === "" ||
        document.getElementById('betPy2').value === "" ||
        document.getElementById('betPy3').value === "")
        { 
            document.getElementById('info').innerHTML = "Fill in all the bets!";
            return false;
        } else {
            let pass1, pass2, pass3;
            
            for (let i of document.getElementsByName('colorPy1')) {
                if (i.checked) {
                    pass1 = true;
                    break;
                } else pass1 = false;
            }
            for (let i of document.getElementsByName('colorPy2')) {
                if (i.checked) {
                    pass2 = true;
                    break;
                } else pass2 = false;
            }
            for (let i of document.getElementsByName('colorPy3')) {
                if (i.checked) {
                    pass3 = true;
                    break;
                } else pass3 = false;
            }
            
            if (pass1 && pass2 && pass3) {
                document.getElementById('info').innerHTML = "";
                return true;
            } else {
                document.getElementById('info').innerHTML = "Must select a color bet!";
                return false;
            }
        }
}

function setMatch() {
    document.getElementById('match').innerHTML = `Match<br>${match}`;
    match++;
}

function moveStar() {
    let pos = {
        1 : "4,flex-start,black",
        2 : "4,flex-end,red",
        3 : "6,flex-start,cyan",
        4 : "6,flex-end,green"
    };
    
    const star = document.getElementById('star');
    let selec = Math.trunc(Math.random() * 5);
    let attrib = pos[selec].split(",");
    
    star.style.gridRow = attrib[0];
    star.style.justifySelf = attrib[1];
}

function spin() {   
    let time = Math.trunc(Math.random() * 10) + 1;
    let interv = setInterval(changeColors, 1000, colors);
    setTimeout(() => {
        clearInterval(interv);
        getFortune();
        document.getElementById('matchWin').innerHTML = getPlayerWhoWonRound(bets, match).split(",")[0];
    }, (time*1000));
    // setTimeout(getFortune, 1000);
}

function changeColors(colors) {
    let roulette = document.getElementById('roulette');
    let s = `conic-gradient(${colors[0]} 0deg 20deg, ${colors[1]} 20deg 40deg, ${colors[2]} 40deg 60deg, ${colors[3]} 60deg 80deg,
        ${colors[4]} 80deg 100deg, ${colors[5]} 100deg 120deg, ${colors[6]} 120deg 140deg, ${colors[7]} 140deg 160deg, ${colors[8]} 160deg 180deg,
        ${colors[9]} 180deg 200deg, ${colors[10]} 200deg 220deg, ${colors[11]} 220deg 240deg, ${colors[12]} 240deg 260deg, ${colors[13]} 260deg 280deg,
        ${colors[14]} 280deg 300deg, ${colors[15]} 300deg 320deg, ${colors[16]} 320deg 340deg, ${colors[17]} 340deg 360deg)`;
    
    roulette.style.background = s;
    // console.log(s, "\n\nchanging colors?");
    colors.unshift(colors.pop());
}

function getFortune() {
    document.getElementById('fortune').innerHTML = colors[1].toUpperCase();    
    colorGot = colors[1];
}

function getPlayerWhoWonRound(betsToCheck, round) {
    let winnerInRound = "Nobody";
    let possibleWinners = [];
    
    for (let i of betsToCheck[round-2]) {
        if (i.split(",")[2] === colorGot) possibleWinners.push(i);
    }
    
    if (possibleWinners.length === 1) {
        winnerInRound = possibleWinners[0].split(",")[0];
    } else if (possibleWinners.length === 2) {
        if (Number.parseInt(possibleWinners[0].split(",")[1]) > Number.parseInt(possibleWinners[1].split(",")[1])) {
            winnerInRound = possibleWinners[0];
        } else {
            winnerInRound = possibleWinners[1];
        }
    } else if (possibleWinners.length === 3) {
        let bet = [Number.parseInt(possibleWinners[0].split(",")[1]),
        Number.parseInt(possibleWinners[1].split(",")[1]),
        Number.parseInt(possibleWinners[2].split(",")[1])];
    
        winnerInRound = possibleWinners[bet.indexOf(Math.max(...bet))];
    }
    
    if (winnerInRound.split(",")[0] === "py1") winsPy1++;
    else if (winnerInRound.split(",")[0] === "py2") winsPy2++;
    else if (winnerInRound.split(",")[0] === "py3") winsPy3++;
    
    return winnerInRound;
}