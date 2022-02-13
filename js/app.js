/*-------------------------------- Constants --------------------------------*/
const deck = ["dA", "dQ", "dK", "dJ", "d10", "d09", "d08", "d07", "d06", "d05", "d04", "d03", "d02", "hA", "hQ", "hK", "hJ", "h10", "h09", "h08", "h07", "h06", "h05", "h04", "h03", "h02", "cA", "cQ", "cK", "cJ", "c10", "c09", "c08", "c07", "c06", "c05", "c04", "c03", "c02", "sA", "sQ", "sK", "sJ", "s10", "s09", "s08", "s07", "s06", "s05", "s04", "s03", "s02"]
const spentDeck = []

/*---------------------------- Variables (state) ----------------------------*/
let totalToWin, playerScore, dealerScore, currentRound, playerValue, dealerValue, roundStart, deckCopy, cardDealt, cardDiv, playerStands, dealerValueRevealed, roundEnd, cacheValue, dealerStands


/*------------------------ Cached Element References ------------------------*/
// HTML elements
let startScreen = document.querySelector('#start-screen')
let gameScreen = document.querySelector('#game-screen')
let gameMode = document.querySelector('#mode')
let pointsCounter = document.querySelector('#points')
let roundCounter = document.querySelector('#round-counter')
let playerArea = document.querySelector('#player-area')
let playerMessage = document.querySelector('#player-message')
let playerCards = document.querySelector('#player-card')
let dealerArea = document.querySelector('#dealer-area')
let dealerMessage = document.querySelector('#dealer-message')
let dealerCards = document.querySelector('#dealer-card')

// Button elements
let roundsBtns = document.querySelector('#rounds')
let actionBtns = document.querySelector('#actions-buttons')
let restartBtns = document.querySelector('#restart-buttons')




/*----------------------------- Event Listeners -----------------------------*/
roundsBtns.addEventListener('click', handleStart)
actionBtns.addEventListener('click', handleAction)
restartBtns.addEventListener('click', handleRestart)



/*-------------------------------- Functions --------------------------------*/
function init() {
  totalToWin = undefined
  startScreen.style.display = 'flex'
  gameScreen.classList.add('hidden')
}

function startGame() {
  startScreen.style.display = 'none'
  gameScreen.classList.remove('hidden')
  playerScore = 0
  dealerScore = 0
  currentRound = 1

  playerValue = 0
  dealerValue = 0

  // deals out the initial two cards each round
  roundStart = true

  roundEnd = false

  // Resets the deck
  gameDeck = [...deck]

  // Makes sure boards are clear upon reset
  playerMessage.innerHTML = ''
  playerCards.innerHTML = ''
  dealerMessage.innerHTML = ''
  dealerCards.innerHTML = ''

  render()
}

function render() {
  dealInitialTwoCards()

  determineRoundEnd()

  renderText()
}

// Render Helpers
function renderText() {
  gameMode.innerHTML = `Best of ${totalToWin}`
  pointsCounter.innerHTML = `Player ${playerScore} - Dealer ${dealerScore}`
  roundCounter.innerHTML = `Round ${currentRound}`

  if (playerValue > 21) {
    playerMessage.innerHTML = `With a total of ${playerValue}, you bust and lose the round.`
    dealerMessage.innerHTML = `The player busts. The dealer wins this round.`
  } else if(dealerValue > 21) {
    playerMessage.innerHTML = `The dealer busts. You win this round!`
    dealerMessage.innerHTML = `With a total of ${dealerValue}, you bust and lose the round.`
  }else if (playerValue === 21 && dealerValue === 21) {
    playerMessage.innerHTML = `You and the dealer both have a total of ${playerValue}. The round is a tie.`
    dealerMessage.innerHTML = `You and the player both have a total of ${dealerValue}. The round is a tie.`
  } else if(dealerValue < 21 && dealerValue === 21) {
    playerMessage.innerHTML = `You lose the round.`
    dealerMessage.innerHTML = `The dealer has a total of ${dealerValue} exactly. The dealer win this round.`
  } else if (playerValue === 21 && dealerValue < 21) {
    playerMessage.innerHTML = `You got a total of ${playerValue} exactly. You win this round!`
    dealerMessage.innerHTML = `The dealer loses this round.`
  } else {
    playerMessage.innerHTML = `You currently have a total of ${playerValue}.`
    dealerMessage.innerHTML = `The dealer has ${dealerValueRevealed}`
  }
}

function dealInitialTwoCards() {
  // If has cards is set to false,
  if (roundStart === true) {
    dealPlayer()
    dealDealer()
    dealPlayer()
    dealDealer()
    roundStart = false
  }
}

function dealPlayer() {
  if (gameDeck.length > 0) {
    pickACard()
    getValue()
    console.log('cachev in player deal',cacheValue)
    playerValue += cacheValue
    playerCards.appendChild(cardDiv)
  } else if (gameDeck.length === 0) {
    shuffle()
    return dealPlayer()
  }
}

function dealDealer() {
  if (dealerCards.childElementCount >= 1) {
    if (gameDeck.length > 0) {
      pickACard()
      getValue()
      cardDiv.setAttribute('class', `card large back-red ${cardDealt}`)
      dealerValue += cacheValue
      dealerCards.appendChild(cardDiv)
    } else if (gameDeck.length === 0) {
      shuffle()
      return dealDealer()
    }
  } else if (dealerCards.childElementCount === 0) {
    if (gameDeck.length > 0) {
      pickACard()
      getValue()
      dealerValueRevealed = cacheValue
      dealerValue = cacheValue
      dealerCards.appendChild(cardDiv)
    } else if (gameDeck.length === 0) {
      shuffle()
      return dealDealer()
    }
  }
}

function shuffle() {
  gameDeck = [...deck]
}

function pickACard() {
  let randInx = Math.floor(Math.random() * gameDeck.length)
  cardDealt = gameDeck.splice(randInx, 1).toString()
  cardDiv = document.createElement('div')
  cardDiv.setAttribute('class', `card large ${cardDealt}`)
}

function getValue(){
  let convertString = cardDealt.split('').slice(1).join('')

  // I have no idea how to get this working in a non-evil way like this. I tried both parseInt(cS) === NaN and cS.isNaN and neither worked.
  if (convertString.length === 1) {
    if (convertString === 'A') {
      return cacheValue = 11
    } else {
      return cacheValue = 10
    }
  } else {
    return cacheValue = parseInt(convertString)
  }
}

function determineRoundEnd() {
  if (playerValue < 21 && dealerValue < 21){
    roundEnd = false
  } else if (playerValue >= 21 || dealerValue >= 21)(
    roundEnd = true
  )
}

// Event Handler Functions
function handleStart(evt) {
  totalToWin = parseInt(evt.target.id.toString().slice(-1))
  console.log('handStart invoked', totalToWin)
  startGame()

}

function handleAction(evt) {
  if (evt.target.id === 'hit') {
    console.log('Hit it')
    dealPlayer()
  } else if (evt.target.id === 'stand') {
    // set a value to compare?
  }
  render()
}

function handleRestart(evt) {
  if (evt.target.id === 'reset') {
    console.log('reset invoked', totalToWin)
    return init()
  } else if (evt.target.id === 'replay') {
    console.log('replay invoked', totalToWin)
    return startGame()
  }
}

//Pseudocode

//// 1. My init function should render a screen that has 2 buttons.
//  // 1.1 These 2 buttons are the only thing that my player should be able to CLICK to change the state of the game.
//  // 1.2 Each button should have a unique modifier in the id or class that is going to get seen by their event handler.
//  // 1.3 That value is going to go into a "starter function" to determine the amount of rounds the game will have.
//  // 1.4 Upon click, the screen's layout will change to the gameboard layout.

//// 2. The starter function will behave like a second init function.
//  // 2.1 The player should be greeted by an empty board.
//  // 2.2 The player should see 4 cards dealt to the player and dealer, alternating. Each card should be seen individually being dealt.
  // 2.3 Once this animation is finished, the game checks if each player has a natural. If so, the winner gets a point and the round goes forward. Tie will also be handled where cards are returned and the round goes forward.
  // 2.4 The player will get the option to select two game buttons: Hit and Stand, and a reset button.

// 3.a If the player selects Hit:
  // 3.1a A card is dealt to the player, then the game checks if the player has bust or not. If the player busts, the dealer is awarded a point, all cards are removed at the same time and new round starts.
  // 3.2a If the player doesn't bust, the dealer goes. If the dealer has cards with value of 17 or above, they stand. Otherwise they hit and inititive is returned to the player.
  // 3.3a Repeat until...
// 3.b The Player selects Stand:
  // 3.1b The dealer is given hits until they get a value of 17 to bust.
// 4. Values are compared. 
  // 4.1 Player will know that they have won or lost the round (animation/colors/sounds/plain message?)
// 5. Repeat 2 to 4 until
// 6. When the game reaches the end state, player or dealer will have won x of the total rounds. 
  // 6.1 Something signifies that the player has won. Win message, confetti, sound or a mix.
  // 6.2 Replay button becomes rendered.

// E.1 Reset button will call on the function that inits to the step 1 screen and the value for rounds is removed.
// E.2 Replay button will call on the function that starts screen where the value for the rounds is kept.