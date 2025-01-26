// Existing game code
const gameContainer = document.getElementById("game-container");
const basket = document.getElementById("basket");
const scoreDisplay = document.getElementById("score");
const timerDisplay = document.getElementById("timer");

const supportButton = document.getElementById("support-button");
const supportWindow = document.getElementById("support-window");
const closeSupportButton = document.getElementById("close-support");

let score = 0;
let timeLeft = 30;
let gameInterval;
let objectInterval;
let gamePaused = false;

// Move basket with the mouse
gameContainer.addEventListener("mousemove", (e) => {
  const containerRect = gameContainer.getBoundingClientRect();
  const mouseX = e.clientX - containerRect.left;
  const basketWidth = basket.offsetWidth;

  // Center the basket on the cursor
  let newLeft = mouseX - basketWidth / 8;
  if (newLeft < 0) newLeft = 0;
  if (newLeft + basketWidth > containerRect.width) newLeft = containerRect.width - basketWidth;

  basket.style.left = newLeft + "px";
});

// Generate falling objects (stars, asteroids, and red balls)
function createFallingObject() {
  if (gamePaused) return; // Stop object generation if the game is paused

  const randomValue = Math.random();
  let objectType;

  if (randomValue < 0.6) {
    objectType = "star"; // 60% chance
  } else if (randomValue < 0.9) {
    objectType = "asteroid"; // 30% chance
  } else {
    objectType = "red-ball"; // 10% chance
  }

  const object = document.createElement("div");
  object.classList.add(objectType);
  object.style.left = Math.random() * (gameContainer.offsetWidth - 30) + "px";
  object.style.top = "0px"; // Start at the top
  gameContainer.appendChild(object);

  let objectFall = setInterval(() => {
    if (gamePaused) return; // Stop objects from moving if the game is paused

    const objectRect = object.getBoundingClientRect();
    const basketRect = basket.getBoundingClientRect();

    // Check for collision with the basket
    if (
      objectRect.bottom >= basketRect.top &&
      objectRect.left < basketRect.right &&
      objectRect.right > basketRect.left
    ) {
      if (objectType === "star") {
        score++;
      } else if (objectType === "asteroid") {
        score = Math.max(0, score - 2); // Deduct 2 points, but don't go below 0
      } else if (objectType === "red-ball") {
        timeLeft += 5; // Add 5 seconds to the timer
      }

      scoreDisplay.textContent = `Score: ${score}`;
      timerDisplay.textContent = `Time: ${timeLeft}`;
      object.remove();
      clearInterval(objectFall);
    }

    // Remove the object if it goes off the bottom of the screen
    if (objectRect.top > gameContainer.offsetHeight) {
      object.remove();
      clearInterval(objectFall);
    } else {
      // Move the object down faster
      object.style.top = (object.offsetTop + 7) + "px";
    }
  }, 30);
}

// Start game timer and object generation
function startGame() {
  gameInterval = setInterval(() => {
    if (!gamePaused) {
      timeLeft--;
      timerDisplay.textContent = `Time: ${timeLeft}`;
      if (timeLeft <= 0) {
        clearInterval(gameInterval);
        clearInterval(objectInterval);
        alert(`Game Over! Your Score: ${score}`);
        window.location.reload();
      }
    }
  }, 1000);

  objectInterval = setInterval(createFallingObject, 500);
}

// Support button functionality
supportButton.addEventListener("click", () => {
  supportWindow.style.display = "flex";
  gamePaused = true;
});

closeSupportButton.addEventListener("click", () => {
  supportWindow.style.display = "none";
  gamePaused = false;
});

// Initialize the game
basket.style.left = "50%"; // Center the basket initially
startGame();
