/**
 * author: Shimin Rao
 * date: 1/12/2020
 * version: 1.0.0
 */

 /**** define the constants *****/
//the total count of cards
const CardTotalCounts = 52

/**
 * the max score of the card. 
 * the card score is from 2 to 14,it's just for the programming to compare
 * score 11 for Jack
 * score 12 for Queen
 * score 13 for King
 * score 14 is for Ace
 */
const MaxCardScore = 14

// the card rank array
const CardRankArray = ["2","3","4","5","6","7","8","9","10","Jack","Queen","King","Ace"]
// the card suit array
const SuitsOfCard = ["Heart","Spade","Club","Diamond"]

// the absolute parent path of card image
const ImageAbsoluteParentPath = "./img/"
//hidden card image name
const CardBackImgName = "red_back.png"
//hidden card image url
const CardBackImgUrl = ImageAbsoluteParentPath + CardBackImgName;
//the timeout array, the values are some specified number of milliseconds
const TimeOutArray=[1600, 800, 100]


/****** define class ********** */
//define Deck class
class Deck{
    constructor(){
        this.cards = []
    };

    //generate the All cards(52 cards)
    generateAllCards(){
        // alert("generateAllCards");
        let imgName = ""
        let imgWholePath = ""
        for(let i=2; i<=MaxCardScore; i++){
            let score = i
            let rank = CardRankArray[i-2]
            let tempRank = rank
            if(i>10){
                tempRank = tempRank[0]
            }
            for(let suitIndex in SuitsOfCard){
                let suit = SuitsOfCard[suitIndex]
                imgName = tempRank + suit.charAt(0) + ".png"
                imgWholePath = ImageAbsoluteParentPath + imgName
                let card = new Card(suit, rank, score, imgWholePath)
                this.cards.push(card)
            }
        }
        // console.log(WholeCards);
    }
    
    //shuffle the cards
    shuffle = () => this.cards.sort(() => Math.random() - 0.5)
    
}


//define Card class
class Card{
    constructor(suit, rank, score, imgUrl){
        this.suit = suit
        this.rank = rank
        this.score = score
        //imgUrl is the card's image url 
        this.imgUrl = imgUrl
    }
}


//define Player class
class Player{
    constructor(){
        this.name = "",
        this.cards = []
        this.cardsOnDeck = []
    }
}

//the game manage class
class GameManage{
    constructor(){
    }

    //deal the cards to players
    static DealCardsToPlayers(gameDeck, gameOpponent, gameSelf){
        let cards = gameDeck.cards
        for(let i=0; i<CardTotalCounts/2; i++){
            gameOpponent.cards.push(cards[2*i])
            gameSelf.cards.push(cards[2*i + 1])
        }

        //display the card back image and counts for two players
        this.DisplayCardImage("opponent_deck_card_img", CardBackImgUrl)
        this.DisplayCardsCount("opponent_deck_cards_count",gameOpponent.cards.length)
        this.DisplayCardImage("self_deck_card_img", CardBackImgUrl)  
        this.DisplayCardsCount("self_deck_cards_count",gameSelf.cards.length)

    }

    //draw a card from player to deck automatically
    static DrawCardToDeck(gamePlayer,showCardImgElementId,playerDeckCardsCntElementId,gameDeckPlayerCardsCntElementId){
        let card = gamePlayer.cards.shift()
        this.DisplayCardsCount(playerDeckCardsCntElementId,gamePlayer.cards.length)
        gamePlayer.cardsOnDeck.push(card)
        this.DisplayCardImage(showCardImgElementId, card.imgUrl)
        this.DisplayCardsCount(gameDeckPlayerCardsCntElementId,gamePlayer.cardsOnDeck.length)
    }

    //get the last card from card array
    static GetLastCard(gameCards){
        if(gameCards.length>0){
            return gameCards[gameCards.length - 1]
        }
        return new Card("","",0,"")
    }

    //compare the two card score
    static CompareCardsScore(gameCard1, gameCard2){
        return gameCard1.score - gameCard2.score
    }

    //when player win the round, then shift cards to player
    static ShiftCardsToPlayer(sourceCards,playerCards,sourceCardsCntElementId, playerCardsCntElementId){
        sourceCards.forEach(item=>playerCards.push(item))
        this.DisplayCardsCount(playerCardsCntElementId,playerCards.length)
        sourceCards.splice(0)
        this.DisplayCardsCount(sourceCardsCntElementId,sourceCards.length)
    }

    //display card image on page
    static DisplayCardImage(displayCardImgElementId, imgUrl){
        document.getElementById(displayCardImgElementId).setAttribute("src", imgUrl)
    }

    //remove cards image on page
    static RemoveCardImages(removeCardImgElementIdList){
        removeCardImgElementIdList.forEach(removeCardImgElementId=>document.getElementById(removeCardImgElementId).setAttribute("src",""))   
    }

    //display cards count on page
    static DisplayCardsCount(displayCardsCountElementId, cardsCount){
        let displayCardsCountElement = document.getElementById(displayCardsCountElementId)
        displayCardsCountElement.innerText = cardsCount>0 ? cardsCount : ""
    }

    //get radio element checked value
    static GetRadioCheckedValue(radioElements){
        for (let i = 0; i < radioElements.length; i++) {
            if (radioElements[i].checked == true) {
                return radioElements[i].value
            }
        }
    }
}

//define instances of class Deck,Player for the game
let deck = new Deck();
let opponent = new Player();
let self = new Player();

//default timeout value:1000milliseconds = 1 second
let timeout = 1000


/**
 * mode is refer to manual or automatic draw card for self
 * mode=0 indicate user self should click the card image to draw a card to deck
 * mode=1 indicate it's automatic to draw a card to deck
 */
let mode = 0 

/**
 * self(own) click card to draw card to deck, 
 * after self draw a card to deck, before compare card score with opponent,
 * if self can't click card to draw a card to deck.
*/
let clickTimes = 0;



/**
 * do init jobs, include generate all cards
 */
function init(){
    // alert("init");
    //generate all cards and shuffle
    deck.generateAllCards()
    deck.shuffle()

    //generate the players
    generatePlayers()

    //put all cards on the deck, just show the hidden card image on deck
    GameManage.DisplayCardImage("game_deck_card_back_img",CardBackImgUrl)
}


//generate two game players
function generatePlayers(){
    //generate two game players
    opponent.name = "Opponent"
    opponent.cards = []
    document.getElementById("opponent_name").innerText = opponent.name
    self.name = "You"
    self.cards = []
    document.getElementById("self_name").innerText = self.name
}


//start the game
function startGame(){
    //get the speed value to set timeout value
    let speedRadios = document.getElementsByName("speed")
    let speedStr = GameManage.GetRadioCheckedValue(speedRadios)
    let timeoutIndex = parseInt(speedStr)
    timeout = TimeOutArray[timeoutIndex]

    let modeRadios = document.getElementsByName("mode")
    let modeStr = GameManage.GetRadioCheckedValue(modeRadios)
    mode = parseInt(modeStr)

    //disabled the speed and mode radio options
    speedRadios.forEach(speed=>speed.disabled = true)
    
    modeRadios.forEach(mode=>mode.disabled = true)

    //disabled the "Deal" button
    document.getElementById("btn_startGame").disabled = true
    //enabled the "Quit Game"
    document.getElementById("btn_quitGame").disabled = false
    //disappear the hidden 
    let game_deck_card_back_img = document.getElementById("game_deck_card_back_img")
    game_deck_card_back_img.style.visibility = "hidden"  

    //deal the cards to two players
    GameManage.DealCardsToPlayers(deck, opponent, self)
    //player opponent draw a card to deck automatically
    autoDrawCardToDeck(opponent,"opponent_card_img","opponent_deck_cards_count","game_deck_opponent_cards_count")
}

// start to play game
function autoDrawCardToDeck(gamePlayer,showCardImgElementId,playerDeckCardsCntElementId,gameDeckPlayerCardsCntElementId){
    setTimeout(function() {
        GameManage.DrawCardToDeck(gamePlayer,showCardImgElementId,playerDeckCardsCntElementId,gameDeckPlayerCardsCntElementId)
        },timeout)
}

//manual mode, click the card to draw a card to deck
function clickDrawCardToDeck(){
    if(clickTimes == 0){
        GameManage.DrawCardToDeck(self,"self_card_img","self_deck_cards_count","game_deck_self_cards_count")
        clickTimes = 1;
        setTimeout(function() {compare()},timeout)
        
    }else{

    }
}

function compare(){
    let opponent_topcard_ondeck = GameManage.GetLastCard(opponent.cardsOnDeck)
    let self_topcard_ondeck = GameManage.GetLastCard(self.cardsOnDeck)
    if(opponent_topcard_ondeck.score>0 && self_topcard_ondeck.score>0){
        let compareValue = GameManage.CompareCardsScore(opponent_topcard_ondeck,self_topcard_ondeck)
        if(compareValue>0){
            //opponent win in the round
            if(self.cards.length==0){
                console.log("opponent win the game")
            }else{
                GameManage.ShiftCardsToPlayer(self.cardsOnDeck,opponent.cards,"game_deck_self_cards_count","opponent_deck_cards_count")
                GameManage.ShiftCardsToPlayer(opponent.cardsOnDeck,opponent.cards,"game_deck_opponent_cards_count","opponent_deck_cards_count")
                setTimeout(function() {
                    GameManage.RemoveCardImages(["opponent_card_img","self_card_img"])
                    },timeout)
                let opponent_deck_show_card = opponent.cards[opponent.cards.length-1]
                let opponent_deck_show_card_img = document.getElementById("opponent_deck_show_card_img")
                setTimeout(function() {
                opponent_deck_show_card_img.setAttribute("src",opponent_deck_show_card.imgUrl)
                },timeout)
                clickTimes = 0
                autoDrawCardToDeck(opponent,"opponent_card_img","opponent_deck_cards_count","game_deck_opponent_cards_count")
            }
        }else if(compareValue<0){
            //self win in the round
            if(opponent.cards.length == 0){
                console.log("you win the game")
            }else{
                GameManage.ShiftCardsToPlayer(opponent.cardsOnDeck,self.cards,"game_deck_opponent_cards_count","self_deck_cards_count")
                GameManage.ShiftCardsToPlayer(self.cardsOnDeck,self.cards,"game_deck_self_cards_count","self_deck_cards_count")
                setTimeout(function() {
                    GameManage.RemoveCardImages(["opponent_card_img","self_card_img"])
                    },timeout)
                let self_deck_show_card = self.cards[self.cards.length-1]
                let self_deck_show_card_img = document.getElementById("self_deck_show_card_img")
                setTimeout(function() {
                self_deck_show_card_img.setAttribute("src",self_deck_show_card.imgUrl)
                },timeout)
                clickTimes = 0
                autoDrawCardToDeck(opponent,"opponent_card_img","opponent_deck_cards_count","game_deck_opponent_cards_count")
            }
        }else{
            //it's war in the round
            alert("war");

        }
    }
}

//quit the game
function quitGame(){
    if (confirm("Do you want to quit the game?") == true) {
        window.location.reload()
    } 
}

