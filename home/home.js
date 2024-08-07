
let listGames = [];
async function renderGameNames() {
    
    let gameResponse = await fetch('./gamesDummyRespn.json');
    let gameResponseJSON = await gameResponse.json();
    
    console.log("gameResponseJSON", gameResponseJSON);
    listGames = gameResponseJSON.responseDetail.games;
    const gameListDiv = document.getElementById('game-list');
    let htmlContent = '';
    
    listGames.forEach(game => {
    //   const gameName = game.displayDetails.name;
    //   const gameElement = document.createElement('p');
    //   gameElement.textContent = gameName;
    //   gameListDiv.appendChild(gameElement);

    const imageURL = game.displayDetails.imageList.find(image => image.idtype === "ImageMedium").name;
        console.log("imageURL", imageURL);
    htmlContent += `
        <div class="game" onclick="handleGameClick('${game.gameId}')">
            <img src=${imageURL} width="128" height="146">
            <p class="gameName">${game.displayDetails.name}</p>
        </div>
    `;
    gameListDiv.innerHTML = htmlContent;    
    });
    
}

    function handleGameClick(gameId) {
        const game = listGames.find(g => g.gameId === gameId);
        console.log("Game Data:", game);

        switch (game.gameType) {
            case 'SpinNWin':
                window.location.href = '../spinWin/spinWin.html?lang=en&phone=9876543210&device=android';
                break;
            case 'ShakeNWin':
                window.location.href = '../shaekWin/shakeWin.html';
                break;
            default:
                console.log("Unknown game type:", game.gameType);
        }
    }


    function renderTabs(tabName, tabId) {
        console.log(tabName)

        let homeViews = document.getElementsByClassName("homeViewContainer");
        for (let i = 0; i < homeViews.length; i++) {
            homeViews[i].style.display = "none";
        }
        document.getElementById(tabId).style.display = "block";
        
        let tabs = document.getElementsByClassName("gameTab");
        for (let i = 0; i < tabs.length; i++) {
            tabs[i].classList.remove("active");
        }
        
        let clickedTab = event.currentTarget; // Use event.currentTarget to get the clicked element
        clickedTab.classList.add("active");

         
    }

renderGameNames();