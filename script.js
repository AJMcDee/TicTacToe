// const testArray = [[1,2,3], [2,3,4]]
// const firstTry = testArray[0][2];
// const secondTry = testArray[0[2]];
// console.log(firstTry)
// console.log(secondTry)


// Display and updating of boardstate go here
const gameBoard = (() => {
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
        });
    }

    function setBoardState() {
        boardState.length = 0
        for (let i = 0; i<9; i++) {
            boardState.push("");
        }
    }

    setBoard()
    setBoardState()

    const add = (squareID, shape) => {
        const gameSquare = document.getElementById(squareID);
        gameSquare.textContent = shape;
        const index = boardSetUp.indexOf(`${squareID}`)
        boardState[index] = shape;
    }

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

    const winCons = generateWinConditions(boardSetUp)

    function disable() {
        gameBoard.style.cssText = "cursor: default; pointer-events: none;"
    }

    function reset() {
        const resetButton = document.createElement("button")
        const endGameMessage = document.getElementById("endgamemessage")
        const congratsMessage = document.getElementById("congratsmessage")

        function removeAndReplacePlayerInfo() {
            game.playerList.forEach(player => {
                const currentDiv = document.getElementById(`${player.playerID}info`)
                const formDiv = document.getElementById(`${player.playerID}`)
                currentDiv.parentElement.removeChild(currentDiv);
                formDiv.style.display = "inline";

                const nameEntry = document.getElementById(`${player.playerID}name`)
                nameEntry.value = ""

                const colorEntry = document.getElementById(`${player.playerID}shapecolor`)
                colorEntry.value = "#000000"
            })
        }


        resetButton.id = "resetbutton";
        resetButton.textContent = "New Game";
        resetButton.addEventListener("click", function() {
            gameBoard.textContent = "";
            setBoard()
            setBoardState()
            removeAndReplacePlayerInfo()
            gameBoard.style.pointerEvents = "auto";
            endGameMessage.parentElement.removeChild(endGameMessage)
            congratsMessage.parentElement.removeChild(congratsMessage)
            resetButton.parentElement.removeChild(resetButton)
        })
        gameBoard.insertAdjacentElement("beforebegin", resetButton);

    }

    return {
        add,
        disable,
        reset,
        boardSetUp,
        boardState,
        gameBoard,
        winCons
    }


})()

// Game event handlers go here
const game = (() => {
    const playerList = ["",""];
    const startGameButton = document.getElementById("startgame")
    const gamesquares = document.getElementsByClassName("gamesquare");
    startGameButton.addEventListener("click", gameEnvironment)
    startGameButton.style.visibility = "hidden";

    function checkWinCondition() {
        let gameOver = false;
        gameBoard.winCons.forEach(item => {
            let boxCount = 0;
            let boxLog = [];
            item.forEach(index => {
                if (gameBoard.boardState[index].length > 0 && 
                    gameBoard.boardState[index] === gameBoard.boardState[item[0]]) {
                    boxCount += 1;
                    boxLog.push(index)
                }
                if (boxCount === 3) {
                    gameOver = true;
                    boxLog.forEach(boxIndex => {
                        const divID = gameBoard.boardSetUp[boxIndex]
                        const currentDiv = document.getElementById(divID)
                        currentDiv.style.backgroundColor = "green";
                        currentDiv.addEventListener("mouseleave", function () {
                            currentDiv.style.backgroundColor = "green";
                        })
                    })
                }
            })
        })

        return gameOver
    }

    function displayEndGame(winner) {
        const endGameMessage = document.createElement("h1")
        endGameMessage.textContent = "GAME OVER"
        endGameMessage.id = "endgamemessage"
        const congratsMessage = document.createElement("h2")
        congratsMessage.id = "congratsmessage"
        let winnerIndex
        for (let i = 0; i < game.playerList.length; i++) {
            if (game.playerList[i].playerID === winner) {
                winnerIndex = i
            }
        }
        congratsMessage.textContent = `Congratulations ${game.playerList[winnerIndex].name}`

        gameBoard.gameBoard.insertAdjacentElement("beforebegin", endGameMessage)
        gameBoard.gameBoard.insertAdjacentElement("beforebegin", congratsMessage)
        gameBoard.disable()
        gameBoard.reset()


    }

    function gameEnvironment() {
        
        let currentPlayer = "player1";
        gameBoard.gameBoard.style.cursor = "pointer"
        for (let i = 0; i < gamesquares.length; i++) {

            const squareID = gamesquares[i].id;
            gamesquares[i].addEventListener("mouseenter", function () {
                if (gamesquares[i].textContent.length < 1) {
                    gamesquares[i].style.backgroundColor = "#DAD2BC";
                }
            })
            gamesquares[i].addEventListener("mouseleave", function () {
                gamesquares[i].style.backgroundColor = "white";
            })


                gamesquares[i].addEventListener("click", function () {
                    if (gamesquares[i].textContent.length < 1) {
                        if (currentPlayer === "player1") {
                            gamesquares[i].style.color = game.playerList[0].color
                            gameBoard.add(squareID,"X")
                            if (checkWinCondition()) {
                                displayEndGame("player1")
                            }
                            currentPlayer = "player2"
        
                        } else {
                            gamesquares[i].style.color = game.playerList[1].color
                            gameBoard.add(squareID, "O");
                            if (checkWinCondition()) {
                                displayEndGame("player2")
                            }
                            currentPlayer = "player1"
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
const Player = (name, color, playerID) => {

    return {
        name,
        color,
        playerID
    }

}

// Player settings go here
const playerSetUp = (function playerSetUp() { 
    const submitButtons = document.getElementsByClassName("submitplayerbutton")

        for (let i = 0; i < submitButtons.length; i++) {
            const playerID = `player${i+1}`
            const currentDiv = document.getElementById(playerID)
            const button = document.getElementById(`submit${playerID}`)
            button.addEventListener("click", e => {

                const playerName = document.getElementById(`${playerID}name`).value 
                const playerColor = document.getElementById(`${playerID}shapecolor`).value
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
                <h4>${playerID.toUpperCase()}</h4>
                Name: ${playerName}<br>
                Symbol: <font color="${playerColor}">${playerSymbol}</font>
                `

                if (game.playerList[0].playerID === "player1" 
                && game.playerList[1].playerID === "player2") {
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

})()

