// questions
const quizData = [
  {
    question: "What nickname besides ''Mia'' does Mia go by most at home?",
    options: ["Amelia", "Amy", "Mimi", "Pao"],
    answer: "Pao"
  },
  {
    question: "What sport did Mia play before?",
    options: ["Soccer/Football", "Badminton", "Volleyball", "Pickleball"] ,
    answer: "Soccer/Football"
  },
  {
    question: "For about how many years did Mia play the sport in the previous question?",
    options: ["2 years", "3 years", "4 years", "5 years"],
    answer: "3 years"
  },
  {
    question: "What is Mia's favorite tea?",
    options: ["Oolong", "Chrysanthemum", "Barley,", "Earl Grey"],
    answer: "Chrysanthemum"
  },
  {
    question: "What country does Mia want to travel to the most in the future?",
    options: ["Japan", "Korea", "Europe", "Somalia"],
    answer: "Japan"
  }
];

let currentQuestion = 0;
let score = 0;
let timeLeft = 20;
let timerInterval;
const timerEl = document.getElementById('time');
const questionEl = document.querySelector('.question');
const optionsEl = document.querySelector('.options');
const resultEl = document.querySelector('.result');
const scoreEl = document.getElementById('score');
const restartBtn = document.querySelector('.restart-btn');
let startedAt = new Date();

function readJSON(key, fallback){
  const raw = localStorage.getItem(key);
  if (!raw) return fallback;
  try {return JSON.parse(raw);}
  catch(e){
    console.warn("Bad JSON in localStorage for key:", key, e);
    return fallback;
  }
}

function writeJSON(key, value){
  localStorage.setItem(key, JSON.stringify(value));
}

function getAttempts(){
  return readJSON("quizAttempts", []);
}

function addAttempt(attempt){
  const attempts = getAttempts();
  attempts.push(attempt);

  const trimmed = attempts.slice(-10);

  writeJSON("quizAttempts", trimmed)
}



// display questions
function showQuestion(){
  if (currentQuestion === 0 && timeLeft === 20){
    startedAt = new Date();
  }
  if (currentQuestion >= quizData.length){
    endQuiz();
    return;
  }
  clearInterval(timerInterval);
  timeLeft = 20;
  timerEl.textContent = timeLeft;
  startTimer();
  const currentQuiz = quizData[currentQuestion];
  questionEl.textContent = currentQuiz.question;
  optionsEl.innerHTML = ' ';
  currentQuiz.options.forEach (option =>{
    const button = document.createElement('button');
    button.classList.add('option');
    button.textContent = option;
    button.onclick = () => checkAnswer(option);
    optionsEl.appendChild(button);
  });
}

// check answers
function checkAnswer(selectedOption){
  if (selectedOption === quizData[currentQuestion].answer){
    score++;
  }
  currentQuestion++;
  showQuestion();
}

// timer
function startTimer(){
  timerInterval = setInterval (() => {
    timeLeft--;
    timerEl.textContent = timeLeft;
    if (timeLeft <= 0){
      clearInterval(timerInterval);
      endQuiz();
    }
  }, 1000);
}

function endQuiz(){
  clearInterval(timerInterval);
  questionEl.style.display = 'none';
  optionsEl.style.display = 'none';
  resultEl.style.display = 'block';
  scoreEl.textContent = score;
  restartBtn.style.display = 'block';

  const endedAt = new Date();
  const secondsUsed = Math.round((endedAt - startedAt) / 1000);

const user = readJSON("quizUser", null);

const attempt = {
  dateISO: endedAt.toISOString(),
  score: score,
  total: quizData.length,
  secondsUsed: secondsUsed,
  username: user ? user.name : "Guest",
  email: user ? user.email : "Unknown",
  quizId: "mia_quiz"   // <-- unique ID for this quiz/student
};

addAttempt(attempt);

}


restartBtn.addEventListener('click', () => {
  // reset data
  currentQuestion = 0;
  score = 0;
  timeLeft = 20;
  timerEl.textContent = timeLeft;
    
  // reset display
  questionEl.style.display = 'block';
  optionsEl.style.display = 'flex';
  resultEl.style.display = 'none';
  restartBtn.style.display = 'none';
  
  showQuestion();
  
  
  
});

showQuestion();




