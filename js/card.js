/**
 * Handle the cards deck.
 * @param gameArea
 * @param gameScore The score area.
 * @param theme
 * @param messagesDiv
 * @constructor
 */
let Deck = function(gameArea, gameScore, theme, messagesDiv) {

    this.cards = [];
    this.cardsArea = gameArea;
    this.scoreArea = gameScore;
    this.messagesDiv = messagesDiv;
    this.theme = theme;
    let timeLeftAtStartup = new Date().getTime() + (2 * 60 * 1000);
    let checking = false;
    let cardsClicked = [];
    let score = 0;
    let gameOver = false;
    let _intervals = [];

    /**
     * Init the deck by adding needed cards.
     */
    this.init = function() {

        for(let i = 0; i < this.theme.cardsCount ; i++) {
            this.cards.push(new Card(i, this.theme), new Card(i, this.theme));
        }

        this.cards = this._shuffle(this.cards);

        // Setting up the theme.
        document.body.style.background = "Url(" + theme.path + theme.background + ") no-repeat";
        document.body.style.backgroundSize = "cover";

        this.scoreArea.innerHTML = " " + score + " / " + this.cards.length / 2;

        this._draw();
    };


    /**
     * Sets the timer.
     * @param element
     */
    this.setTimer = function(dateTime, element) {
        let diff = timeLeftAtStartup - dateTime;
        if(diff > 0 && !gameOver) {
            let mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            let secs = Math.floor((diff % (1000 * 60)) / 1000);
            element.innerHTML = "Il vous reste: " + ("0" + mins).slice(-2) + ":" + ("0" + secs).slice(-2);
            _intervals.push(setTimeout(() => this.setTimer(new Date().getTime(), element), 1000));
        }
        else {
            gameOver = true;
            this.messagesDiv.parentNode.style.zIndex = "1";
            this.messagesDiv.parentNode.style.opacity = "1";
            this.messagesDiv.parentNode.style.transition = "opacity 1s";
            this.messagesDiv.innerHTML = "Désolé, mais vous avez perdu contre le temps, avec un score de " + score + " sur " + (this.cards.length / 2);
        }

    };


    /**
     * Clear the time timeout.
     */
    this.stop = function() {
        gameOver = true;
        for(let intervalID of _intervals) {
            clearTimeout(intervalID);
        }
    };

    /**
     * Draw the game area.
     */
    this._draw = function() {
        this.cardsArea.innerHTML = "";

        for(let i = 0; i < this.cards.length; i++) {
            let element = this.cards[i].getImageElement();

            element.onclick = () => {
                if(this.cards[i].found || cardsClicked.length > 2 || gameOver) {
                    return;
                }

                if(cardsClicked.length < 2) {

                    if(!this.cards[i].flipped) {
                        this.cards[i].flipped = true;
                        this.cards[i].show();
                        cardsClicked.push(this.cards[i]);
                    }
                }

                if(2 === cardsClicked.length && !checking) {
                    checking = true;
                    this._checkCardsAndReset();
                }

            };

            this.cardsArea.appendChild(element);
        }
    };


    /**
     * Hide cards and reset the click count in order to allow new clicks on cards.
     * @private
     */
    this._checkCardsAndReset = function() {
        if(cardsClicked[0].equals(cardsClicked[1])) {
            cardsClicked[0].found = cardsClicked[0].flipped = true;
            cardsClicked[1].found = cardsClicked[1].flipped = true;
            score++;
            this.scoreArea.innerHTML = " " + score + " / " + this.cards.length / 2;
            if(score === this.cards.length / 2) {
                this.messagesDiv.parentNode.style.zIndex = "1";
                this.messagesDiv.parentNode.style.opacity = "1";
                this.messagesDiv.parentNode.style.transition = "opacity 1s";
                this.messagesDiv.innerHTML = "BRAVO ! Vous avez gagné dans le temps imparti, avec un score de " + score + " sur " + (this.cards.length / 2);
            }
        }
        else {
            cardsClicked[0].hideWithTimeout(1500);
            cardsClicked[1].hideWithTimeout(1500);
        }
        setTimeout(() => {
            cardsClicked[0].flipped = cardsClicked[1].flipped = false;
            cardsClicked = [];
            checking = false;
        }, 1500);
    };


    /**
     * Randomly shuffle the deck.
     */
    this._shuffle = function(cardsArray) {
        let cards = [];
        while(cardsArray.length) {
            let index = Math.floor(Math.random() * this.cards.length);
            cards.push(cardsArray[index]);
            cardsArray.splice(index, 1);
        }
        return cards;
    };
};



/**
 * Handle card.
 * @constructor
 */
let Card = function(id, theme) {

    this.id = id;
    this.imgElement = document.createElement("img");
    this.theme = theme;
    this.found = false;
    this.flipped = false;

    /**
     * Return true if the given card is the same than 'this'.
     */
    this.equals = function(card) {
        return this.id === card.id;
    };

    /**
     * Show the card.
     */
    this.show = function() {
        this.imgElement.style.animation = "flip-card-animation-show 1.2s";
        this.imgElement.src = this.theme.path + this.theme.images[this.id];
    };

    /**
     * Hide the card.
     */
    this.hide = function() {
        this.imgElement.style.animation = "flip-card-animation-hide 1.2s";
        this.imgElement.src = this.theme.path + this.theme.backface;
    };

    /**
     * Hide the card in a timeout.
     */
    this.hideWithTimeout = function(timeout) {
        setTimeout(() => this.hide(), timeout);
    };

    /**
     * Create and return the object image element based on its ID.
     * @returns {HTMLImageElement}
     */
    this.getImageElement = function() {
        this.hide();
        this.imgElement.setAttribute("draggable", false);
        return this.imgElement;
    };

};

export { Card };
export { Deck };