const minefield = document.getElementById("minefield");
const resetBtn = document.getElementById("reset-btn");
const numMines = document.getElementById("numMines");
const minesRemainingSpan = document.getElementById("minesRemaining-span");
const revealBtn = document.getElementById("reveal-btn");
const cursorBtn = document.getElementById("cursor-btn");

let activeCursor = cursorBtn.value;

let minesRemaining = 10;
let numOfSpotsClicked = 90;

cursorBtn.addEventListener("click", (e) => {
    const btn = e.target;
    console.log(btn);
    if (btn.value === "⬆"){
        btn.value = "❗️";
        btn.innerText = "❗️";
    }
    else{
        btn.value = "⬆";
        btn.innerText = "⬆";
    }
})



const assignSpotNumbers = () => {
    const spotList = document.querySelectorAll("#minefield button");
    spotList.forEach((spot) => {
        if(spot.classList.contains("mine")){
            spot.value = "💣";
        }
        else{
            spot.value = getNumOfSurroundingMines(spot);
        }
        
    });

}


resetBtn.addEventListener("click", () => {
    resetGame();
});
const resetGame = () => {
    minefield.innerHTML = "";
    placeSpots(100);
    placeMines();
    assignSpotNumbers();
    revealBtn.innerText = "Reveal";
}

const placeSpots = (num) => {
    for(let i=0; i < num; i++){
        const spot = document.createElement("button");
        spot.id = i+1;
        spot.innerText = "";
        spot.className = "spot";
        minefield.appendChild(spot);
        spot.addEventListener("click", () => revealSpot(spot));
        //spot.addEventListener("mouseover", () => spot.innerText = spot.id);
        //spot.addEventListener("mouseout", () => spot.innerText="");
        
    }
}
const revealSpot = (spot, times = 0) => {
    const listOfSpots = document.querySelectorAll("#minefield button.pressed");
    let pressedSpots = listOfSpots.length;
    if (cursorBtn.value === "⬆" && spot.classList.contains("mine")){
        if(pressedSpots > 0){
            spot.innerText = "💣"
            alert("BOOM!💥 Game Over!");
            return;
        }
        else{
            resetGame();
            revealSpot(spot.id);
            console.log("leaving");
            return;
        }
    }
    if (cursorBtn.value === "❗️"){
        if(spot.classList.contains("flag")){
            spot.classList.remove("flag");
            minesRemaining++;
            minesRemainingSpan.innerText = minesRemaining;
            return;
        }
        if(minesRemaining){
            spot.classList.add("flag");
            minesRemaining--;
            minesRemainingSpan.innerText = minesRemaining;
            return;
        }
        else{
            alert("No flags left to place!");
            return;
        }
        
    }
    if (spot.classList.contains("flag")){
        minesRemaining++;
        spot.classList.remove("flag");
        minesRemainingSpan.innerText = minesRemaining;
        return;
    }
    const surroundingSpots = getSurroundingSpots(spot);
    if (spot.value === "0"){
        spot.innerText = "";
        spot.classList.add("pressed");
        surroundingSpots.forEach((square) => {
            if (square.value === "0" && !(square.classList.contains("pressed"))){
                if (times < 5){
                    times++;
                    square.innerText = "";
                    square.classList.add("pressed");
                    revealSpot(square,times);
                }
            }
        })
        return;
    }

    spot.innerText = spot.value > 0 ? spot.value : "";
    spot.classList.add("pressed");
    checkGameOver();
}

const checkGameOver = () => {
    const listOfSpots = document.querySelectorAll("#minefield button.pressed");
    let pressedSpots = listOfSpots.length;
    //listOfSpots.forEach((spot) => {
    //    if(spot.classList.contains("pressed")){
    //        pressedSpots++;
    //    }
    //});
    console.log(pressedSpots);
    if(pressedSpots === 90){
        alert("You Win!");
        //resetGame();
    }
    
    
}



const revealAll = () => {
    const spotList = document.querySelectorAll("#minefield button");
    if (revealBtn.innerText === "Reveal"){
        spotList.forEach((spot) => {
            if(!(spot.classList.contains("pressed"))){
                spot.innerText = spot.value
            }
            
        });
        revealBtn.innerText = "Hide";
    }
    else{
        spotList.forEach((spot) => {
            if (!(spot.classList.contains("pressed"))){
                spot.innerText = "";
            }
        })
        revealBtn.innerText = "Reveal";
    }
    
}


//Maybe run on all buttons before game starts
//Then assign values but keep them hidden until they are clicked
//Then you can check if surroundingSpots are also a 0 and run it recursively.
const getNumOfSurroundingMines = (spot) => {
    console.log("Clicked: " + spot.id);
    const surroundingSpots = getSurroundingSpots(spot);

    let mineCount = 0;
    surroundingSpots.forEach((spot) => {
        if (spot.classList.contains("mine")){
            mineCount++;
        }
    })
    return mineCount;
}

const getSurroundingSpots = (spot) => {
    const spotList = document.querySelectorAll("#minefield button");
    let surroundingSpots = [];

    let index = spot.id - 10;
    
    let upperBound = Math.ceil(index /10) * 10;
    let lowerBound = upperBound - 9;
    let temp;

    for(let i = 0; i < 3; i++){
        temp = index - 1;
        const rules = [
            temp > 0,
            temp >= lowerBound,
            temp <= upperBound
        ];

        for(let j=0; j<3; j++){
            if ((spotList[temp-1]) && (temp <= upperBound && temp >= lowerBound)){
                if(spotList[temp-1] != spot){
                    surroundingSpots.push(spotList[temp-1]);
                }
            }
            temp++;
        }
        index+= 10;
        upperBound+= 10;
        lowerBound+= 10;
    }
    return surroundingSpots;
}

placeSpots(100);


const placeMines = () => {
    const listOfSpots = document.querySelectorAll("#minefield button");

    let minesToPlace = listOfSpots.length / 10;
    minesRemaining = minesToPlace;
    while (minesToPlace){
        const index = Math.floor(Math.random() * 100);
        const pos = listOfSpots[index];
        if (!(pos.classList.contains("mine"))){
            pos.classList.add("mine");
            minesToPlace--;
        }
    }
}

placeMines();
minesRemainingSpan.innerText = minesRemaining;

revealBtn.addEventListener("click", () => revealAll());
assignSpotNumbers();


