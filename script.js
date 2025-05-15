// Данные опроса
const quizData = [
    { question: "Что такое операционная система?", options: ["а) Программа для работы с графикой", "б) Комплекс программ, управляющих ресурсами компьютера", "в) Антивирусное ПО"], correctAnswer: 1 },
    { question: "Какая ОС является самой распространённой для персональных компьютеров?", options: ["а) macOS", "б) Windows", "в) Linux"], correctAnswer: 1 },
    { question: "Какая ОС используется в iPhone?", options: ["а) Android", "б) iOS", "в) HarmonyOS"], correctAnswer: 1 },
    { question: "Какую ОС часто используют на серверах и в IT-инфраструктуре?", options: ["а) Windows Server", "б) Linux", "в) ChromeOS"], correctAnswer: 1 },
    { question: "Какая ОС является открытой (open-source)?", options: ["а) Windows", "б) macOS", "в) Linux"], correctAnswer: 2 },
    { question: "Какую ОС разработала компания Google для смартфонов?", options: ["а) iOS", "б) Android", "в) Tizen"], correctAnswer: 1 },
    { question: "Какая ОС не имеет графического интерфейса по умолчанию?", options: ["а) Windows", "б) Linux (многие серверные версии)", "в) macOS"], correctAnswer: 1 },
    { question: "Какая ОС используется в умных часах (например, Samsung Galaxy Watch)?", options: ["а) Wear OS", "б) iOS", "в) Windows Mobile"], correctAnswer: 0 },
    { question: "Какая ОС подходит для программистов и разработчиков? (возможно несколько вариантов)", options: ["а) Windows", "б) Linux", "в) macOS"], correctAnswer: [1, 2] },
    { question: "Какая ОС раньше называлась 'Windows Phone'?", options: ["а) Android", "б) Windows Mobile", "в) KaiOS"], correctAnswer: 1 },
];

// Перемешивание массива
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

let currentQuestion = 0;
let score = 0;
let userAnswers = [];
let shuffledQuizData = [];
const quizContainer = document.getElementById('quiz-container');
const errorMsg = document.createElement('div');
errorMsg.className = 'error-msg';
errorMsg.style.display = 'none';

function loadQuestion() {
    const questionData = shuffledQuizData[currentQuestion];
    const isLastQuestion = currentQuestion === shuffledQuizData.length - 1;

    quizContainer.innerHTML = `
        <div class="question">${questionData.question}</div>
        <div class="options">
            ${questionData.options.map((option, index) => `
                <div class="option">
                    <input type="radio" name="answer" id="option${index}" value="${index}">
                    <label for="option${index}">${option}</label>
                </div>
            `).join('')}
        </div>
        <button id="next-btn" class="btn">${isLastQuestion ? 'Завершить опрос' : 'Продолжить'}</button>
    `;

    quizContainer.appendChild(errorMsg);
    document.getElementById('next-btn').addEventListener('click', handleNextQuestion);
}

function handleNextQuestion() {
    const selectedOption = document.querySelector('input[name="answer"]:checked');

    if (!selectedOption) {
        errorMsg.textContent = 'Пожалуйста, выберите ответ!';
        errorMsg.style.display = 'block';
        return;
    }

    errorMsg.style.display = 'none';

    const answer = parseInt(selectedOption.value);
    const correctAnswers = Array.isArray(shuffledQuizData[currentQuestion].correctAnswer)
        ? shuffledQuizData[currentQuestion].correctAnswer
        : [shuffledQuizData[currentQuestion].correctAnswer];
    
    userAnswers.push(answer);

    if (correctAnswers.includes(answer)) {
        score++;
    }

    if (currentQuestion < shuffledQuizData.length - 1) {
        currentQuestion++;
        loadQuestion();
    } else {
        localStorage.setItem('quizScore', score);
        localStorage.setItem('totalQuestions', shuffledQuizData.length);
        localStorage.setItem('userAnswers', JSON.stringify(userAnswers));
        localStorage.setItem('shuffledQuestions', JSON.stringify(shuffledQuizData));
        window.location.href = 'results.html';
    }
}

if (window.location.pathname.includes('results.html')) {
    const resultsDiv = document.getElementById('results');
    const score = localStorage.getItem('quizScore');
    const totalQuestions = localStorage.getItem('totalQuestions');
    const savedAnswers = JSON.parse(localStorage.getItem('userAnswers') || '[]';
    const shuffledQuestions = JSON.parse(localStorage.getItem('shuffledQuestions') || '[]');
    const percentage = (score / totalQuestions) * 100;

    let rating = '';
    if (percentage >= 80) rating = '★★★★★';
    else if (percentage >= 60) rating = '★★★★';
    else if (percentage >= 40) rating = '★★★';
    else if (percentage >= 20) rating = '★★';
    else rating = '★';

    let reviewHTML = '<div class="review-section"><h3>Обратная связь по вопросам:</h3><ol>';
    shuffledQuestions.forEach((q, index) => {
        const correct = Array.isArray(q.correctAnswer) ? q.correctAnswer : [q.correctAnswer];
        const isCorrect = correct.includes(savedAnswers[index]);
        reviewHTML += `<li class="${isCorrect ? 'correct' : 'incorrect'}">
            <strong>${q.question}</strong><br>
            Ваш ответ: <em>${q.options[savedAnswers[index]] || 'не выбран'}</em><br>
            Правильный ответ: <em>${correct.map(i => q.options[i]).join(', ')}</em><br>
            <span>${isCorrect ? '✅ Верно' : '❌ Неверно'}</span>
        </li>`;
    });
    reviewHTML += '</ol></div>';

    resultsDiv.innerHTML = `
        <div class="score-display">
            <div class="score-circle">${score}/${totalQuestions}</div>
            <div class="rating">${rating}</div>
        </div>
        <p class="score-text">Вы ответили правильно на <strong>${score}</strong> из <strong>${totalQuestions}</strong> вопросов</p>
        ${reviewHTML}
        <a href="quiz.html" class="btn">Пройти ещё раз</a>
        <a href="index.html" class="btn">На главную</a>
    `;
}

if (quizContainer) {
    shuffledQuizData = shuffle([...quizData]);
    loadQuestion();
}
