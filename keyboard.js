// Quiz Game v1.0.1 - Keyboard Controls
(function () {
  function activeScreen() {
    const screen = document.querySelector(".screen.active");
    return screen ? screen.id : "";
  }

  document.addEventListener("keydown", function (event) {
    const key = event.key;
    const screen = activeScreen();

    if (screen === "quizScreen" && /^[1-4]$/.test(key)) {
      const buttons = Array.from(document.querySelectorAll("#answers .answer-btn:not(:disabled)"));
      const button = buttons[Number(key) - 1];
      if (button) {
        event.preventDefault();
        button.click();
      }
      return;
    }

    if (key === "Escape") {
      const closeButtons = {
        shopScreen: "#closeShopBtn",
        profileScreen: "#closeProfileBtn",
        leaderboardScreen: "#closeLeaderboardBtn"
      };
      const selector = closeButtons[screen];
      if (selector) {
        const button = document.querySelector(selector);
        if (button) button.click();
      }
      return;
    }

    if (key === "Enter" && (screen === "homeScreen" || screen === "resultScreen")) {
      const selector = screen === "homeScreen" ? "#startBtn" : "#playAgainBtn";
      const button = document.querySelector(selector);
      if (button) button.click();
    }
  });
})();
