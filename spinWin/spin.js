document.addEventListener('DOMContentLoaded', async () => {
    const canvas = document.getElementById('wheel');
    const ctx = canvas.getContext('2d');
    const spinButton = document.getElementById('spin-button');
    const redeemBtn = document.getElementById('redeemBtn')
    
    const spinRedeemBtnWrappper = document.getElementById('spinRedeemBtn');
   
    const modal = document.getElementById('result-modal');
    const resultText = document.getElementById('result-text');
    const spinRedeemButton = document.getElementById('spinRedeemBtn')
    const spinButtonWrapper = document.getElementById('spinButtons')

    const exploreRewardsBtn = document.getElementById('exploreRewardsBtn')
    
    const buttonDone = document.getElementById('button-done');
    // const closeButton = document.querySelector('.close-button');

    // To get URL parameters
    function getUrlParams() {
        const params = new URLSearchParams(window.location.search);
        return {
            lang: params.get('lang'),
            phone: params.get('phone'),
            device: params.get('device')
        };
    }

    // check user device android / iphone/ web
    function detectDevice() {
        let screenSize = screen.availHeight
        let userAgent = navigator.userAgent || navigator.vendor || window.opera;
      
        // iOS detection
        if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
          return "iOS";
        }
      
        // Android detection
        if (/android/i.test(userAgent)) {
          return "Android";
        }
      
        // Other devices (like desktops)
        return "Desktop";
      }

      const device = detectDevice();

      document.getElementById('detectDeviceName').innerHTML = device;

    // Check if required URL parameters are present
    const urlParams = getUrlParams();
    if (!urlParams.lang || !urlParams.phone || !urlParams.device) {
        // alert("Missing required URL parameters");
        resultText.textContent = "Missing required URL parameters. Please provide lang, phone, and device.";
        resultText.style.height = "auto";
        document.getElementById('spinGameGrid').style.display = "none";
        document.getElementById('result-modal-img').style.display = 'none'; // Show the modal
        document.getElementById('result-points').style.display = 'none'; // Show the modal
        modal.style.display = 'flex'; // Show the modal
        return;
    }

    // Load configuration from JSON file
    const response = await fetch('../config.json');
    const config = await response.json();

    // console.log("configconfig", config);
    // console.log("getUrlParams", urlParams);

    document.body.style.background = config.backgroundColor;
     
    document.getElementById("spinWheelImage").src="../assets/images/spinWheel.svg";


    function drawWheel() {
        const slices = config.spinWheelprizes.length;
        const sliceAngle = 2 * Math.PI / slices;

        for (let i = 0; i < slices; i++) {
            const angle = i * sliceAngle;
            ctx.beginPath();
            ctx.moveTo(canvas.width / 2, canvas.height / 2);
            ctx.arc(canvas.width / 2, canvas.height / 2, canvas.width / 2, angle, angle + sliceAngle);
            ctx.closePath();
            ctx.fillStyle = config.spinWheelColors[i];
            ctx.fill();

            ctx.save();
            ctx.translate(canvas.width / 2, canvas.height / 2);
            ctx.rotate(angle + sliceAngle / 2);
            ctx.textAlign = "right";
            ctx.fillStyle = "#FFF";
            ctx.font = config.font;
            ctx.fillText(config.spinWheelprizes[i], canvas.width / 2 - 10, 10);
            ctx.restore();
        }
    }

    function spinWheel() {
        const totalSpins = 5; // Total spins the wheel will make
        const spinDuration = 300; // Spin duration in ms
        const startTime = Date.now();

        function rotateWheel() {
            const elapsedTime = Date.now() - startTime;
            const progress = elapsedTime / spinDuration;
            const angle = progress * totalSpins * 2 * Math.PI;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.save();
            ctx.translate(canvas.width / 2, canvas.height / 2);
            ctx.rotate(angle);
            ctx.translate(-canvas.width / 2, -canvas.height / 2);
            drawWheel();
            ctx.restore();

            if (progress < 1) {
                requestAnimationFrame(rotateWheel);
            } else {
                const finalAngle = angle % (2 * Math.PI);
                const sliceAngle = 2 * Math.PI / config.spinWheelprizes.length;
                const winningIndex = Math.floor((2 * Math.PI - finalAngle) / sliceAngle) % config.spinWheelprizes.length;
                // resultText.textContent = `Congratulations! You won ${config.spinWheelprizes[winningIndex]}!`;
                resultText.textContent = `Congratulations`;
                modal.style.display = 'flex'; // Show the modal
                spinRedeemButton.style.display = 'block'; // Show the redeem button
                spinButtonWrapper.style.display = 'none'; // hide spin button
            }
        }

        requestAnimationFrame(rotateWheel);
    }

    drawWheel();

    // spinButton.addEventListener('click', spinWheel);
    spinButton.addEventListener('click', spinNowClick);
    redeemBtn.addEventListener('click', handleRedeemButtonClick);
    buttonDone.addEventListener('click', buttonDoneClick);
    exploreRewardsBtn.addEventListener('click', gotToRewards);

    function handleRedeemButtonClick() {
        modal.style.display = 'none';
        spinRedeemBtnWrappper.style.display = 'none';
        spinRedeemBtnWrappper.style.display = 'none';
        spinButtonWrapper.style.display = 'block'; // show spin button
        
    }

    var spinTimer;
    function spinNowClick() {
        window.clearTimeout(spinTimer);
        document.getElementById("spinWheelImage").classList.add("active");
        spinButtonWrapper.style.display = 'none';

        timer = window.setTimeout(function(){
            // alert('Hello!');
            document.getElementById("spinWheelImage").classList.remove("active");
            document.getElementById('spinGameGrid').style.display = "none";
            document.getElementById('gameSucceesFailPanel').style.display = "grid";
            // resultText.textContent = `Congratulations`;
            // modal.style.display = 'flex'; // Show the modal
            // spinRedeemButton.style.display = 'block'; // Show the redeem button
            // spinButtonWrapper.style.display = 'none'; // hide spin button
            showConfitteAnimation();
        }, 200);         
    }

    function showConfitteAnimation() {
        const animationContainer = document.getElementById('animationContainer');

        // Load and play the Lottie animation
        lottie.loadAnimation({
            container: animationContainer, // the DOM element where the animation will be rendered
            renderer: 'svg', // the rendering mode (svg/canvas/html)
            loop: false, // whether the animation should loop
            autoplay: true, // whether the animation should start automatically
            path: '../assets/lottieAnimation.json' // the path to the animation JSON file
        });
    }

    function buttonDoneClick(){
        window.location.href = '../home/home.html';
    }

    function gotToRewards() {
        window.location.href = '../rewards/reward.html';
    }

    // Close the modal when the close button is clicked
    // closeButton.addEventListener('click', () => {
    //     modal.style.display = 'none';
    // });

    // Close the modal when clicking outside of it
    // window.addEventListener('click', (event) => {
    //     if (event.target == modal) {
    //         modal.style.display = 'none';
    //     }
    // });


    


});
