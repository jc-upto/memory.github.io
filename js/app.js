import { Themes } from "./theme.js";
import { Deck } from "./card.js";

let gameArea = document.getElementById("viewport");
let gameScore = document.getElementById("score-result");
let messagesDiv = document.getElementById("messages-area");
let timerDiv = document.getElementById("timer-div");
let themeSelector = document.getElementById("theme-selector");
let timerSelector = document.getElementById("timer-selector");
let restart = document.getElementById("restart");
let credits = document.getElementById("credits");

Themes.init();

// Populate available themes.
for(let theme of Themes.getThemes()) {
   let option = document.createElement("option");
   option.id = theme.id;
   option.innerHTML = theme.name;
   themeSelector.appendChild(option);
}

// Starts a new game by selecting a new game theme.
themeSelector.addEventListener("change", function(event) {
    startGame(event.target.options[event.target.selectedIndex].id);
});

// Restart the game.
restart.addEventListener("click", function(event) {
    startGame(themeSelector.options[themeSelector.selectedIndex].id);
    messagesDiv.parentNode.style.zIndex = "-1";
    messagesDiv.parentNode.style.opacity = "0";
});

// Start the game with timer - no timer.
timerSelector.addEventListener("change", function () {
    timerDiv.innerHTML = "";
    startGame(themeSelector.options[themeSelector.selectedIndex].id);
});

// Start the game with selected theme.
function startGame(option) {
    let theme = Themes.getTheme(option);
    let useTimer = timerSelector.options[timerSelector.selectedIndex].id === "1";

    if(deck) {
        // To ensure deleting all timer intervals.
        deck.stop();
    }
    deck = new Deck(gameArea, gameScore, theme, messagesDiv);

    deck.init();
    if(useTimer) {
        deck.setTimer(new Date().getTime(), timerDiv);
    }

    // Setting up credits.
    credits.innerHTML = theme.credits;
    credits.href = theme.creditsUrl;
}
let deck;
startGame(0);