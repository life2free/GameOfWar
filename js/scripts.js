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
const ImageAbsolutePath = "./img/"

//hidden card image name
const CardBackImgName = "red_back.png"

//hidden card image url
const CardBackImgUrl = ImageAbsolutePath + CardBackImgName;

//the timeout array, the values are some specified number of milliseconds
const TimeOutArray=[5600, 800, 100]

//when it's war, player should draw 4 cards to deck
const DrawCardsCountWhenWar = 4

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
                imgWholePath = ImageAbsolutePath + imgName
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

    /**
     * draw a card from player to deck automatically
     * @param {*} gamePlayer 
     * @param {*} showCardImgElementId 
     * @param {*} playerDeckCardsCntElementId 
     * @param {*} gameDeckPlayerCardsCntElementId 
     * @param {*} imgIsUp 
     */
    static DrawCardToDeck(gamePlayer,showCardImgElementId,playerDeckCardsCntElementId,gameDeckPlayerCardsCntElementId,imgIsUp=1){
        let card = gamePlayer.cards.shift()
        this.DisplayCardsCount(playerDeckCardsCntElementId,gamePlayer.cards.length)
        gamePlayer.cardsOnDeck.push(card)
        this.DisplayCardImage(showCardImgElementId, imgIsUp ? card.imgUrl : CardBackImgUrl)
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

    //console.log the game round info
    static LogGameRoundInfo(opponetPlayerCard, selfPlayerCard,compareValue){
        let logInfo = ("[").concat((new Date()).toLocaleString()).concat("] opponent:")
            .concat(opponetPlayerCard.suit).concat(" ").concat(opponetPlayerCard.rank).concat(", ")
            .concat("self:").concat(selfPlayerCard.suit).concat(" ").concat(selfPlayerCard.rank).concat(". ")
        if(compareValue>0){
            logInfo = logInfo.concat("Opponent win!")
        }else if(compareValue<0){
            logInfo = logInfo.concat("You win!")
        }else{
            logInfo = logInfo.concat("It's War!")
        }
        console.log(logInfo)
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
 * player self(own) click card to draw card to deck
 * if it's normal round, canClickToDrawCardTimes=1,the self player only can click 1 time to draw 1 card to deck,
 * if it's war round, canClickToDrawCardTimes=4,the self player should click 4 times to draw 4 cards to deck.
*/
let canClickToDrawCardTimes = 1;

//tag the round is war or not 
let isWar = false;

//tag game is over or not
let isGameOver = false




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

//draw a card to deck automatically
function autoDrawCardToDeck(gamePlayer,showCardImgElementId,playerDeckCardsCntElementId,gameDeckPlayerCardsCntElementId,imgIsUp=1){
    setTimeout(function() {
        GameManage.DrawCardToDeck(gamePlayer,showCardImgElementId,playerDeckCardsCntElementId,gameDeckPlayerCardsCntElementId,imgIsUp)
        },timeout)
}

//manual mode, click the card to draw a card to deck
function clickDrawCardToDeck(){
    if(!isGameOver){
        if(canClickToDrawCardTimes > 0){
            canClickToDrawCardTimes -= 1
            let imgIsUp = canClickToDrawCardTimes>0 ? 0 : 1;
            GameManage.DrawCardToDeck(self,"self_card_img","self_deck_cards_count","game_deck_self_cards_count",imgIsUp)
            
            if(canClickToDrawCardTimes==0){
                setTimeout(function() {compare()},timeout)
            }
        }else{
            console.log("please wait")
            // alert("wait")
        }
    }
}

function compare(){
    let opponent_topcard_ondeck = GameManage.GetLastCard(opponent.cardsOnDeck)
    let self_topcard_ondeck = GameManage.GetLastCard(self.cardsOnDeck)
    if(opponent_topcard_ondeck.score>0 && self_topcard_ondeck.score>0){
        let compareValue = GameManage.CompareCardsScore(opponent_topcard_ondeck,self_topcard_ondeck)
        GameManage.LogGameRoundInfo(opponent_topcard_ondeck,self_topcard_ondeck,compareValue)
        if(compareValue>0){
            GameManage.ShiftCardsToPlayer(self.cardsOnDeck,opponent.cards,"game_deck_self_cards_count","opponent_deck_cards_count")
            GameManage.ShiftCardsToPlayer(opponent.cardsOnDeck,opponent.cards,"game_deck_opponent_cards_count","opponent_deck_cards_count")
            setTimeout(function() {
            GameManage.RemoveCardImages(["opponent_card_img","self_card_img"])
                    },timeout)
            //opponent win in the round
            if(self.cards.length==0){
                console.log("opponent win the game")
                isGameOver = true
            }else{
                isWar = false
                let opponent_deck_show_card = opponent.cards[opponent.cards.length-1]
                let opponent_deck_show_card_img = document.getElementById("opponent_deck_show_card_img")
                setTimeout(function() {
                    opponent_deck_show_card_img.setAttribute("src",opponent_deck_show_card.imgUrl)
                },timeout)
                canClickToDrawCardTimes = 1
                autoDrawCardToDeck(opponent,"opponent_card_img","opponent_deck_cards_count","game_deck_opponent_cards_count")
            }
        }else if(compareValue<0){
            GameManage.ShiftCardsToPlayer(opponent.cardsOnDeck,self.cards,"game_deck_opponent_cards_count","self_deck_cards_count")
            GameManage.ShiftCardsToPlayer(self.cardsOnDeck,self.cards,"game_deck_self_cards_count","self_deck_cards_count")
            setTimeout(function() {
                    GameManage.RemoveCardImages(["opponent_card_img","self_card_img"])
                    },timeout)
            //self win in the round
            if(opponent.cards.length == 0){
                console.log("you win the game")
                isGameOver = true
            }else{
                isWar = false
                let self_deck_show_card = self.cards[self.cards.length-1]
                let self_deck_show_card_img = document.getElementById("self_deck_show_card_img")
                setTimeout(function() {
                    self_deck_show_card_img.setAttribute("src",self_deck_show_card.imgUrl)
                },timeout)
                canClickToDrawCardTimes = 1
                autoDrawCardToDeck(opponent,"opponent_card_img","opponent_deck_cards_count","game_deck_opponent_cards_count")
            }
        }else{
            //it's war in the round
            alert("war");
            isWar = true;
            if(opponent.cards.length<DrawCardsCountWhenWar || self.cards.length<DrawCardsCountWhenWar){
                isGameOver = true
                if(opponent.cards.length<DrawCardsCountWhenWar){
                    console.log("you win the game")
                }else{
                    console.log("opponent win the game")
                }
            }else{
                canClickToDrawCardTimes = DrawCardsCountWhenWar
                //draw 4 opponent cards to deck, on deck, 1-3 cards face down, the fourth card face up
                for(let i=1; i<DrawCardsCountWhenWar; i++){
                    autoDrawCardToDeck(opponent,"opponent_card_img","opponent_deck_cards_count","game_deck_opponent_cards_count",0)
                }
                autoDrawCardToDeck(opponent,"opponent_card_img","opponent_deck_cards_count","game_deck_opponent_cards_count")
            }
        }
    }
}

//quit the game
function quitGame(){
    if (confirm("Do you want to quit the game?") == true) {
        window.location.reload()
    } 
}

