
const quizData = [
  {
    question: "What does 'let' declare in JavaScript?",
    options: ["A constant value", "A changeable variable", "A function", "An array"],
    correct: 1
  },
  {
    question: "Which is the strict equality operator?",
    options: ["==", "=", "===", "!="],
    correct: 2
  },
  {
    question: "What is the purpose of a for loop?",
    options: ["To repeat code a set number of times", "To declare variables", "To handle events", "To style elements"],
    correct: 0
  },
  {
    question: "How do you select an element by ID in the DOM?",
    options: ["querySelector", "getElementById", "createElement", "appendChild"],
    correct: 1
  },
  {
    question: "The following are JavaScript Basics, which of them is NOT included?",
    options: ["Reads like English commands", "Case Sensitive Let ≠ let", "Commands end with ;", "Reads Indentation"],
    correct: 3
  },
  {
    question: "Which of the following is NOT a valid JavaScript data type?",
    options: ["String", "Number", "Character", "Boolean"],
    correct: 2
  }
];


let currentQuestion = 0;
let score = 0;
let totalQuestions = quizData.length;
let selectedAnswer = -1;
let timerInterval;
let timeLeft = 20;
let highScore = localStorage.getItem("jsQuizHighScore") || 0;


function shuffleQuestions() {
  quizData.sort(() => Math.random() - 0.5);
}


function updateProgress() {
  const progress = ((currentQuestion + 1) / totalQuestions) * 100;
  document.getElementById("progress-fill").style.width = progress + "%";
  document.getElementById("current-q").textContent = currentQuestion + 1;
  document.getElementById("total-q").textContent = totalQuestions;
}


function startTimer() {
  timeLeft = 20;
  document.getElementById("timer-container").style.display = "block";
  document.getElementById("timer-text").textContent = timeLeft;
  document.getElementById("timer-fill").style.width = "100%";

  timerInterval = setInterval(() => {
    timeLeft--;
    document.getElementById("timer-text").textContent = timeLeft;
    document.getElementById("timer-fill").style.width = (timeLeft / 20) * 100 + "%";
    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      selectedAnswer = -1;
      nextQuestion();
    }
  }, 1000);
}

function stopTimer() {
  if (timerInterval) clearInterval(timerInterval);
  document.getElementById("timer-container").style.display = "none";
}


let optionButtons = [];
let focusedIndex = 0;

document.addEventListener("keydown", (e) => {
  if (!optionButtons.length) return;

  if (e.key === "ArrowDown") {
    focusedIndex = (focusedIndex + 1) % optionButtons.length;
    optionButtons[focusedIndex].focus();
  } else if (e.key === "ArrowUp") {
    focusedIndex = (focusedIndex - 1 + optionButtons.length) % optionButtons.length;
    optionButtons[focusedIndex].focus();
  } else if (e.key === "Enter") {
    optionButtons[focusedIndex].click();
  }
});


function loadQuestion() {
  const q = quizData[currentQuestion];
  document.getElementById("question").textContent = q.question;

  const optionsDiv = document.getElementById("options");
  optionsDiv.innerHTML = "";

  q.options.forEach((option, index) => {
    const btn = document.createElement("button");
    btn.textContent = option;
    btn.classList.add("option");
    btn.setAttribute("tabindex", "0"); 
    btn.onclick = () => selectOption(index);
    optionsDiv.appendChild(btn);
  });

  optionButtons = Array.from(document.querySelectorAll(".option"));
  focusedIndex = 0;
  optionButtons[0].focus();

  document.getElementById("next-btn").style.display = "none";
  updateProgress();
  startTimer();
}


function selectOption(index) {
  if (selectedAnswer !== -1) return;
  selectedAnswer = index;
  stopTimer();

  const options = document.querySelectorAll(".option");
  const correctIndex = quizData[currentQuestion].correct;

  options.forEach((btn, i) => {
    btn.disabled = true;
    if (i === correctIndex) btn.classList.add("correct");
    else if (i === index) btn.classList.add("incorrect");
  });

  document.getElementById("next-btn").style.display = "block";
}


function nextQuestion() {
  if (selectedAnswer === quizData[currentQuestion].correct) score++;

  currentQuestion++;
  selectedAnswer = -1;

  if (currentQuestion < totalQuestions) loadQuestion();
  else showScore();
}


function showScore() {
  stopTimer();
  document.getElementById("question-container").style.display = "none";
  document.getElementById("score-container").style.display = "block";

  const percent = Math.round((score / totalQuestions) * 100);
  document.getElementById("score-circle-text").textContent = score;
  document.getElementById("total-score").textContent = totalQuestions;

  let feedback = "";
  if (percent >= 80) feedback = "Outstanding! You're a JavaScript Pro Max. 🌟";
  else if (percent >= 60) feedback = "Almost There! Keep practicing those concepts. 👍";
  else feedback = "Keep Up — Progress is a Step-by-Step Process! 📚";
  document.getElementById("feedback").textContent = feedback;

  if (score > highScore) {
    highScore = score;
    localStorage.setItem("jsQuizHighScore", highScore);
  }
  document.getElementById("high-score-val").textContent = highScore;
}

function restartQuiz() {
  score = 0;
  currentQuestion = 0;
  selectedAnswer = -1;
  shuffleQuestions(); 
  document.getElementById("question-container").style.display = "block";
  document.getElementById("score-container").style.display = "none";
  loadQuestion();
}

document.addEventListener("DOMContentLoaded", () => {
  shuffleQuestions();
  loadQuestion();
});
