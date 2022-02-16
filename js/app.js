/*-------------------------------- Constants ----------------------------------*/
const deck = ["dA", "dQ", "dK", "dJ", "d10", "d09", "d08", "d07", "d06", "d05", "d04", "d03", "d02", "hA", "hQ", "hK", "hJ", "h10", "h09", "h08", "h07", "h06", "h05", "h04", "h03", "h02", "cA", "cQ", "cK", "cJ", "c10", "c09", "c08", "c07", "c06", "c05", "c04", "c03", "c02", "sA", "sQ", "sK", "sJ", "s10", "s09", "s08", "s07", "s06", "s05", "s04", "s03", "s02"]

//Layout Tester
// const deck = ["dA","dA","dA","dA"]

/*---------------------------- Variables (state) ------------------------------*/
let totalToWin, playerScore, dealerScore, currentRound, playerValue, dealerValue, roundStart, deckCopy, cardDealt, cardDiv, playerStands, dealerValueRevealed, roundEnd, cacheValue, dealerStands, dealerHasHit, playerInitiative, timeoutID


/*------------------------ Cached Element References --------------------------*/
// HTML elements
let startScreen = document.querySelector('#start-screen')
let gameScreen = document.querySelector('#game-screen')
let gameMode = document.querySelector('#mode')
let pointsCounter = document.querySelector('#points')
let roundCounter = document.querySelector('#round-counter')
let messageElement = document.querySelector('#message')
let playerArea = document.querySelector('#player-area')
let playerMessage = document.querySelector('#player-message')
let playerCards = document.querySelector('#player-card')
let dealerArea = document.querySelector('#dealer-area')
let dealerMessage = document.querySelector('#dealer-message')
let dealerCards = document.querySelector('#dealer-card')

// Button elements
let roundsBtns = document.querySelector('#rounds')
let roundsThreeBtn = document.querySelector('#best-3')
let roundsFiveBtn = document.querySelector('#best-5')
let actionBtns = document.querySelector('#actions-buttons')
let actionHitBtn = document.querySelector('#hit')
let actionStandBtn = document.querySelector('#stand')
let restartBtns = document.querySelector('#restart-buttons')
let replayBtn = document.querySelector('#replay')
let resetBtn = document.querySelector('#reset')


/*----------------------------- Event Listeners -------------------------------*/
// roundsBtns.addEventListener('click', handleStart)
roundsThreeBtn.addEventListener('click', handleRoundsThree)
roundsFiveBtn.addEventListener('click', handleRoundsFive)
// actionBtns.addEventListener('click', handleAction)
actionHitBtn.addEventListener('click', handleHit)
actionStandBtn.addEventListener('click', handleStand)

restartBtns.addEventListener('click', handleRestart)



/*-------------------------------- Functions ----------------------------------*/
//-------------------------------- Game Starters ------------------------------//
function init() {
  clearTimeout(timeoutID)
  totalToWin = undefined
  startScreen.style.display = 'flex'
  gameScreen.classList.add('hidden')
}

function startGame() {
  clearTimeout(timeoutID)
  startScreen.style.display = 'none'
  replayBtn.classList.add('hidden')
  resetBtn.classList.add('hidden')
  gameScreen.classList.remove('hidden')
  turnActionBtnOff()
  playerScore = 0
  dealerScore = 0
  currentRound = 1

  playerValue = 0
  dealerValue = 0

  // deals out the initial two cards each round
  roundStart = true

  playerInitiative = true
  playerStands = false
  roundEnd = false
  dealerStands = false

  // Resets the deck
  gameDeck = [...deck]

  // Makes sure boards are clear upon reset
  playerMessage.innerHTML = ''
  playerCards.innerHTML = ''
  dealerMessage.innerHTML = ''
  dealerCards.innerHTML = ''
  messageElement.innerHTML = ''

  render()
}

function newRound() {
  turnActionBtnOff()
  resetBtn.classList.add('hidden')
  playerValue = 0
  dealerValue = 0
  currentRound++

  roundStart = true
  playerStands = false
  roundEnd = false
  dealerStands = false

  playerMessage.innerHTML = ''
  playerCards.innerHTML = ''
  dealerMessage.innerHTML = ''
  dealerCards.innerHTML = ''
  messageElement.innerHTML = ''

  render()
}
//-----------------------------------------------------------------------------//




//----------------------------------- Render ----------------------------------//
function render() {
  dealInitialTwoCards()

  // Dealer turn when player stands
  if (!playerInitiative && !roundEnd) {
    dealerTurn()
  }

  // If the player has an ace and their score goes over 21, subtracts 10 from their value
  if (playerValue > 21 || dealerValue > 21) {
    aceToOne()
  }

  determineBust()

  renderText()

  if (roundEnd) {
    return renderRoundEnd()
  }

  if (playerStands && dealerStands) {
    roundEnd === true
    return renderRoundEnd()
  } else if (playerStands) {
    turnActionBtnOff()
    dealerTurn()
  }
}


function renderText() {
  gameMode.innerHTML = `Best of ${totalToWin}`
  pointsCounter.innerHTML = `Player ${playerScore} - Dealer ${dealerScore}`
  roundCounter.innerHTML = `Round ${currentRound}`

  if (!roundStart) {
    if (playerInitiative && dealerStands && !playerStands) {
      messageElement.innerHTML = 'The dealer stands. Do you hit or stand?'
    } else if (playerInitiative && dealerHasHit && !playerStands) {
      dealerHasHit = false
      messageElement.innerHTML = 'The dealer hit. Do you hit or stand?'
    }
  }

  if (playerValue > 21 && dealerValue > 21) {
    playerMessage.innerHTML = `With a total of ${playerValue}, you and the dealer bust and tie.`
    dealerMessage.innerHTML = `With a total of ${playerValue}, you and the dealer bust and tie.`
  } else if (dealerValue > 21) {
    playerMessage.innerHTML = `The dealer busts. You win this round!`
    dealerMessage.innerHTML = `With a total of ${dealerValue}, you bust and lose the round.`
  } else if (playerValue > 21) {
    playerMessage.innerHTML = `With a total of ${playerValue}, you bust and lose the round.`
    dealerMessage.innerHTML = `The player busts. The dealer wins this round.`
  } else if (playerValue === dealerValue && dealerValue === playerValue && roundEnd) {
    playerMessage.innerHTML = `You and the dealer both have a total of ${playerValue}. The round is a tie.`
    dealerMessage.innerHTML = `You and the player both have a total of ${dealerValue}. The round is a tie.`
  } else if (dealerValue < 21 && dealerValue === 21 && roundEnd) {
    playerMessage.innerHTML = `You lose the round.`
    dealerMessage.innerHTML = `The dealer has a total of ${dealerValue} exactly. The dealer win this round.`
  } else if (playerValue === 21 && dealerValue < 21 && roundEnd) {
    playerMessage.innerHTML = `You got a total of ${playerValue} exactly. You win this round!`
    dealerMessage.innerHTML = `The dealer loses this round.`
  } else if (playerValue < 21 && playerValue > dealerValue && roundEnd) {
    playerMessage.innerHTML = `You got a total of ${playerValue} exactly. You win this round!`
    dealerMessage.innerHTML = `The dealer loses this round.`
  } else if (dealerValue < 21 && dealerValue > playerValue && roundEnd) {
    playerMessage.innerHTML = `You got a total of ${playerValue} exactly. You win this round!`
    dealerMessage.innerHTML = `The dealer loses this round.`
  } else {
    playerMessage.innerHTML = `You currently have a total of ${playerValue}.`
    dealerMessage.innerHTML = `The dealer has ${dealerValueRevealed} revealed.`
  }
}

function turnActionBtnOn() {
  actionBtns.style.display = 'flex'
}

function turnActionBtnOff() {
  actionBtns.style.display = 'none'
}

function turnRestartBtnOn() {
  restartBtns.style.display = 'flex'
}

function turnRestartBtnOff() {
  restartBtns.style.display = 'none'
}

//-----------------------------------------------------------------------------//




//------------------------- Card Handling Functions ---------------------------//
function dealPlayer() {
  if (gameDeck.length > 0) {
    pickACard()
    cardDiv.setAttribute('class', `player card xlarge shadow ${cardDealt}`)
    getValue()
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
      cardDiv.setAttribute('class', `dealer card xlarge shadow back-red ${cardDealt}`)
      getValue()
      dealerValue += cacheValue
      dealerCards.appendChild(cardDiv)
    } else if (gameDeck.length === 0) {
      shuffle()
      return dealDealer()
    }
  } else if (dealerCards.childElementCount === 0) {
    if (gameDeck.length > 0) {
      pickACard()
      cardDiv.setAttribute('class', `dealer card xlarge shadow ${cardDealt}`)
      getValue()
      dealerValueRevealed = cacheValue
      dealerValue = cacheValue
      dealerCards.appendChild(cardDiv)
    } else if (gameDeck.length === 0) {
      shuffle()
      return dealDealer()
    }
  }
  playerInitiative = true
}

function dealerTurn() {
  timeoutID = setTimeout(() => {
    if (dealerValue > 16) {
      messageElement.innerHTML = 'The dealer stands.'
      dealerStands = true
      playerInitiative = true
    } else {
      messageElement.innerHTML = 'The dealer hits.'
      dealerHasHit = true
      dealDealer()
    }

    if (!roundEnd) {
      turnActionBtnOn()
    }
    render()
  }, 1000)
}

function shuffle() {
  gameDeck = [...deck]
}

function pickACard() {
  let randInx = Math.floor(Math.random() * gameDeck.length)
  cardDealt = gameDeck.splice(randInx, 1).toString()
  cardDiv = document.createElement('div')
}

function getValue() {
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

function dealInitialTwoCards() {
  // If has cards is set to false,
  if (roundStart) {
    dealPlayer()
    dealDealer()

    timeoutID = setTimeout(() => {
      dealPlayer()
      aceToOne()
      renderText()
    }, 1000)
    timeoutID = setTimeout(() => {
      dealDealer()
      determineNatural()

      roundStart = false
      if (!roundEnd) {
        playerInitiative = true
      }
      resetBtn.classList.remove('hidden')
      turnActionBtnOn()
      messageElement.innerHTML = 'Do you hit or stand?'
      render()
    }, 1500)
  }
}

function determineNatural() {
  aceToOne()
  if (playerValue === 21 || dealerValue === 21) {
    roundEnd = true
  }
}

function determineBust() {
  if (playerValue > 21 || dealerValue > 21) {
    roundEnd = true
  }
}
//-----------------------------------------------------------------------------//




//-------------------------- Ace Conversion Function --------------------------//
function aceToOne() {
  let checkPlayerCards = document.querySelectorAll('.player')
  let checkDealerCards = document.querySelectorAll('.dealer')

  checkPlayerHasAce(checkPlayerCards)
  checkDealerHasAce(checkDealerCards)
}

function checkPlayerHasAce(checkPlayerCards) {
  checkPlayerCards.forEach((card) => {
    let aceClubs = card.classList.contains('cA')
    let aceDiamond = card.classList.contains('dA')
    let aceHearts = card.classList.contains('hA')
    let aceSpades = card.classList.contains('sA')

    let accountedFor = card.classList.contains('value-1')

    if (aceClubs && !accountedFor && playerValue > 21) {
      card.classList.add('value-1')
      playerValue -= 10
    } else if (aceDiamond && !accountedFor && playerValue > 21) {
      card.classList.add('value-1')
      playerValue -= 10
    } else if (aceHearts && !accountedFor && playerValue > 21) {
      card.classList.add('value-1')
      playerValue -= 10
    } else if (aceSpades && !accountedFor && playerValue > 21) {
      card.classList.add('value-1')
      playerValue -= 10
    }
  })
}

function checkDealerHasAce(checkDealerCards) {
  checkDealerCards.forEach((card) => {
    let aceClubs = card.classList.contains('cA')
    let aceDiamond = card.classList.contains('dA')
    let aceHearts = card.classList.contains('hA')
    let aceSpades = card.classList.contains('sA')

    let accountedFor = card.classList.contains('value-1')

    if (aceClubs && !accountedFor && dealerValue > 21) {
      card.classList.add('value-1')
      dealerValue -= 10
    } else if (aceDiamond && !accountedFor && dealerValue > 21) {
      card.classList.add('value-1')
      dealerValue -= 10
    } else if (aceHearts && !accountedFor && dealerValue > 21) {
      card.classList.add('value-1')
      dealerValue -= 10
    } else if (aceSpades && !accountedFor && dealerValue > 21) {
      card.classList.add('value-1')
      dealerValue -= 10
    }
  })
}
//-----------------------------------------------------------------------------//




//---------------------------- End State Functions ----------------------------//
function renderRoundEnd() {
  turnActionBtnOff()
  let revealDealer = document.querySelectorAll('.dealer')
  revealDealer.forEach((card) => {
    card.classList.remove('back-red')
    dealerValueRevealed = dealerValue
  })
  renderText()

  if (playerValue === dealerValue) {
    messageElement.innerHTML = `This round is a tie!`
  } else if (playerValue === 21 || dealerValue > 21 || (playerValue > dealerValue && playerValue < 21)) {
    playerScore++
    messageElement.innerHTML = `The player wins this round!`
  } else if (dealerValue === 21 || playerValue > 21 || (dealerValue > playerValue && dealerValue < 21)) {
    dealerScore++
    messageElement.innerHTML = `The dealer wins this round!`
  }

  timeoutID = setTimeout(() => {
    if (playerScore === totalToWin || dealerScore === totalToWin) {
      renderGameEnd()
    } else {
      newRound()
    }
  }, 4000)
}

function renderGameEnd() {
  renderText()
  replayBtn.classList.remove('hidden')
  playerMessage.innerHTML = ''
  playerCards.innerHTML = ''
  dealerMessage.innerHTML = ''
  dealerCards.innerHTML = ''
  messageElement.innerHTML = ''

  if (playerScore === totalToWin) {
    playerMessage.innerHTML = `<h1>The player wins!</h1>`
    playerCards.innerHTML = `<img src="./images/playerwins.png" alt="player winner image" class="win-img">`
  } else if (dealerScore === totalToWin) {
    dealerMessage.innerHTML = `<h1>The dealer wins!</h1>`
    dealerCards.innerHTML = `<img src="./images/dealerwins.png" alt="dealer winner image" class="win-img">`
  }
}
//-----------------------------------------------------------------------------//




//-------------------------- Event Handler Functions --------------------------//
// function handleStart(evt) {
//   totalToWin = parseInt(evt.target.id.toString().slice(-1))
//   startGame()
// }

function handleRoundsThree() {
  totalToWin = 3
  startGame()
}

function handleRoundsFive() {
  totalToWin = 5
  startGame()
}

function handleHit() {
  turnActionBtnOff()
  timeoutID = setTimeout(() => {
    messageElement.innerHTML = `The player hits.`
    dealPlayer()
    playerInitiative = false

    if (playerInitiative) {
      turnActionBtnOn()
    }

    aceToOne()
    renderText()
    if (playerValue > 21) {
      renderRoundEnd()
    } else if (!playerInitiative) {
      dealerTurn()
    }
  }, 1000)
}

function handleStand() {
  turnActionBtnOff()
  timeoutID = setTimeout(() => {
    messageElement.innerHTML = `The player stands.`
    playerStands = true
    playerInitiative = false

    if (playerInitiative) {
      turnActionBtnOn()
    }

    renderText()
    if (playerValue > 21) {
      renderRoundEnd()
    } else if (!playerInitiative) {
      dealerTurn()
    }
  }, 1000)
}

// function handleAction(evt) {
//   turnActionBtnOff()
//   setTimeout(() => {
//     if (evt.target.id === 'hit') {
//       messageElement.innerHTML = `The player hits.`
//       dealPlayer()
//       playerInitiative = false
//     } else if (evt.target.id === 'stand') {
//       messageElement.innerHTML = `The player stands.`
//       playerStands = true
//       playerInitiative = false
//     }

//     if (playerInitiative) {
//       turnActionBtnOn()
//     }

//     aceToOne()
//     renderText()
//     if (playerValue > 21) {
//       renderRoundEnd()
//     } else if (!playerInitiative) {
//       dealerTurn()
//     }
//   }, 1000)
// }

function handleRestart(evt) {
  if (evt.target.id === 'reset') {
    return init()
  } else if (evt.target.id === 'replay') {
    return startGame()
  }
}
//-----------------------------------------------------------------------------//

