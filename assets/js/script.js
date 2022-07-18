//store question text, options and answers in an array
const questions = [
    {
      questionText: "Commonly used data types DO NOT include:",
      options: ["1. strings", "2. booleans", "3. alerts", "4. numbers"],
      answer: "3. alerts",
    },
    {
      questionText: "Arrays in JavaScript can be used to store ______.",
      options: [
        "1. numbers and strings",
        "2. other arrays",
        "3. booleans",
        "4. all of the above",
      ],
      answer: "4. all of the above",
    },
    {
      questionText:
        "String values must be enclosed within _____ when being assigned to variables.",
      options: ["1. commas", "2. curly brackets", "3. quotes", "4. parentheses"],
      answer: "3. quotes",
    },
    {
      questionText:
        "A very useful tool used during development and debugging for printing content to the debugger is:",
      options: [
        "1. JavaScript",
        "2. terminal/bash",
        "3. for loops",
        "4. console.log",
      ],
      answer: "4. console.log",
    },
    {
      questionText:
        "Which of the following is a statement that can be used to terminate a loop, switch or label statement?",
      options: ["1. break", "2. stop", "3. halt", "4. exit"],
      answer: "1. break",
    },
];

//select each card div by id and assign to variables
const startCard = document.getElementById("start-card");
const questionCard = document.getElementById("question-card");
const scoreCard = document.getElementById("score-card");
const leaderboardCard = document.getElementById("leaderboard-card");

  //hide all cards
  function hideCards() {
    startCard.style.display = "none";
    questionCard.setAttribute("hidden", true);
    scoreCard.setAttribute("hidden", true);
    leaderboardCard.setAttribute("hidden", true);
  }
  
  const resultDiv = document.getElementById("result-div");
  const resultText = document.getElementById("result-text");
  
  //hide result div
  function hideResultText() {
    resultDiv.style.display = "none";
  }
  
  //these variables are required globally
  var intervalID;
  var time;
  var currentQuestion;
  
  document.getElementById("start-button").addEventListener("click", startQuiz);
  
  function startQuiz() {
    //hide any visible cards, show the question card
    hideCards();
    questionCard.removeAttribute("hidden");
    
    //assign 0 to current Question when start button is clicked
    currentQuestion = 0;
    displayQuestion();
  
    //set total time depending on number of questions
    time = questions.length * 10;
  
    //function "countdown" every 1000ms to update time and display on page
    intervalID = setInterval(countdown, 1000);
  
    //time appears on the page as soon as the start button is clicked
    displayTime();
  }
  
  //reduce time by 1 and display new value, if time runs out then end quiz
  function countdown() {
    time--;
    displayTime();
    if (time < 1) {
      endQuiz();
    }
  }
  
  //display time on page
  const timeDisplay = document.getElementById("time");
  function displayTime() {
    timeDisplay.textContent = time;
  }
  
  //display the question and answer options
  function displayQuestion() {
    var question = questions[currentQuestion];
    var options = question.options;
  
    var h2QuestionElement = document.getElementById("question-text");
    h2QuestionElement.textContent = question.questionText;
  
    for (var i = 0; i < options.length; i++) {
      var option = options[i];
      var optionButton = document.getElementById("option" + i);
      optionButton.textContent = option;
    }
  }
  
  //Compare the text content of the option button with the answer to the current question
  document.getElementById("quiz-options").addEventListener("click", checkAnswer);
  function optionIsCorrect(optionButton) {
    return optionButton.textContent === questions[currentQuestion].answer;
  }
  
  //if answer is incorrect
  function checkAnswer(eventObject) {
    var optionButton = eventObject.target;
    resultDiv.style.display = "block";
    if (optionIsCorrect(optionButton)) {
      resultText.textContent = "Correct!";
      setTimeout(hideResultText, 1000);
    } else {
      resultText.textContent = "Incorrect!";
      setTimeout(hideResultText, 1000);
      if (time >= 10) {
        time = time - 10;
        displayTime();
      } else {
        //if time is less than 10, display time as 0 and end quiz
        time = 0;
        displayTime();
        endQuiz();
      }
    }
  
    //increment current question by 1
    currentQuestion++;
    //if we have not run out of questions then display next question, else end quiz
    if (currentQuestion < questions.length) {
      displayQuestion();
    } else {
      endQuiz();
    }
  }
  
  //display scorecard and hide other divs
  const score = document.getElementById("score");
  
  //at end of quiz, clear the timer, hide any visible cards and display the scorecard and display the score as the remaining time
  function endQuiz() {
    clearInterval(intervalID);
    hideCards();
    scoreCard.removeAttribute("hidden");
    score.textContent = time;
  }
  
  const submitButton = document.getElementById("submit-button");
  const inputElement = document.getElementById("initials");
  
  //store user initials and score when submit button is clicked
  submitButton.addEventListener("click", storeScore);
  
  function storeScore(event) {
    event.preventDefault();
    //check for input
    if (!inputElement.value) {
      alert("Please enter your initials before pressing submit!");
      return;
    }
  
    //store score and initials in an object
    var leaderboardItem = {
      initials: inputElement.value,
      score: time,
    };
  
    updateStoredLeaderboard(leaderboardItem);
  
    //hide the question card, display the leaderboardcard
    hideCards();
    leaderboardCard.removeAttribute("hidden");
  
    renderLeaderboard();
  }
  
  //updates the leaderboard stored in local storage
  function updateStoredLeaderboard(leaderboardItem) {
    var leaderboardArray = getLeaderboard();
    //append new leaderboard item to leaderboard array
    leaderboardArray.push(leaderboardItem);
    localStorage.setItem("leaderboardArray", JSON.stringify(leaderboardArray));
  }
  
  //get "leaderboardArray" from local storage
  function getLeaderboard() {
    var storedLeaderboard = localStorage.getItem("leaderboardArray");
    if (storedLeaderboard !== null) {
      var leaderboardArray = JSON.parse(storedLeaderboard);
      return leaderboardArray;
    } else {
      leaderboardArray = [];
    }
    return leaderboardArray;
  }
  
  //display leaderboard on leaderboard card
  function renderLeaderboard() {
    var sortedLeaderboardArray = sortLeaderboard();
    const highscoreList = document.getElementById("highscore-list");
    highscoreList.innerHTML = "";
    for (var i = 0; i < sortedLeaderboardArray.length; i++) {
      var leaderboardEntry = sortedLeaderboardArray[i];
      var newListItem = document.createElement("li");
      newListItem.textContent =
        leaderboardEntry.initials + " - " + leaderboardEntry.score;
      highscoreList.append(newListItem);
    }
  }
  
  //sort leaderboard array from highest to lowest
  function sortLeaderboard() {
    var leaderboardArray = getLeaderboard();
    if (!leaderboardArray) {
      return;
    }
  
    leaderboardArray.sort(function (a, b) {
      return b.score - a.score;
    });
    return leaderboardArray;
  }
  
  const clearButton = document.getElementById("clear-button");
  clearButton.addEventListener("click", clearHighscores);
  
  //clear local storage and display empty leaderboard
  function clearHighscores() {
    localStorage.clear();
    renderLeaderboard();
  }
  
  const backButton1 = document.getElementById("back-button1");
  backButton1.addEventListener("click", returnToStart);
  
  //Hide leaderboard card show start card
  function returnToStart() {
    hideCards();
    startCard.style.display = null;
  }

  const backButton2 = document.getElementById("back-button2");
  backButton2.addEventListener("click", returnToStart);
  
  //Hide leaderboard card show start card
  function returnToStart() {
    hideCards();
    startCard.style.display = null;
  }
  
  //use link to view highscores from any point on the page
  const leaderboardLink = document.getElementById("leaderboard-link");
  leaderboardLink.addEventListener("click", showLeaderboard);
  
  function showLeaderboard() {
    hideCards();
    leaderboardCard.removeAttribute("hidden");
  
    //stop countdown
    clearInterval(intervalID);
    time = undefined;
    displayTime();
    renderLeaderboard();
  }