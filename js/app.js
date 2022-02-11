/*-------------------------------- Constants --------------------------------*/



/*---------------------------- Variables (state) ----------------------------*/



/*------------------------ Cached Element References ------------------------*/



/*----------------------------- Event Listeners -----------------------------*/



/*-------------------------------- Functions --------------------------------*/

console.log('Absurdity Check')


//Pseudocode

// 1. My init function should render a screen that has 2 buttons.
  // 1.1 These 2 buttons are the only thing that my player should be able to CLICK to change the state of the game.
  // 1.2 Each button should have a unique modifier in the id or class that is going to get seen by their event handler.
  // 1.3 That value is going to go into a "starter function" to determine the amount of rounds the game will have.
  // 1.4 Upon click, the screen's layout will change to the gameboard layout.

// 2. The starter function will behave like a second init function.
  // 2.1 The player should be greeted by an empty board.
  // 2.2 The player should see 4 cards dealt to the player and dealer, alternating. Each card should be seen individually being dealt.
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