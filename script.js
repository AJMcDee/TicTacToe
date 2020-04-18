

// Setup, display and updating of game conditions go here

const gameBoard = (() => {
    // Defining the grid of the boxes
    const boardSetUp = ["A1", "A2", "A3", "B1", "B2", "B3", "C1", "C2", "C3"]
    let boardState = ["","","","","","","","",""]
    const gameBoard = document.getElementById("gameBoard");

    function setBoard() {
        boardSetUp.forEach(square => {
        const newDiv = document.createElement("div")
        newDiv.id = `${square}`
        newDiv.className = "gamesquare"
        newDiv.innerHTML = ""
        gameBoard.appendChild(newDiv)
        gameBoard.style.display = "none";
        });
    }
    setBoard()

    const add = (squareID, shape) => {
        const gameSquare = document.getElementById(squareID);
        gameSquare.textContent = shape;
        const index = boardSetUp.indexOf(`${squareID}`)
        boardState[index] = shape;
    }

    function disable() {
        gameBoard.style.cssText = "cursor: default; pointer-events: none;"
    }

    function resetBoardState() {
        boardState.length = 0
        for (let i = 0; i<9; i++) {
            boardState.push("");
        }
    }

    //Reset game, player, and gameboard for new round
    function reset() {
        const resetButton = document.createElement("button")
        const endGameMessage = document.getElementById("endgamemessage")
        const congratsMessage = document.getElementById("congratsmessage")

        function removeAndReplacePlayerInfo() {
            game.playerList.forEach(player => {

                const currentDiv = document.getElementById(`${player.playerID}info`)
                currentDiv.parentElement.removeChild(currentDiv);
               
                if (player.playerID === "player3") {
                    player.playerID = "player2"
                }
                const nameEntry = document.getElementById(`${player.playerID}name`)
                nameEntry.value = ""

                const formDiv = document.getElementById(`${player.playerID}`)
                formDiv.style.display = "inline";

                const colorEntry = document.getElementById(`${player.playerID}shapecolor`)
                colorEntry.value = "#000000"


            })
            game.playerList[0] = ""
            game.playerList[1] = ""
        }

        resetButton.id = "resetbutton";
        resetButton.textContent = "New Game";
        resetButton.addEventListener("click", function() {
            gameBoard.textContent = "";
            setBoard()
            resetBoardState()

            removeAndReplacePlayerInfo()
            playerSetUp.allPlayerInfo.style.display = "flex"
            gameBoard.style.pointerEvents = "auto";
            endGameMessage.parentElement.removeChild(endGameMessage)
            congratsMessage.parentElement.removeChild(congratsMessage)
            resetButton.parentElement.removeChild(resetButton)
        })

        document.getElementById("newgamebuttondisplay").appendChild(resetButton);

    }

    return {
        add,
        disable,
        reset,
        boardSetUp,
        boardState,
        gameBoard,
    }


})()

// Game event handlers go here
const game = (() => {
    const playerList = ["",""];
    const startGameButton = document.getElementById("startgame")
    const gamesquares = document.getElementsByClassName("gamesquare");
    startGameButton.addEventListener("click", gameEnvironment)
    startGameButton.style.visibility = "hidden";

    function getAllIndexes(arr, value) {
        let indexes = []
        for (let i = 0; i < arr.length; i++) {
            if (arr[i].includes(value)) {
                indexes.push(i)
            }
        }
        return indexes
    }

    function generateWinConditions(boardSetup) {
        let winConditionsFull = [];       

        boardSetup.forEach(item => {
            const firstChar = item[0];
            const secondChar = item[1];
            const firstCharIndexes = getAllIndexes(boardSetup, firstChar)
            const secondCharIndexes = getAllIndexes(boardSetup, secondChar)
            winConditionsFull.push(firstCharIndexes)
            winConditionsFull.push(secondCharIndexes)
        })
        winConditionsFull.push([0,4,8])
        winConditionsFull.push([2,4,6])

        //Convert to strings and back to allow for removal of duplicates
        let winConditionsFullStrings = ["0,4,8","2,4,6"]
        let finalWinCons = []
        winConditionsFull.forEach(winCon => { 
            let winConString = winCon.toString();
            if (winConditionsFullStrings.includes(winConString) === false) {
                winConditionsFullStrings.push(winConString)
            }
        })
        winConditionsFullStrings.forEach(winCon => {
            const newWinCon = winCon.split(",")
            finalWinCons.push(newWinCon)
        })
        return finalWinCons
    }
    const winCons = generateWinConditions(gameBoard.boardSetUp)

    function checkWinCondition() {
        let gameOver = false;
        
        const boxFilled = (currentBox) => currentBox.length > 0;
        if (gameBoard.boardState.every(boxFilled)) {
            gameOver = true
            displayEndGame("none")
            return gameOver
        }

        winCons.forEach(item => {
            let boxCount = 0;
            let boxLog = [];

            const gameOverBoxes = () => {
                boxLog.forEach(boxIndex => {
                    const divID = gameBoard.boardSetUp[boxIndex]
                    const currentDiv = document.getElementById(divID)
                    currentDiv.style.backgroundColor = "green";
                    currentDiv.addEventListener("mouseleave", function () {
                        currentDiv.style.backgroundColor = "green";
                    })
                })
            }

            item.forEach(index => {
                if (gameBoard.boardState[index].length > 0 && 
                    gameBoard.boardState[index] === gameBoard.boardState[item[0]]) {
                    boxCount += 1;
                    boxLog.push(index)
                }
            })

        if (boxCount === 3) {
            gameOver = true;
            gameOverBoxes()
            displayEndGame(currentPlayer)
            return gameOver
        }

        })
        if (gameOver === false) {togglePlayer()}
        return gameOver
    }

    /// Computer has three priorities in this order: 
    
        // 1. Taking the centre square; 
        // 2. Blocking the third square if two in any win condition are identical
        // 3. Filling a random empty square

        // To do this, I use a 'box count' to count how many boxes in any given win condition are already filled.
        // This number is used to determine the next course of action, and a log is kept of the board indexes filled,
        // which are in turn removed from a copy of the relevant win condition array, leaving the empty square.

    function computerPlay() {
        let turnOver = false;
        for (let i = 0; i < winCons.length; i++) {
            
            const item = winCons[i]
            let boxCount = 0;
            let boxLog = [];
            

            const winConBoxCount = () => {

                for (let i = 0; i < item.length; i++) {
                    let index = item[i]
                    boxCount = 0;
                    boxLog = []
                    let indexIndex = item.indexOf(index);

                    function pushCountAndLog(index, matchedBox) {
                        boxCount += 2;
                        boxLog.push(index, matchedBox) 
                    }

                    ///Ensure that of the list of WinCons, 2 out of 3 match, and one is empty
                    function matchTwoBoxesOnly(index, indexIndex) {
                        let matchedBox
                        let indexPossibilities = ["0", "1", "2"]
                        indexPossibilities.splice(indexIndex,1)

                        if (gameBoard.boardState[index].length > 0 && 
                            (gameBoard.boardState[item[indexPossibilities[0]]].length < 1 ||
                            gameBoard.boardState[item[indexPossibilities[1]]].length < 1)) {
                            if (gameBoard.boardState[index] === gameBoard.boardState[item[indexPossibilities[0]]]) {
                                matchedBox = item[indexPossibilities[0]]
                            } else if (gameBoard.boardState[index] === gameBoard.boardState[item[indexPossibilities[1]]]) {
                                matchedBox = item[indexPossibilities[1]]
                            } 
                        } 
                        return matchedBox
                    }

                    if (!matchTwoBoxesOnly(index,indexIndex)) {
                        boxCount = 1
                    } else {
                        const matchedBox = matchTwoBoxesOnly(index,indexIndex)
                        pushCountAndLog(index, matchedBox)
                        break
                    }
                 }
                return [boxCount, boxLog] 
            }

            let result = winConBoxCount()
            boxCount = result[0]
            boxLog = result[1]

            if (gameBoard.boardState[4].length === 0) {
                gameBoard.add(gameBoard.boardSetUp[4], "O")
                turnOver = true;
                break
            } else if (boxCount === 2) {
                boxLog.sort();
                const itemIndexLast = item.indexOf(boxLog[1]);
                const itemIndexNext = item.indexOf(boxLog[0]);
                let itemTempCopy = [...item];
                itemTempCopy.splice(itemIndexLast,1)
                itemTempCopy.splice(itemIndexNext,1)
                gameBoard.add(gameBoard.boardSetUp[itemTempCopy[0]], "O")
                turnOver = true;
                break
            }
        }

            if (turnOver === false) {
                let emptySquares = []
                for (let i = 0; i < gameBoard.boardState.length; i++) {
                    if (gameBoard.boardState[i].length < 1) {
                        emptySquares.push(i)
                    } 
                }

            const randomSquare = Math.floor(Math.random() * emptySquares.length)
            const gameboardIndex = emptySquares[randomSquare]
            gameBoard.add(gameBoard.boardSetUp[gameboardIndex], "O")
            }
        

            
    }

    function displayEndGame(winner) {
        playerSetUp.allPlayerInfo.style.display = "none"
        startGameButton.style.visibility = "hidden"
        const endGameMessage = document.createElement("h1")
        endGameMessage.textContent = "GAME OVER"
        endGameMessage.id = "endgamemessage"
        const congratsMessage = document.createElement("h2")
        congratsMessage.id = "congratsmessage"

        if (winner === "none") {
            congratsMessage.textContent = `It was a tie!`
        } else {
            let winnerIndex
            for (let i = 0; i < game.playerList.length; i++) {
                if (game.playerList[i].playerID === winner) {
                    winnerIndex = i
                }
            }
            congratsMessage.textContent = `Congratulations ${game.playerList[winnerIndex].name}`
        }
        const resultsDiv = document.getElementById("resultsdisplay")
        resultsDiv.appendChild(endGameMessage)
        resultsDiv.appendChild(congratsMessage)
        gameBoard.disable()
        gameBoard.reset()
    }

    let currentPlayer

    function togglePlayer() {
        if (currentPlayer === playerList[0].playerID) {
            currentPlayer = playerList[1].playerID
        } else {
            currentPlayer = playerList[0].playerID
        }
    }

    function gameEnvironment() {
        currentPlayer = "player1";
        gameBoard.gameBoard.style.cursor = "pointer"
        gameBoard.gameBoard.style.display = "grid"
        startGameButton.style.visibility = "hidden"
        for (let i = 0; i < gamesquares.length; i++) {

            const squareID = gamesquares[i].id;
            gamesquares[i].addEventListener("mouseenter", function () {
                if (gamesquares[i].textContent.length < 1) {
                    gamesquares[i].style.backgroundColor = "#DAD2BC";
                }
            })
            gamesquares[i].addEventListener("mouseleave", function () {
                gamesquares[i].style.backgroundColor = "#F7E9CA";
            })

                gamesquares[i].addEventListener("click", function () {
                    if (gamesquares[i].textContent.length < 1) {
                        if (currentPlayer === "player1") {
                            gamesquares[i].style.color = game.playerList[0].color
                            gameBoard.add(squareID,"X")
                            checkWinCondition()
                            
                            if (currentPlayer === "player3") {
                                computerPlay()
                                checkWinCondition()
                            }
        
                        } else if (currentPlayer === "player2") {
                            gamesquares[i].style.color = game.playerList[1].color
                            gameBoard.add(squareID, "O");
                            checkWinCondition()
                            }
                        } 
                })
        }

    }

    return {
       playerList,
       startGameButton
    }
})()

// Player function factory
const Player = (name, color, playerID, displayID) => {

    return {
        name,
        color,
        playerID,
        displayID
    }

}

// Player entry and settings go here
const playerSetUp = (function playerSetUp() { 
    const allPlayerInfo = document.getElementById("playerInformation")
    const submitButtons = document.getElementsByClassName("submitplayerbutton")

        for (let i = 0; i < submitButtons.length; i++) {
            let playerID = `player${i+1}`
            
            const button = document.getElementById(`submit${playerID}`)
            button.addEventListener("click", e => {

                let playerName
                let playerColor
                let currentDiv
                let displayID

                if (playerID === "player3") {
                    playerName = "Commander Data"
                    playerColor = "black"
                    currentDiv = document.getElementById("player2")
                    displayID = "Computer"
                } else {             
                    playerName = document.getElementById(`${playerID}name`).value 
                    playerColor = document.getElementById(`${playerID}shapecolor`).value
                    currentDiv = document.getElementById(playerID)
                    displayID = `Player ${i+1}`
                }



                let newPlayer = Player(playerName, playerColor, playerID)
                let playerSymbol
                if (playerID === "player1") {
                    game.playerList[0] = newPlayer
                    playerSymbol = "X"
                } else {
                    game.playerList[1] = newPlayer
                    playerSymbol = "O"
                }

                

                const parentDiv = document.getElementById("playerInformation")
                const newDiv = document.createElement('div')
                newDiv.id = `${playerID}info`;
                newDiv.innerHTML = `
                <h4>${displayID}</h4>
                ${playerName}<br>
                <font color="${playerColor}">${playerSymbol}</font>
                `

                if (game.playerList[0].playerID === "player1" 
                && game.playerList[1].playerID) {
                    game.startGameButton.style.visibility = "visible"
                }

                if (playerID === "player1") {
                    parentDiv.insertAdjacentElement("afterbegin", newDiv)
                } else {
                    parentDiv.insertAdjacentElement("beforeend", newDiv)
                }

                currentDiv.style.display = "none";
            })

        }
    return {
        allPlayerInfo
    }
})()

