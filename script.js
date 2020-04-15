// Display and updating of boardstate go here
const gameBoard = (() => {
    let boardSetUp = ["A1", "A2", "A3", "B1", "B2", "B3", "C1", "C2", "C3"]
    let boardState = ["","","","","","","","",""]
    const gameBoard = document.getElementById("gameBoard");

    boardSetUp.forEach(square => {
        let newDiv = document.createElement("div")
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

    return {
        add,
        boardState,
        gameBoard
    }


})()

// Game event handlers go here
const game = (() => {
    const playerList = ["",""];
    const startGameButton = document.getElementById("startgame")
    const gamesquares = document.getElementsByClassName("gamesquare");
    startGameButton.addEventListener("click", setGameEnvironment)
    startGameButton.style.visibility = "hidden";


    function setGameEnvironment() {
        let currentPlayer = "player1";
        gameBoard.gameBoard.style.cursor = "pointer"
        for (let i = 0; i < gamesquares.length; i++) {
            

            const squareID = gamesquares[i].id;
            gamesquares[i].addEventListener("mouseenter", function () {
                gamesquares[i].style.backgroundColor = "#DAD2BC";
            })
            gamesquares[i].addEventListener("mouseleave", function () {
                gamesquares[i].style.backgroundColor = "white";
            })
            gamesquares[i].addEventListener("click", function () {
                if (currentPlayer === "player1") {
                    gamesquares[i].style.color = game.playerList[0].color
                    gameBoard.add(squareID,"X")
                    currentPlayer = "player2"

                } else {
                    gamesquares[i].style.color = game.playerList[1].color
                    gameBoard.add(squareID, "O");
                    currentPlayer = "player1"
                }  
            })
        }
    }



    return {
       playerList,
       startGameButton
    }
})()

// Player information goes here
const Player = (name, color, playerID) => {

    return {
        name,
        color,
        playerID
    }

}

// Player settings go here
var playerSetUp = (function playerSetUp() { 
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

