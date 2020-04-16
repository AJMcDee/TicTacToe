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

    boardSetUp.forEach(square => {
        const newDiv = document.createElement("div")
        newDiv.id = `${square}`
        newDiv.className = "gamesquare"
        newDiv.innerHTML = ""
        gameBoard.appendChild(newDiv)
    });

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

    return {
        add,
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
            item.forEach(index => {
                if (gameBoard.boardState[index].length > 0 && 
                    gameBoard.boardState[index] === gameBoard.boardState[item[0]]) {
                    boxCount += 1;
                }
                if (boxCount === 3) {
                    gameOver = true;
                }
            })
        })

        return gameOver


    }

    function displayEndGame() {
        const endGameMessage = document.createElement("h1")
        endGameMessage.textContent = "GAME OVER"
        gameBoard.gameBoard.insertAdjacentElement("beforebegin", endGameMessage)
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
                                displayEndGame()
                            }
                            currentPlayer = "player2"
        
                        } else {
                            gamesquares[i].style.color = game.playerList[1].color
                            gameBoard.add(squareID, "O");
                            if (checkWinCondition()) {
                                displayEndGame()
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

