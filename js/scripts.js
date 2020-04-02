/**
 * Author: Shimin Rao
 * Date: 1/12/2020
 * Version: 1.0.0
 *
 * For: Game of War
 * Rules: refer to https://cardgames.io/war/#about
 *
 * implement：
 *  1. Automatic mode(default)
 *      1) in each round, the program draw card to deck automatically
 *          a) when in normal round, just one card will be drew to deck and face up
 *          b) when in war round, four cards will be drew to deck, first to third cards face down, the last card face up
 *      2) choose one top card in each of static on deck and compare them score
 *      3) deal with it according to the difference
 *          a) the difference is positive or negative, then the player which hold the card has higher score won the round,
 *              then shift the cards on deck to the winner. go next round
 *          b) the difference is zero, namely the two score are equal, then it's war round. four cards will be drew to deck, first to third cards face down, the last card face up
 *      4) when one of player has no card to play, or in war round, the player has cards less than 4 cards, the game is over.
 *  2. Manual mode
 *      the process is same as Automatic mode, the difference is the self player. when in Automatic mode, the program draw a card
 *      automatically for self player, in manual mode, the self player need click the card image on page to draw a card.
 */

/**** define the constants *****/
// the total count of cards
const CardTotalCounts = 52;

/**
 * the max score of the card.
 * the card score is from 2 to 14,it's just for the programming to compare
 * score 11 for Jack
 * score 12 for Queen
 * score 13 for King
 * score 14 is for Ace
 */
const MaxCardScore = 14;

// the card rank array
const CardRankArray = [
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "Jack",
  "Queen",
  "King",
  "Ace"
];

// the card suit array
const SuitsOfCard = ["Heart", "Spade", "Club", "Diamond"];

// the absolute parent path of card image
const ImageAbsolutePath = "./img/";

// the name of the image that show card face down
const CardBackImgName = "red_back.png";

// card back image url, use the image when card face down
const CardBackImgUrl = ImageAbsolutePath + CardBackImgName;

/**
 * the values are some specified number of milliseconds, one of them will be the parameter of function setTimeOut()
 * For: control the game play speed. There are 3 speed options:
 *  1. Slow: 1500 milliseconds
 *  2. Normal(default): 800 milliseconds
 *  3. Fast: 100 milliseconds
 */
const TimeOutArray = [1500, 800, 100];

// when it's war, player should draw 4 cards to deck
const DrawCardsCountWhenWar = 4;

// define the constants for html elements' id
const opponentNameTextEleId = "opponent_name_text";
const selfNameTextEleId = "self_name_text";
const opponentNameEleId = "opponent_name";
const selfNameEleId = "self_name";
const btnStartGameEleId = "btn_startGame";
const btnQuitGameEleId = "btn_quitGame";
const btnNewGameEleId = "btn_newGame";
const gameDeckCardBackImgEleId = "game_deck_card_back_img";
const selfDeckOristackImgEleId = "self_deck_originstack_img";
const selfDeckWinstackImgEleId = "self_deck_winstack_img";
const oppDeckOristackImgEleId = "opponent_deck_originstack_img";
const oppDeckWinstackImgEleId = "opponent_deck_winstack_img";
const oppDeckCardsCountEleId = "opponent_deck_cards_count";
const selfDeckCardsCountEleId = "self_deck_cards_count";
const gameDeckSelfCardsCountEleId = "game_deck_self_cards_count";
const gameDeckOppCardsCountEleId = "game_deck_opponent_cards_count";
const oppCardImgEleId = "opponent_card_img";
const selfCardImgEleId = "self_card_img";

/**** define the variables *****/
// timeout for control the play speed. timeout value:1000milliseconds = 1 second
let timeout = 1000;

// some step need less timeout
let lessTimeout = 500;

/**
 * mode is refer to play mode option. There are 2 options: manual or automatic
 * mode=0(manual) indicate user should click the card image to draw a card to deck
 * mode=1(automatic) indicate it's automatic to draw a card to deck
 * default value of mode is 1
 */
let mode = 1;

/**
 * the time of player click card to draw card to deck in each round.
 * There are 2 types of round: normal and war.
 * If it's normal round, canClickToDrawCardTimes=1,the player only can click 1 time to draw 1 card to deck in current round
 * if it's war round, canClickToDrawCardTimes=4,the player should click 4 times to draw 4 cards to deck in current round
 */
let canClickToDrawCardTimes = 1;

// tag the round is war or not, default value is false
let isWar = false;

// tag game is over or not, default value is false
let isGameOver = false;

// define the timer set interval variable for function setInterval() when game is played in automatic mode
let autoRunInterval;

/******** define class ********** */
/**
 * Deck class represent the deck of the card game
 * @class Deck
 * @property {Array} cards - stores 52 cards for the game
 * @constructs
 */
class Deck {
  constructor() {
    this.cards = [];
  }

  /**
   * generate the All cards(52 cards) for the deck, then push them in cards
   * @method generateAllCards
   * @param
   */
  generateAllCards() {
    let imgName = "";
    let imgWholePath = "";
    for (let i = 2; i <= MaxCardScore; i++) {
      let score = i;
      let rank = CardRankArray[i - 2];
      let tempRank = rank;
      if (i > 10) {
        /* when the card rank in ["Jack","Queen","King","Ace"], get the first character,like "J","Q","K","A",
         * for get the image file name later
         */
        tempRank = tempRank[0];
      }
      for (let suitIndex in SuitsOfCard) {
        let suit = SuitsOfCard[suitIndex];
        /* get the rank's first character and suit's first character to generate the image file name,
         * like "3D.png", "JD.png" and etc.
         */
        imgName = tempRank + suit.charAt(0) + ".png";
        imgWholePath = ImageAbsolutePath + imgName;
        let card = new Card(suit, rank, score, imgWholePath);
        this.cards.push(card);
      }
    }
  }

  // shuffle the cards to random order
  shuffle = () => this.cards.sort(() => Math.random() - 0.5);
}

//define Card class
/**
 * @class Card
 * @property {String} suit - the card suit, like "Heart","Spade","Club","Diamond"
 * @property {String} rank - the card rank, "Ace","2"..."King"
 * @property {num} score - the card score, from 2 to 14. the 11 for Jack,12 for Queen,13 for King,14 is for Ace
 * @property {imgUrl} imgUrl - the image file url of the card, for display the card on page
 * @constructs
 */
class Card {
  constructor(suit, rank, score, imgUrl) {
    this.suit = suit;
    this.rank = rank;
    this.score = score;
    //imgUrl is the card's image url
    this.imgUrl = imgUrl;
  }
}

/**
 * the game player
 * @class Player
 * @property {String} name - the player's name
 * @property {Array} cardsOnOriginStack - stores the cards which the player origin hold (exclude the cards which be drew to deck to compare)
 * @property {Array} cardsOnWinStack - stores the cards which be shift from deck to the player when the player win
 * @property {Array} cardsOnDeck - stores the cards which be drew to deck to compare
 * @property {num} cardsCountOnStack - stores the cards which be drew to deck to compare
 * @constructs
 */
class Player {
  constructor() {
    (this.name = ""), (this.cardsOnOriginStack = []);
    this.cardsOnWinStack = [];
    this.cardsOnDeck = [];
    this.cardsCountOnStack = 0;
  }
}

// define instances of class Deck,Player for the game
let deck = new Deck();
let opponent = new Player();
let self = new Player();

/**
 * this class is define to manage the game
 * @class GameManage
 * @constructs
 */
class GameManage {
  constructor() {}

  /**
   * set variable before start play
   * @method DoSettingBeforeStartGame
   * @static
   */
  static DoSettingBeforeStartGame() {
    // get the speed value to set timeout value
    let speedRadios = document.getElementsByName("speed");
    let speedStr = this.GetRadioCheckedValue(speedRadios);
    let timeoutIndex = parseInt(speedStr);
    timeout = TimeOutArray[timeoutIndex];

    // get the mode value
    let modeRadios = document.getElementsByName("mode");
    let modeStr = this.GetRadioCheckedValue(modeRadios);
    mode = parseInt(modeStr);

    lessTimeout = timeout;
    if (mode) {
      lessTimeout = timeout / 2;
    }

    // disabled the speed and mode radio options
    speedRadios.forEach(speedRadio => (speedRadio.disabled = true));
    modeRadios.forEach(modeRadio => (modeRadio.disabled = true));

    // set the players' name from the page
    this.SetPlayerNameFromPage(opponent, opponentNameTextEleId, "Mick");
    this.SetPlayerNameFromPage(self, selfNameTextEleId, "Jack");

    // disappear the players' name text elements on the game page
    let inputname = document.getElementsByName("inputname");
    inputname.forEach(item => (item.style.display = "none"));

    // display the opponent's name on game page
    let opponent_name = document.getElementById(opponentNameEleId);
    opponent_name.innerText = opponent.name.concat(" (Opponent)");
    opponent_name.style.display = "block";
    // display the self's name on game page
    let self_name = document.getElementById(selfNameEleId);
    self_name.innerText = self.name.concat(" (You)");
    self_name.style.display = "block";

    // disabled the "Deal" button
    document.getElementById(btnStartGameEleId).disabled = true;
    // enabled the "Quit Game" button
    document.getElementById(btnQuitGameEleId).disabled = false;
    // disappear the card back image on deck
    let game_deck_card_back_img = document.getElementById(
      gameDeckCardBackImgEleId
    );
    game_deck_card_back_img.style.visibility = "hidden";

    if (!mode) {
      //if it's manual mode
      this.DisplayTipInfo("Click on your top card to play it");
      //add the listener clickDrawCardToDeck() for clicking the self player's card
      document
        .getElementById(selfDeckOristackImgEleId)
        .addEventListener("click", clickDrawCardToDeck);
    } else {
      //if it's automatic mode, disappear the gameTips element on game page
      document.getElementById("gameTips").style.visibility = "hidden";
    }
  }

  /**
   * set the players' name from the page
   * @method SetPlayerNameFromPage
   * @static
   * @param {Object} gamePlayer - the game player
   * @param {String} playerNameElementId - the id of html element which display the player's name
   * @param {String} defaultName - the default name for player, if the player didn't type the name, then use this value
   */
  static SetPlayerNameFromPage(gamePlayer, playerNameElementId, defaultName) {
    let playerName = document.getElementById(playerNameElementId).value;
    if (playerName === null || playerName.trim() === "") {
      playerName = defaultName;
    }
    playerName = playerName.trim();
    gamePlayer.name = playerName;
  }

  /**
   * deal the cards to players, then each player has 26 cards
   * @method DealCardsToPlayers
   * @static
   * @param {Object} gameDeck - the deck of the game
   * @param {Object} gameOpponent - the opponent player
   * @param {Object} gameSelf - the self player
   */
  static DealCardsToPlayers(gameDeck, gameOpponent, gameSelf) {
    let cards = gameDeck.cards;
    for (let i = 0; i < CardTotalCounts / 2; i++) {
      gameOpponent.cardsOnOriginStack.push(cards[2 * i]);
      gameSelf.cardsOnOriginStack.push(cards[2 * i + 1]);
    }
    gameOpponent.cardsCountOnStack = gameOpponent.cardsOnOriginStack.length;
    gameSelf.cardsCountOnStack = gameSelf.cardsOnOriginStack.length;

    // display the card back image and counts on game page for two players
    this.DisplayCardImage(oppDeckOristackImgEleId, CardBackImgUrl);
    this.DisplayCardsCount(
      oppDeckCardsCountEleId,
      gameOpponent.cardsCountOnStack
    );
    this.DisplayCardImage(selfDeckOristackImgEleId, CardBackImgUrl);
    this.DisplayCardsCount(selfDeckCardsCountEleId, gameSelf.cardsCountOnStack);
  }

  /**
   * draw a card from player to deck
   * @method DrawCardToDeck
   * @static
   * @param {Object} gamePlayer - the game player
   * @param {String} showCardImgElementId - the id of the html element which display the card
   * @param {String} playerDeckCardsCntElementId - the id of the html element which display the count of cards player hold after draw a card
   * @param {String} gameDeckPlayerCardsCntElementId - the id of the html element which display the count of cards player drew to deck
   * @param {num} imgIsUp - decide the image card is face up or down,1 for up,0 for down, default value is 1
   */
  static DrawCardToDeck(
    gamePlayer,
    showCardImgElementId,
    playerDeckCardsCntElementId,
    gameDeckPlayerCardsCntElementId,
    imgIsUp = 1
  ) {
    // draw a card from player
    let card = gamePlayer.cardsOnOriginStack.shift();
    gamePlayer.cardsCountOnStack -= 1;
    this.DisplayCardsCount(
      playerDeckCardsCntElementId,
      gamePlayer.cardsCountOnStack
    );
    // push the card to deck
    gamePlayer.cardsOnDeck.push(card);
    this.DisplayCardImage(
      showCardImgElementId,
      imgIsUp ? card.imgUrl : CardBackImgUrl
    );
    this.DisplayCardsCount(
      gameDeckPlayerCardsCntElementId,
      gamePlayer.cardsOnDeck.length
    );
  }

  /**
   * get the last card of a card array
   * @GetLastCard
   * @method
   * @param {Array} gameCards - the array stores the cards
   * @returns {Object} - return a card
   */
  static GetLastCard(gameCards) {
    if (gameCards.length > 0) {
      return gameCards[gameCards.length - 1];
    }
    return new Card("", "", 0, "");
  }

  /**
   * compare the two card score
   * @method CompareCardsScore
   * @static
   * @param {Array} gameCard1 - the card which will be compared
   * @param {Array} gameCard2 - the card which will be compared
   * @returns {num} - return the the two card score's different
   */
  static CompareCardsScore(gameCard1, gameCard2) {
    return gameCard1.score - gameCard2.score;
  }

  /**
   * shift the cards from sourceCards to targetCards
   * @method ShiftCards
   * @static
   * @param {Array} sourceCards - the array stored the cards which will be shift to another array
   * @param {Array} targetCards -
   */
  static ShiftCards(sourceCards, targetCards) {
    sourceCards.forEach(item => targetCards.push(item));
    sourceCards.splice(0);
  }

  static HandleNormalRound(
    roundWinPlayer,
    roundLosePlayer,
    oppComparedCard,
    selfComparedCard,
    compareValue
  ) {
    // opponent player win in the round, shift the cards on the deck to ooponent player
    this.ShiftCards(
      roundLosePlayer.cardsOnDeck,
      roundWinPlayer.cardsOnWinStack
    );
    this.ShiftCards(roundWinPlayer.cardsOnDeck, roundWinPlayer.cardsOnWinStack);
    roundWinPlayer.cardsCountOnStack =
      roundWinPlayer.cardsOnOriginStack.length +
      roundWinPlayer.cardsOnWinStack.length;

    this.LogGameRoundInfo(
      opponent,
      oppComparedCard,
      self,
      selfComparedCard,
      compareValue
    );

    setTimeout(function() {
      // display the count of cards on deck and the opponent player
      GameManage.DisplayCardsCount(gameDeckSelfCardsCountEleId, 0);
      GameManage.DisplayCardsCount(gameDeckOppCardsCountEleId, 0);
      GameManage.DisplayCardsCount(
        compareValue > 0 ? oppDeckCardsCountEleId : selfDeckCardsCountEleId,
        roundWinPlayer.cardsCountOnStack
      );

      // remove the images of the cards on deck
      GameManage.RemoveCardImages([oppCardImgEleId, selfCardImgEleId]);
      if (compareValue > 0) {
        let opponent_deck_winstack_img = document.getElementById(
          oppDeckWinstackImgEleId
        );
        opponent_deck_winstack_img.setAttribute("src", oppComparedCard.imgUrl);
      } else {
        let self_deck_winstack_img = document.getElementById(
          selfDeckWinstackImgEleId
        );
        self_deck_winstack_img.setAttribute("src", selfComparedCard.imgUrl);
      }
      canClickToDrawCardTimes = 1;
    }, lessTimeout);

    if (roundLosePlayer.cardsCountOnStack === 0) {
      let resultInfo = "win the game!";
      if (compareValue > 0) {
        // opponent player win in the game
        setTimeout(function() {
          GameManage.RemoveCardImages([
            selfDeckWinstackImgEleId,
            selfDeckOristackImgEleId,
            oppDeckWinstackImgEleId
          ]);
        }, lessTimeout);
        this.DisplayTipInfo("you lose the game");
        resultInfo = roundWinPlayer.name + "(Opponent) " + resultInfo;
      } else {
        // self player win in the game
        setTimeout(function() {
          GameManage.RemoveCardImages([
            oppDeckOristackImgEleId,
            oppDeckWinstackImgEleId,
            selfDeckWinstackImgEleId
          ]);
        }, lessTimeout);
        this.DisplayTipInfo("WoW...you win the game");
        resultInfo = roundWinPlayer.name + "(You) " + resultInfo;
      }
      console.log(resultInfo);
      this.DisplayGameResult(resultInfo);
      isGameOver = true;
      this.DisplayNewGameButton();
    } else {
      // check the count of cards on originstack are enough for war round or not (1 cards)
      this.CheckOriginStackCardsCount(isWar);

      if (!mode) {
        setTimeout(function() {
          autoDrawCardToDeck(
            opponent,
            oppCardImgEleId,
            oppDeckCardsCountEleId,
            gameDeckOppCardsCountEleId
          );
        }, timeout);
      }
    }
  }

  /**
   * check two player's cards on originstack is enough for next round or not
   *   1) if next round is war, there should at least have 4 cards on player's originstack, otherwise, shift cards from winstack to originstack
   *   2) if next round is normal, there should at least have 1 card on player's originstack, otherwise, shift cards from winstack to originstack
   * @method CheckOriginStackCardsCount
   * @static
   * @param {Boolean} war - indicate is war round or not, true: war round, false: normal roudn
   */
  static CheckOriginStackCardsCount(war) {
    // minCount: the count of cards next round need, 1 for normal round, 4 for war round
    let minCount = war ? DrawCardsCountWhenWar : 1;
    if (opponent.cardsOnOriginStack.length < minCount) {
      // shift the cards from winstack to originstack for opponent player
      GameManage.ShiftCards(
        opponent.cardsOnWinStack,
        opponent.cardsOnOriginStack
      );
      GameManage.RemoveCardImages([oppDeckWinstackImgEleId]);
    }

    if (self.cardsOnOriginStack.length < minCount) {
      // shift the cards from winstack to originstack for self player
      GameManage.ShiftCards(self.cardsOnWinStack, self.cardsOnOriginStack);
      GameManage.RemoveCardImages([selfDeckWinstackImgEleId]);
    }
  }

  /**
   * display card image on game page
   * @method DisplayCardImage
   * @static
   * @param {String} displayCardImgElementId - the id of the html element which display the image
   * @param {String} imgUrl - the url of the image file
   */
  static DisplayCardImage(displayCardImgElementId, imgUrl) {
    document
      .getElementById(displayCardImgElementId)
      .setAttribute("src", imgUrl);
  }

  /**
   * remove cards image on game page
   * @method RemoveCardImages
   * @static
   * @param {String} removeCardImgElementIdList - the id list of the elements which display the images that will be disappeared
   */
  static RemoveCardImages(removeCardImgElementIdList) {
    removeCardImgElementIdList.forEach(removeCardImgElementId =>
      document.getElementById(removeCardImgElementId).setAttribute("src", "")
    );
  }

  /**
   * display the cards' count on game page
   * @method DisplayCardsCount
   * @static
   * @param {String} displayCardsCountElementId - the id of the html element which display the cards' count
   * @param {num} cardsCount - the count of the cards
   */
  static DisplayCardsCount(displayCardsCountElementId, cardsCount) {
    let displayCardsCountElement = document.getElementById(
      displayCardsCountElementId
    );
    displayCardsCountElement.innerText = cardsCount > 0 ? cardsCount : "";
  }

  /**
   * get the checked value of a radio element list
   * @method GetRadioCheckedValue
   * @static
   * @param {Array} radioElements - the radio element array
   * @returns {String} - the checked value of the radio element array
   */
  static GetRadioCheckedValue(radioElements) {
    for (let i = 0; i < radioElements.length; i++) {
      if (radioElements[i].checked === true) {
        return radioElements[i].value;
      }
    }
  }

  /**
   * print the game round information to console, include the suit and rank of card which be drew to compared in current round, who won the round, and how many cards each player now has
   * @method LogGameRoundInfo
   * @static
   * @param {Object} opponent - opponent player
   * @param {Object} opponetPlayerCard - the card which be drew from opponent player to deck in current round
   * @param {Object} self - self player
   * @param {Object} selfPlayerCard - the card which be drew from opponent player to deck in current round
   * @param {num} compareValue - the difference of two cards' score in current round
   */
  static LogGameRoundInfo(
    opponent,
    opponetPlayerCard,
    self,
    selfPlayerCard,
    compareValue
  ) {
    let opponentName = opponent.name;
    let opponetCardsCnt =
      opponent.cardsCountOnStack + opponent.cardsOnDeck.length;
    let selfName = self.name;
    let selfCardsCnt = self.cardsCountOnStack + self.cardsOnDeck.length;
    let logInfo = new Date()
      .toLocaleString()
      .concat(" ")
      .concat(opponentName)
      .concat("(Opponent):")
      .concat(opponetPlayerCard.suit)
      .concat(" ")
      .concat(opponetPlayerCard.rank)
      .concat(", has ")
      .concat(opponetCardsCnt)
      .concat(" cards now. ")
      .concat(selfName)
      .concat("(Self):")
      .concat(selfPlayerCard.suit)
      .concat(" ")
      .concat(selfPlayerCard.rank)
      .concat(", has ")
      .concat(selfCardsCnt)
      .concat(" cards now. ");
    if (compareValue > 0) {
      logInfo = logInfo
        .concat(opponentName)
        .concat("(Opponent) won the round!");
    } else if (compareValue < 0) {
      logInfo = logInfo.concat(selfName).concat("(You) won the round!");
    } else {
      logInfo = logInfo.concat("It's War!");
    }
    console.log(logInfo);
  }

  /**
   * displayt the tip information on game page
   * @method DisplayTipInfo
   * @static
   * @param {String} tipInfo
   */
  static DisplayTipInfo(tipInfo) {
    document.getElementById("gameTips").value = tipInfo;
  }

  /**
   * display the game result on game page
   * @method DisplayGameResult
   * @static
   * @param {String} resultInfo - the information of result, include who won the game
   */
  static DisplayGameResult(resultInfo) {
    // display the html element which will display the game result in
    document.getElementById("game_result").style.display = "block";
    document.getElementById("game_result").innerHTML = resultInfo;
  }

  /**
   * display the "New Game" button when game is over, press this button can begin a new game
   * @method DisplayNewGameButton
   * @static
   */
  static DisplayNewGameButton() {
    document.getElementById(btnQuitGameEleId).style.display = "none";
    document.getElementById(btnNewGameEleId).style.display = "block";
  }
}

/**
 * do init jobs, include generate all cards and etc.
 */
function init() {
  // generate all cards and shuffle the cards
  deck.generateAllCards();
  deck.shuffle();

  // generate the players of the game
  generatePlayers();

  // put all cards on the deck, just show the image of card back on deck
  GameManage.DisplayCardImage(gameDeckCardBackImgEleId, CardBackImgUrl);
}

/**
 * generate two game players
 */
function generatePlayers() {
  // the default name of opponent and self, later can edit them on game page before start game
  opponent.name = "Mick";
  // opponent.cards = []
  self.name = "Jack";
  // self.cards = []
}

/**
 * start the game, for manual mode. when self player press the "Deal" button, then invoke this function to start the game
 */
function startGame() {
  // sets the game page's elements properties and game variables before start play
  GameManage.DoSettingBeforeStartGame();

  // deal the cards to two players
  GameManage.DealCardsToPlayers(deck, opponent, self);

  // run the game
  run();
}

/**
 * run the game
 */
function run() {
  if (!mode) {
    // if in manual mode, opponent player draw a card to deck automatically
    autoDrawCardToDeck(
      opponent,
      oppCardImgEleId,
      oppDeckCardsCountEleId,
      gameDeckOppCardsCountEleId
    );
  } else {
    // automatic mode with set interval
    autoRunInterval = setInterval("autoRun()", timeout);
  }
}

/**
 * run the game in automatic mode at timeout intervals
 */
function autoRun() {
  if (!isGameOver) {
    autoGameRound();
  } else {
    // if game is over, then clear the time set
    clearInterval(autoRunInterval);
  }
}

/**
 * run the game each round automatically, for automatic mode
 */
function autoGameRound() {
  if (!isWar) {
    // if current round is not war, then each player just draw one to deck
    GameManage.DrawCardToDeck(
      opponent,
      oppCardImgEleId,
      oppDeckCardsCountEleId,
      gameDeckOppCardsCountEleId
    );
    GameManage.DrawCardToDeck(
      self,
      selfCardImgEleId,
      selfDeckCardsCountEleId,
      gameDeckSelfCardsCountEleId
    );
    compare();
  } else {
    // if current round is war, then each player need draw 4 cards to deck, the first to third cards face down, the last one face up
    for (let i = 1; i < DrawCardsCountWhenWar; i++) {
      GameManage.DrawCardToDeck(
        opponent,
        oppCardImgEleId,
        oppDeckCardsCountEleId,
        gameDeckOppCardsCountEleId,
        0
      );
    }
    GameManage.DrawCardToDeck(
      opponent,
      oppCardImgEleId,
      oppDeckCardsCountEleId,
      gameDeckOppCardsCountEleId
    );

    for (let i = 1; i < DrawCardsCountWhenWar; i++) {
      GameManage.DrawCardToDeck(
        self,
        selfCardImgEleId,
        selfDeckCardsCountEleId,
        gameDeckSelfCardsCountEleId,
        0
      );
    }
    GameManage.DrawCardToDeck(
      self,
      selfCardImgEleId,
      selfDeckCardsCountEleId,
      gameDeckSelfCardsCountEleId
    );
    // compare the two cards score and handle it
    compare();
  }
}

/**
 * opponent player draw a card to deck automatically when in manual mode.
 * @method autoDrawCardToDeck
 * @param {Object} gamePlayer - the game player
 * @param {String} showCardImgElementId - the id of the html element which display the card
 * @param {String} playerDeckCardsCntElementId - the id of the html element which display the count of cards player hold after draw a card
 * @param {String} gameDeckPlayerCardsCntElementId - the id of the html element which display the count of cards player drew to deck
 * @param {num} imgIsUp - decide the image card is face up or down,1 for up,0 for down, default value is 1
 */
function autoDrawCardToDeck(
  gamePlayer,
  showCardImgElementId,
  playerDeckCardsCntElementId,
  gameDeckPlayerCardsCntElementId,
  imgIsUp = 1
) {
  // the timeout value is for control the speed
  setTimeout(function() {
    GameManage.DrawCardToDeck(
      gamePlayer,
      showCardImgElementId,
      playerDeckCardsCntElementId,
      gameDeckPlayerCardsCntElementId,
      imgIsUp
    );
  }, timeout);
}

/**
 * self player draw a card to deck by clicking the card image when in manual mode.
 */
function clickDrawCardToDeck() {
  if (!isGameOver) {
    if (canClickToDrawCardTimes > 0) {
      canClickToDrawCardTimes -= 1;
      if (isWar && canClickToDrawCardTimes > 0) {
        // when it's war round and self player hasn't click 4 times to draw card
        GameManage.DisplayTipInfo(
          "you need play " +
            canClickToDrawCardTimes +
            " more " +
            (canClickToDrawCardTimes === 1 ? "card" : "cards") +
            " to finish the war"
        );
      } else {
        GameManage.DisplayTipInfo("Click on your top card to play it");
      }
      let imgIsUp = canClickToDrawCardTimes > 0 ? 0 : 1;
      GameManage.DrawCardToDeck(
        self,
        selfCardImgEleId,
        selfDeckCardsCountEleId,
        gameDeckSelfCardsCountEleId,
        imgIsUp
      );

      if (canClickToDrawCardTimes === 0) {
        // when self player already drew 1 card in normal round or drew 4 cards in war round,
        // then delay timeout milliseconds to invoke function compare()  to achive controling the speed
        setTimeout(function() {
          compare();
        }, timeout);
      }
    } else {
      GameManage.DisplayTipInfo("Wait...");
      setTimeout(function() {
        GameManage.DisplayTipInfo("Click on your top card to play it");
      }, timeout);
    }
  }
}

/**
 * compare the scores of two card, then deal with it according to the difference
 */
function compare() {
  // get the top card in each stack on deck
  let opponent_topcard_ondeck = GameManage.GetLastCard(opponent.cardsOnDeck);
  let self_topcard_ondeck = GameManage.GetLastCard(self.cardsOnDeck);
  if (opponent_topcard_ondeck.score > 0 && self_topcard_ondeck.score > 0) {
    let compareValue = GameManage.CompareCardsScore(
      opponent_topcard_ondeck,
      self_topcard_ondeck
    );
    if (compareValue === 0) {
      // it's war round
      GameManage.DisplayTipInfo(
        "War... you need play 4 more cards to finish the war"
      );
      isWar = true;
      canClickToDrawCardTimes = DrawCardsCountWhenWar;
      // print the round information to console
      GameManage.LogGameRoundInfo(
        opponent,
        opponent_topcard_ondeck,
        self,
        self_topcard_ondeck,
        compareValue
      );
      if (
        opponent.cardsCountOnStack < DrawCardsCountWhenWar ||
        self.cardsCountOnStack < DrawCardsCountWhenWar
      ) {
        // if one of the player has not enough cards to play the war, the game is over
        isGameOver = true;
        // check which player has not enough cards
        if (opponent.cardsCountOnStack < DrawCardsCountWhenWar) {
          if (opponent.cardsCountOnStack === 0) {
            GameManage.RemoveCardImages([
              oppDeckOristackImgEleId,
              oppDeckWinstackImgEleId
            ]);
          }
          GameManage.DisplayTipInfo("WoW...you win the game");
          let resultInfo =
            opponent.name +
            "(Opponent) has not enough cards to play the war. " +
            self.name +
            "(You) win the game!";
          console.log(resultInfo);
          resultInfo =
            opponent.name +
            " has not enough cards to play the war. <br />" +
            self.name +
            " win the game!";
          GameManage.DisplayGameResult(resultInfo);
        } else {
          if (self.cardsCountOnStack === 0) {
            GameManage.RemoveCardImages([
              selfDeckWinstackImgEleId,
              selfDeckOristackImgEleId
            ]);
          }
          GameManage.DisplayTipInfo(
            "You have no more cards to play the war. Opponent win the game"
          );
          let resultInfo =
            self.name +
            "(You) has not enough cards to play the war. " +
            opponent.name +
            "(Opponent) win the game!";
          console.log(resultInfo);
          resultInfo =
            self.name +
            " has not enough cards to play the war. <br />" +
            opponent.name +
            " win the game!";
          GameManage.DisplayGameResult(resultInfo);
        }
        GameManage.DisplayNewGameButton();
      } else {
        // check the count of cards on originstack are enough for next round or not (4 cards)
        GameManage.CheckOriginStackCardsCount(isWar);

        if (!mode) {
          /**
           * in manual mode, both players has enough cards to player the war round,
           * then draw 4 opponent cards to deck, on deck, 1-3 cards face down, the fourth card face up
           *  the self player need click the card image to draw
           */
          for (let i = 1; i < DrawCardsCountWhenWar; i++) {
            autoDrawCardToDeck(
              opponent,
              oppCardImgEleId,
              oppDeckCardsCountEleId,
              gameDeckOppCardsCountEleId,
              0
            );
          }
          autoDrawCardToDeck(
            opponent,
            oppCardImgEleId,
            oppDeckCardsCountEleId,
            gameDeckOppCardsCountEleId
          );
        }
      }
    } else {
      isWar = false;
      if (compareValue > 0) {
        // opponent player win in the round
        GameManage.HandleNormalRound(
          opponent,
          self,
          opponent_topcard_ondeck,
          self_topcard_ondeck,
          compareValue
        );
      } else {
        // self player win in the round
        GameManage.HandleNormalRound(
          self,
          opponent,
          opponent_topcard_ondeck,
          self_topcard_ondeck,
          compareValue
        );
      }
    }
  }
}

/**
 * press button "Quit Game" to invoke this fuction to quit the game
 */
function quitGame() {
  if (confirm("Do you want to quit the game?") === true) {
    window.location.reload();
  }
}

/**
 * press button "New Game" to invoke this fuction to start a new game
 */
function newGame() {
  window.location.reload();
}
