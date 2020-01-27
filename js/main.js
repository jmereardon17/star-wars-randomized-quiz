const main = document.querySelector('main');
const overlay = document.getElementById('overlay');
const title = document.querySelector('h1');
const tagline = document.querySelector('.tagline');
const startButton = document.getElementById('startBtn');
const blueSaber = document.querySelector('.blue');
const redSaber = document.querySelector('.red');
const question = document.getElementById('question');
const questionTip = document.getElementById('questionTip');
const questionNumber = document.getElementById('number');
const choicesDiv = document.getElementById('choices');
const form = document.querySelector('form');
const submit = document.getElementById('submit');
const answerIndicator = document.getElementById('answerIndicator');
let index = 0;
let questionCount = 1;
let correct = 0;

// =================================================
//  HELPER FUNCTIONS
// ================================================

const randomizeArray = arr => {
  return arr.sort(() => Math.random() - 0.5);
}

const displayQuestion = (arr, index) => {
  if (index < arr.length) { 
    $(question).fadeOut(1000, () => {
      const currentQuestion = arr[index].question;
      questionNumber.textContent = `${questionCount} of ${arr.length}`;
      question.textContent = currentQuestion;
      questionCount += 1;
    });
    $(question).delay(600).fadeIn(1000);
    displayChoices(arr, index);
  } else {
    checkResult();
  }
}

const displayChoices = (arr, index) => {
  randomizeArray(arr[index].choices);
  arr[index].choices.forEach(choice => {
    const radioButton = document.createElement('input');
    radioButton.type = 'radio';
    radioButton.name = 'response';
    radioButton.value = choice;
    radioButton.id = choice;
    radioButton.classList.add('btn', 'choice');
    choicesDiv.appendChild(radioButton);
    const label = document.createElement('label');
    label.setAttribute('for', choice);
    label.textContent = choice;
    if (choice.length > 14) {
      label.style = 'font-size: 14.5px; line-height: 1.7;';
    }
    choicesDiv.appendChild(label);
    label.style.opacity = 0;
  });
  $(choicesDiv).delay(500).fadeIn(1000);
  const choiceLabels = document.querySelectorAll('label');
  let delay = 2000;
  choiceLabels.forEach(element => {
    $(element).delay(delay).queue(function() {
      element.style.opacity = 1;
    });
    delay += 800;
  });
  $(submit).delay(5000).fadeIn(1000);
}

const showResponseTip = response => {
  $(submit).fadeOut();
  $(answerIndicator).delay(100).fadeIn(function() {
    if (response === 'correct') {
      $(this).html(`<i class="fas fa-check"></i>`);
    } else if (response === 'incorrect') {
      $(this).html(`<i class="fas fa-times"></i>`);
    }   
  });
  $(answerIndicator).delay(400).fadeOut(500, function() {
    $(this).html(``);
  });
}

const checkResponse = (response, answer) => {
  if (response === answer) {
    correct += 1;
    showResponseTip('correct');
  } else {
    showResponseTip('incorrect');
  }
}

const showResultScreen = result => {
  if (result === 'won') {
    overlay.className = 'win';
    title.textContent = 'Jedi Master you are!';
  } else if (result === 'lost') {
    overlay.className = 'lose';
    title.textContent = 'Padawan still you are!';
  }
  tagline.style.display = 'none';
  startButton.textContent = 'Play Again';
  $(overlay).delay(300).fadeIn(1500);
}

const checkResult = () => {
  $(questionTip, choicesDiv, submit).toggle();
  if (correct === quiz.length) {
    showResultScreen('won');
  } else {
    showResultScreen('lost');
  }
}

const resetGame = () => {
  $(question).hide();
  index = 0;
  questionCount = 1;
  correct = 0;
  $(questionTip, choicesDiv, submit).toggle();
  randomizeArray(quiz);
  displayQuestion(quiz, index);
  $(overlay).fadeOut(1500);
}

randomizeArray(quiz);
$(submit).hide();

// =================================================
//  EVENT LISTENERS
// ================================================

main.addEventListener('click', e => {
  if (e.target.tagName === 'BUTTON') {
    let button = e.target;
    if (button.textContent === 'Play') {
      blueSaber.style.transform = 'rotate(0deg) translate(-50%, 0)';
      redSaber.style.transform = 'rotate(0deg) translate(-50%, 0)';
      $(overlay).delay(300).fadeOut(1500);
      displayQuestion(quiz, index);
    } else if (button.textContent === 'Play Again') {
      resetGame();
    }
  }
});

startButton.addEventListener('mouseover', () => {
  if (startButton.textContent === 'Play') {
    blueSaber.style.transform = 'rotate(61deg) translate(-32%, 29%)';
    redSaber.style.transform = 'rotate(-61deg) translate(3%, 15%)';
  }
});

startButton.addEventListener('mouseout', () => {
  if (startButton.textContent === 'Play') {
    blueSaber.style.transform = '';
    redSaber.style.transform = '';
  }
});

form.addEventListener('submit', e => {
  e.preventDefault();
  const response = document.querySelector('.choice:checked');
  if (response === null) {
    alert('Please pick an answer');
  } else {
    checkResponse(response.value, quiz[index].answer);
    index += 1;
    const radioButtons = document.querySelectorAll('.choice');
    radioButtons.forEach(element => {
      choicesDiv.removeChild(element.nextElementSibling);
      choicesDiv.removeChild(element);
    });
    displayQuestion(quiz, index);
  }
});