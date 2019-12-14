/**
 * Handle available themes.
 */
let Themes = {
    _data : null,
    _available : [],

    init : function() {
        this._data = this._getData();
        for(let entry of this._data) {
            this._available.push(new Theme(entry));
        }
    },

    /**
     * Return available Themes.
     * @returns {[Theme]}
     */
    getThemes : function() {
        return this._available;
    },

    /**
     * Return a single theme based on ID.
     */
    getTheme : function(id) {
        return this._available[id];
    },

    /**
     * Synchronously get the JSON words file.
     * @private
     */
    _getData : function() {
        let jsonRequest = new XMLHttpRequest();
        jsonRequest.open('GET', "assets/themes/themes.json", false);
        jsonRequest.send(null);

        if (jsonRequest.status === 200) {
            return JSON.parse(jsonRequest.response);
        }
        return null;
    }
};


/**
 * Handle a single theme.
 * @constructor
 */
let Theme = function(data) {
    this.id = data.id;
    this.name = data.name.toUpperCase();
    this.path = data.path;
    this.background = data.background;
    this.backface = data.backface;
    this.images = data.cards;
    this.credits = data.credits;
    this.creditsUrl = data.creditsUrl;
    this.cardsCount = ((data.cards.length * 2) % 2 === 0) ? data.cards.length : data.cards.length - 1;
};


export { Themes };
export { Theme };