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

    const startGameButton = document.getElementById("startgame")
    startGameButton.addEventListener("click", function() {
        gameBoard.gameBoard.style.cursor = "pointer"
        runGame();
    })
    const gamesquares = document.getElementsByClassName("gamesquare");
    function runGame() {
        for (let i = 0; i < gamesquares.length; i++) {
            gamesquares[i].addEventListener("mouseenter", function () {
                gamesquares[i].style.backgroundColor = "white";
            })
            gamesquares[i].addEventListener("mouseleave", function () {
                gamesquares[i].style.backgroundColor = "aquamarine";
            })
        }



    }




    return {

    }
})()


// Player information goes here
const Player = (name) => {
    const add = (name) => {
        
    }
    
    return {
        add,
    }
}

// Player settings go here



