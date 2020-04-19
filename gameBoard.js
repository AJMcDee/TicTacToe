
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
        gameSquare.innerHTML = `<span class="fade-in">${shape}</span>`;
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