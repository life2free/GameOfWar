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
const TimeOutArray=[1500, 800, 100]

//when it's war, player should draw 4 cards to deck
const DrawCardsCountWhenWar = 4



//default timeout value:1000milliseconds = 1 second
let timeout = 1000


/**
 * mode is refer to manual or automatic draw card for self
 * mode=0(manual) indicate user self should click the card image to draw a card to deck
 * mode=1(automatic) indicate it's automatic to draw a card to deck
 * default value of mode is 1
 */
let mode = 1

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

//define the timer set interval variable for automatic mode
let autoRunInterval 

/****** define class ********** */
//define Deck class
class Deck{
    constructor(){
        this.cards = []
    };

    //generate the All cards(52 cards)
    generateAllCards(){
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


//define instances of class Deck,Player for the game
let deck = new Deck();
let opponent = new Player();
let self = new Player();

//the game manage class
class GameManage{
    constructor(){
    }

    //sets the game page's elements properties and game variables before start game
    static DoSettingBeforeStartGame(){
        //get the speed value to set timeout value
        let speedRadios = document.getElementsByName("speed")
        let speedStr = this.GetRadioCheckedValue(speedRadios)
        let timeoutIndex = parseInt(speedStr)
        timeout = TimeOutArray[timeoutIndex]

        //get the mode value
        let modeRadios = document.getElementsByName("mode")
        let modeStr = this.GetRadioCheckedValue(modeRadios)
        mode = parseInt(modeStr)

        //disabled the speed and mode radio options
        speedRadios.forEach(speed=>speed.disabled = true)
        modeRadios.forEach(mode=>mode.disabled = true)

        //get the players' name
        let opponentName = document.getElementById("opponent_name_text").value
        if(opponentName == null || opponentName.trim() == "" ){
            opponentName = "Mick"
        }
        opponentName = opponentName.trim()
        opponent.name = opponentName

        let selfName = document.getElementById("self_name_text").value
        if(selfName == null || selfName.trim() =="" ){
            selfName = "Jack"
        }
        selfName = selfName.trim()
        self.name = selfName

        //disappear the players' name text elements on the game page 
        let inputname = document.getElementsByName("inputname")
        inputname.forEach(item=>item.style.display="none")

        //display the opponent's name on game page
        let opponent_name = document.getElementById("opponent_name")
        opponent_name.innerText = opponent.name.concat(" (Opponent)")
        opponent_name.style.display = "block"
        //display the self's name on game page
        let self_name = document.getElementById("self_name")
        self_name.innerText = self.name.concat(" (You)")
        self_name.style.display = "block"

        //disabled the "Deal" button
        document.getElementById("btn_startGame").disabled = true
        //enabled the "Quit Game"
        document.getElementById("btn_quitGame").disabled = false
        //disappear the card back image on deck 
        let game_deck_card_back_img = document.getElementById("game_deck_card_back_img")
        game_deck_card_back_img.style.visibility = "hidden"  

        
        if(!mode){
            //if it's manual mode
            this.DisplayTipInfo("Click on your top card to play it")
            //add the listener clickDrawCardToDeck() for clicking the self player's card
            document.getElementById("self_deck_card_img").addEventListener("click", clickDrawCardToDeck)
        }else{
            //if it's automatic mode, disappear the tip element on game page
            document.getElementById("gameTips").style.visibility = "hidden" 
        }
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
        this.DisplayCardImage(showCardImgElementId, (imgIsUp ? card.imgUrl : CardBackImgUrl))
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
    static ShiftCardsToPlayer(sourceCards,playerCards){
        sourceCards.forEach(item=>playerCards.push(item))
        sourceCards.splice(0)
    }

    //display card image on game page
    static DisplayCardImage(displayCardImgElementId, imgUrl){
        document.getElementById(displayCardImgElementId).setAttribute("src", imgUrl)
    }

    //remove cards image on game page
    static RemoveCardImages(removeCardImgElementIdList){
        removeCardImgElementIdList.forEach(removeCardImgElementId=>document.getElementById(removeCardImgElementId).setAttribute("src",""))   
    }

    //display cards count on game page
    static DisplayCardsCount(displayCardsCountElementId, cardsCount){
        let displayCardsCountElement = document.getElementById(displayCardsCountElementId)
        displayCardsCountElement.innerText = (cardsCount>0 ? cardsCount : "")
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
    static LogGameRoundInfo(opponent,opponetPlayerCard, self, selfPlayerCard,compareValue){
        let opponentName = opponent.name
        let opponetCardsCnt = opponent.cards.length + opponent.cardsOnDeck.length
        let selfName = self.name
        let selfCardsCnt = self.cards.length + self.cardsOnDeck.length
        let logInfo = (new Date().toLocaleString()).concat(" ").concat(opponentName).concat("(Opponent):")
            .concat(opponetPlayerCard.suit).concat(" ").concat(opponetPlayerCard.rank).concat(", has ").concat(opponetCardsCnt)
            .concat(" cards now. ").concat(selfName).concat("(Self):").concat(selfPlayerCard.suit).concat(" ").concat(selfPlayerCard.rank).concat(", has ")
            .concat(selfCardsCnt).concat(" cards now. ")
        if(compareValue>0){
            logInfo = logInfo.concat(opponentName).concat("(Opponent) won the round!")
        }else if(compareValue<0){
            logInfo = logInfo.concat(selfName).concat("(You) won the round!")
        }else{
            logInfo = logInfo.concat("It's War!")
        }
        console.log(logInfo)
    }

    //display tip to self
    static DisplayTipInfo(tipInfo){
        document.getElementById("gameTips").value = tipInfo
    }

    //display the new game button when game is over
    static DisplayNewGameButton(){
        alert("net game button")
        document.getElementById("btn_quitGame").style.display = "none"
        document.getElementById("btn_newGame").style.display = "block"
    }
}


/**
 * do init jobs, include generate all cards
 */
function init(){
    //generate all cards and shuffle
    deck.generateAllCards()
    deck.shuffle()

    //generate the players
    generatePlayers()

    //put all cards on the deck, just show the image of card back on deck
    GameManage.DisplayCardImage("game_deck_card_back_img",CardBackImgUrl)
}


//generate two game players
function generatePlayers(){
    //generate two game players
    //the default name of opponent and self, later can edit them on game page before start game
    opponent.name = "Mick"
    opponent.cards = []
    self.name = "Jack"
    self.cards = []
}


//start the game
function startGame(){
    
    //sets the game page's elements properties and game variables before start game
    GameManage.DoSettingBeforeStartGame()

    //deal the cards to two players
    GameManage.DealCardsToPlayers(deck, opponent, self)

    //run the game
    run()
}

function run(){
    if(!mode){
        //manual mode
        //player opponent draw a card to deck automatically
        autoDrawCardToDeck(opponent,"opponent_card_img","opponent_deck_cards_count","game_deck_opponent_cards_count")
    }else{
        //automatic mode
        autoRunInterval = setInterval("autoRun()", timeout)
    }
}

//run the game in automatic mode at timeout intervals
function autoRun(){
    if(!isGameOver){
        // setInterval("autoGameRound()", timeout)
        autoGameRound()
    }else{
        //if game is over, the clear the time set
        clearInterval(autoRunInterval)
    }
}

//run the game each round automatically
function autoGameRound(){
    if(!isWar){
        GameManage.DrawCardToDeck(opponent,"opponent_card_img","opponent_deck_cards_count","game_deck_opponent_cards_count")
        GameManage.DrawCardToDeck(self,"self_card_img","self_deck_cards_count","game_deck_self_cards_count")
        compare()
    }else{
        for(let i=1; i<DrawCardsCountWhenWar; i++){
            GameManage.DrawCardToDeck(opponent,"opponent_card_img","opponent_deck_cards_count","game_deck_opponent_cards_count",0)
        }
        GameManage.DrawCardToDeck(opponent,"opponent_card_img","opponent_deck_cards_count","game_deck_opponent_cards_count")

        for(let i=1; i<DrawCardsCountWhenWar; i++){
            GameManage.DrawCardToDeck(self,"self_card_img","self_deck_cards_count","game_deck_self_cards_count",0)
        }
        GameManage.DrawCardToDeck(self,"self_card_img","self_deck_cards_count","game_deck_self_cards_count")
        compare()
    }
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
            if(isWar && canClickToDrawCardTimes>0){
                GameManage.DisplayTipInfo("you need play " + canClickToDrawCardTimes + " more " +  ( canClickToDrawCardTimes==1 ? "card" : "cards" ) + " to finish the war")
            }else{
                GameManage.DisplayTipInfo("Click on your top card to play it")
            }
            let imgIsUp = canClickToDrawCardTimes>0 ? 0 : 1;
            GameManage.DrawCardToDeck(self,"self_card_img","self_deck_cards_count","game_deck_self_cards_count",imgIsUp)
            
            if(canClickToDrawCardTimes==0){
                setTimeout(function() {compare()},timeout)
            }
        }else{
            GameManage.DisplayTipInfo("Wait...")
            setTimeout(function() {
                GameManage.DisplayTipInfo("Click on your top card to play it")
            },timeout)
        }
    }
}

function compare(){
    let opponent_topcard_ondeck = GameManage.GetLastCard(opponent.cardsOnDeck)
    let self_topcard_ondeck = GameManage.GetLastCard(self.cardsOnDeck)
    if(opponent_topcard_ondeck.score>0 && self_topcard_ondeck.score>0){
        let compareValue = GameManage.CompareCardsScore(opponent_topcard_ondeck,self_topcard_ondeck)
        if(compareValue==0){
            //it's war in the round
            GameManage.DisplayTipInfo("War... you need play 4 more cards to finish the war")
            isWar = true;
            canClickToDrawCardTimes = DrawCardsCountWhenWar
            GameManage.LogGameRoundInfo(opponent,opponent_topcard_ondeck,self,self_topcard_ondeck,compareValue)
            if(opponent.cards.length<DrawCardsCountWhenWar || self.cards.length<DrawCardsCountWhenWar){
                isGameOver = true
                if(opponent.cards.length<DrawCardsCountWhenWar){
                    if(opponent.cards.length == 0){
                        GameManage.RemoveCardImages(["opponent_deck_card_img","opponent_deck_show_card_img"])
                    }
                    GameManage.DisplayTipInfo("WoW...you win the game")
                    console.log(self.name + "(You) win the game1")
                    alert(self.name + "(You) win the game!")
                }else{
                    if(self.cards.length==0){
                        GameManage.RemoveCardImages(["self_deck_show_card_img","self_deck_card_img"])
                    }
                    GameManage.DisplayTipInfo("You have no more cards to play the war. Opponent win the game")
                    console.log(opponent.name + "(Opponent) win the game!")
                    alert(opponent.name + "(Opponent) win the game")
                }
                GameManage.DisplayNewGameButton()
            }else{
                if(!mode){
                    //draw 4 opponent cards to deck, on deck, 1-3 cards face down, the fourth card face up
                    for(let i=1; i<DrawCardsCountWhenWar; i++){
                        autoDrawCardToDeck(opponent,"opponent_card_img","opponent_deck_cards_count","game_deck_opponent_cards_count",0)
                    }
                    autoDrawCardToDeck(opponent,"opponent_card_img","opponent_deck_cards_count","game_deck_opponent_cards_count")
                }
            }
        }else{
            isWar = false
            if(compareValue>0){
                //opponent win in the round
                GameManage.ShiftCardsToPlayer(self.cardsOnDeck,opponent.cards)
                GameManage.ShiftCardsToPlayer(opponent.cardsOnDeck,opponent.cards)
                
                GameManage.LogGameRoundInfo(opponent,opponent_topcard_ondeck,self,self_topcard_ondeck,compareValue)
                let timeoutValue = timeout
                if(mode){
                    timeoutValue = timeout/2
                }

                setTimeout(function() {
                    GameManage.DisplayCardsCount("game_deck_self_cards_count",self.cardsOnDeck.length)
                    GameManage.DisplayCardsCount("game_deck_opponent_cards_count",opponent.cardsOnDeck.length)
                    GameManage.DisplayCardsCount("opponent_deck_cards_count",opponent.cards.length)
                    GameManage.RemoveCardImages(["opponent_card_img","self_card_img"])
                    let opponent_deck_show_card_img = document.getElementById("opponent_deck_show_card_img")
                    opponent_deck_show_card_img.setAttribute("src",opponent_topcard_ondeck.imgUrl)
                    canClickToDrawCardTimes = 1
                        },timeoutValue)

                //opponent win in the game       
                if(self.cards.length==0){
                    GameManage.RemoveCardImages(["self_deck_show_card_img","self_deck_card_img"])
                    GameManage.DisplayTipInfo("you lose the game")
                    console.log("Opponent win the game")
                    console.log(opponent.name + "(Opponent) win the game!")
                    alert(opponent.name + "(Opponent) win the game")
                    isGameOver = true
                    GameManage.DisplayNewGameButton()
                }else{
                    if(!mode){
                        setTimeout(function() {
                            autoDrawCardToDeck(opponent,"opponent_card_img","opponent_deck_cards_count","game_deck_opponent_cards_count")
                        },timeout)
                    }
                }
            }else{
                //self win in the round
                GameManage.ShiftCardsToPlayer(opponent.cardsOnDeck,self.cards)
                GameManage.ShiftCardsToPlayer(self.cardsOnDeck,self.cards)
                
                GameManage.LogGameRoundInfo(opponent,opponent_topcard_ondeck,self,self_topcard_ondeck,compareValue)
                let timeoutValue = timeout
                if(mode){
                    timeoutValue = timeout/2
                }

                setTimeout(function() {
                    GameManage.DisplayCardsCount("game_deck_self_cards_count",self.cardsOnDeck.length)
                    GameManage.DisplayCardsCount("game_deck_opponent_cards_count",opponent.cardsOnDeck.length)
                    GameManage.DisplayCardsCount("self_deck_cards_count",self.cards.length)
                    GameManage.RemoveCardImages(["opponent_card_img","self_card_img"])
                    let self_deck_show_card_img = document.getElementById("self_deck_show_card_img")
                    self_deck_show_card_img.setAttribute("src",self_topcard_ondeck.imgUrl)
                    canClickToDrawCardTimes = 1
                    },timeoutValue)
                
                //self win in the game
                if(opponent.cards.length == 0){
                    GameManage.RemoveCardImages(["opponent_deck_card_img","opponent_deck_show_card_img"])
                    GameManage.DisplayTipInfo("WoW...you win the game")
                    console.log(self.name + "(You) win the game1")
                    alert(self.name + "(You) win the game!")
                    isGameOver = true
                    GameManage.DisplayNewGameButton()
                }else{
                    if(!mode){
                        setTimeout(function() {
                            autoDrawCardToDeck(opponent,"opponent_card_img","opponent_deck_cards_count","game_deck_opponent_cards_count")
                        },timeout)
                    }
                }
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

//start a new game
function newGame(){
    window.location.reload()
}