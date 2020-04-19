
// Game event handlers go here
const game = (() => {
    const playerList = ["",""];
    const startGameButton = document.getElementById("startgame")
    const gamesquares = document.getElementsByClassName("gamesquare");
    startGameButton.addEventListener("click", gameEnvironment)
    startGameButton.style.display = "none";

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

        winCons.forEach(item => {
            let boxCount = 0;
            let boxLog = [];

            const gameOverBoxes = () => {
                boxLog.forEach(boxIndex => {
                    const divID = gameBoard.boardSetUp[boxIndex]
                    const currentDiv = document.getElementById(divID)
                    currentDiv.style.backgroundColor = "#C0F79C";
                    currentDiv.addEventListener("mouseleave", function () {
                        currentDiv.style.backgroundColor = "#C0F79C";
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

        const boxFilled = (currentBox) => currentBox.length > 0;
        if (gameOver === false && gameBoard.boardState.every(boxFilled)) {
            gameOver = true
            displayEndGame("none")
            return gameOver
        }
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
        startGameButton.style.display = "none"
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
        startGameButton.style.display = "none"
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
                                setTimeout(computerPlay, 500)
                                setTimeout(checkWinCondition, 600)
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