

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
                newDiv.className = "playerInfoClass";
                newDiv.innerHTML = `
                <h4>${displayID}</h4>
                ${playerName}<br>
                <font color="${playerColor}">${playerSymbol}</font>
                `

                if (game.playerList[0].playerID === "player1" 
                && game.playerList[1].playerID) {
                    game.startGameButton.style.display = "inherit"
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

