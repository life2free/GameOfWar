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
}

//define instances of class Deck,Player for the game
let deck = new Deck();
let opponent = new Player();
let self = new Player();

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

    //put all cards on the deck, just need show the hidden card image on deck
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

    //disabled the "Deal" button
    document.getElementById("btn_startGame").disabled = true
    //enabled the "Quit Game"
    document.getElementById("btn_quitGame").disabled = false
    //disappear the hidden 
    let game_deck_card_back_img = document.getElementById("game_deck_card_back_img")
    game_deck_card_back_img.style.visibility = "hidden"

    //disabled the speed and mode radio options
    let speedRadios = document.getElementsByName("speed")
    speedRadios.forEach(speed=>speed.disabled = true)
    let modeRadios = document.getElementsByName("mode")
    modeRadios.forEach(mode=>mode.disabled = true)

    //deal the cards to two players
    GameManage.DealCardsToPlayers(deck, opponent, self)
    playGame()
}

// start to play game
function playGame(){
    setTimeout(function() {
        GameManage.DrawCardToDeck(opponent,"opponent_card_img","opponent_deck_cards_count","game_deck_opponent_cards_count")
        },1000)
}

function clickDrawCardToDeck(){
    if(clickTimes == 0){
        GameManage.DrawCardToDeck(self,"self_card_img","self_deck_cards_count","game_deck_self_cards_count")
        clickTimes = 1;

        let palyer1_topcard_ondeck = GameManage.GetLastCard(opponent.cardsOnDeck)
        let palyer2_topcard_ondeck = GameManage.GetLastCard(self.cardsOnDeck)
        if(palyer1_topcard_ondeck.score>0 && palyer2_topcard_ondeck.score>0){
            let compareValue = GameManage.CompareCardsScore(palyer1_topcard_ondeck,palyer2_topcard_ondeck)
            if(compareValue>0){
                GameManage.ShiftCardsToPlayer(self.cardsOnDeck,opponent.cards,"game_deck_self_cards_count","opponent_deck_cards_count")
                GameManage.ShiftCardsToPlayer(opponent.cardsOnDeck,opponent.cards,"game_deck_opponent_cards_count","opponent_deck_cards_count")
                setTimeout(function() {
                    GameManage.RemoveCardImages(["opponent_card_img","self_card_img"])
                    },1000)
                let opponent_deck_show_card = opponent.cards[opponent.cards.length-1]
                let opponent_deck_show_card_img = document.getElementById("opponent_deck_show_card_img")
                setTimeout(function() {
                opponent_deck_show_card_img.setAttribute("src",opponent_deck_show_card.imgUrl)
                },1000)
                clickTimes = 0
                playGame()
            }else if(compareValue<0){
                GameManage.ShiftCardsToPlayer(opponent.cardsOnDeck,self.cards,"game_deck_opponent_cards_count","self_deck_cards_count")
                GameManage.ShiftCardsToPlayer(self.cardsOnDeck,self.cards,"game_deck_self_cards_count","self_deck_cards_count")
                setTimeout(function() {
                    GameManage.RemoveCardImages(["opponent_card_img","self_card_img"])
                    },1000)
                let self_deck_show_card = self.cards[self.cards.length-1]
                let self_deck_show_card_img = document.getElementById("self_deck_show_card_img")
                setTimeout(function() {
                self_deck_show_card_img.setAttribute("src",self_deck_show_card.imgUrl)
                },1000)
                clickTimes = 0
                playGame()
            }else{
                
            }
        }
    }else{

    }
}

//quit the game
function quitGame(){
    if (confirm("Do you want to quit the game?") == true) {
        window.location.reload()
    } 
}

