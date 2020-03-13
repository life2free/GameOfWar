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
const HiddenCardImgName = "red_back.png"


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

class GameManage{
    constructor(){
    }

    //deal the cards to players
    static DealCardsToPlayers(deck, player1, player2){
        let cards = deck.cards
        for(let i=0; i<CardTotalCounts/2; i++){
            player1.cards.push(cards[2*i])
            player2.cards.push(cards[2*i + 1])
        }
        let player1_deck_card_img = document.getElementById("player1_deck_card_img")
        player1_deck_card_img.setAttribute("src",hidden_card_imgUrl)
        let player2_deck_card_img = document.getElementById("player2_deck_card_img")
        player2_deck_card_img.setAttribute("src",hidden_card_imgUrl)
        
    }

    //compare the two card value
    static CompareCardsValue(value1, value2){
        return value1 - value2
    }

    //shift cards from cardsArray1 to cardsArray2
    static ShiftCards(cardsArray1, cardsArray2){

    }
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
        this.originCards = []
        
    }
}

//define instances of class Deck,Player for the game
let deck = new Deck();
let player1 = new Player();
let player2 = new Player();


let hidden_card_img = document.getElementById("hidden_card_img");
let hidden_card_imgUrl = ImageAbsoluteParentPath + HiddenCardImgName;
let palyer1_card_img = document.getElementById("player1_card_img");
let palyer2_card_img = document.getElementById("player2_card_img");


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

    //put all cards on the deck
    putAllCardsOnDeck()
}



//generate the players
function generatePlayers(){
    // alert("generatePlayers");
    //generate the players
    player1.name = "Opponent"
    player1.cards = []
    player2.name = "You"
    player2.cards = []
    
}

//put all cards on the deck, show the hidden card image on deck
function putAllCardsOnDeck(){ 
    // alert("putAllCardsOnDeck");
    hidden_card_img = document.getElementById("hidden_card_img")
    // alert(hidden_card_imgUrl);
    // alert(hidden_card_img);
    hidden_card_img.setAttribute("src",hidden_card_imgUrl)
    // alert(hidden_card_imgUrl);
}

//start the game
function startGame(){
    // alert("welcome!");
    //hidden the startGame button
    document.getElementById("btn_startGame").style.visibility = "hidden"
    //visible the quitGame button
    document.getElementById("btn_quitGame").style.visibility = "visible"
    //endisplay the hidden card
    hidden_card_img.style.displayed = "none"
    //start play the game
    startPlay()
}

// start to play game
function startPlay(){
    //deal the cards to two players
    GameManage.DealCardsToPlayers(deck, player1, player2)

    distrubiteCardAndCompare()
}

//make the array order random
// function shuffle(array) {
//   array.sort(() => Math.random() - 0.5);
// }


function distrubiteCardAndCompare(){
    palyer1_card_img.setAttribute("src",hidden_card_imgUrl)
    for(let i=0; i<CardTotalCounts/2; i++){
        player1.cards.push(WholeCards[2*i])
        player2.cards.push(WholeCards[2*i + 1])
    }
}


//quit the game
function quitGame(){
    if (confirm("Do you want to quit the game?") == true) {
        Window.location.reload()
    } 
}

