# Game Of War
<hr>
War is a very simple card game for two players. Much like real war it's incredibly long and pointless. It's mostly a kids game, since it relies exclusively on luck of the draw. -[<a href="https://cardgames.io/war/#about" target="_blank">cardgames</a>]

### Requirements
<hr>
To play, each player reveals the top card in their stack. The player who played the card with the higher rank (Aces high) takes both cards and puts them at the bottom of their stack in an arbitrary order.

If there is a tie, then it's War! In the card game each player adds places the top three cards of their stack face down, and then each player reveals the top card again. Whoever wins out of the second reveal takes all of the cards, and if there is another tie the process repeats until there is a winner.<br/>
### Implement technologies
<hr>
1. Html<br>
2. CSS<br>
3. Javascript<br>

### Features<hr>
 
#### 1. Play mode<br>
   * Automatic(default)
     In this mode, the game run automatically, you and your opponent don't need do any operations.
   * Manual
     In this mode, computer as the your opponent player, it draws cards automatic in each round. You need click your card image to draw the top card to deck.

#### 2. Game speed<br>
    Use the javascript function setTimeout() to implements, there are three options.
   * Slow: 1500 milliseconds
   * Normal(default): 800 milliseconds
   * Fast: 100 milliseconds

#### 3. Log information
    Print the informations(include the suit and rank of card which be drew to compared in current round, who won the round, and how many cards each player now has.) for each round to console.
