// Данные опроса
const quizData = [
    { question: "Что такое операционная система?", options: ["а) Программа для работы с графикой", "б) Комплекс программ, управляющих ресурсами компьютера", "в) Антивирусное ПО"], correctAnswer: 1 },
    { question: "Какая ОС является самой распространённой для персональных компьютеров?", options: ["а) macOS", "б) Windows", "в) Linux"], correctAnswer: 1 },
    { question: "Какая ОС используется в iPhone?", options: ["а) Android", "б) iOS", "в) HarmonyOS"], correctAnswer: 1 },
    { question: "Какую ОС часто используют на серверах и в IT-инфраструктуре?", options: ["а) Windows Server", "б) Linux", "в) ChromeOS"], correctAnswer: 1 },
    { question: "Какая ОС является открытой (open-source)?", options: ["а) Windows", "б) macOS", "в) Linux"], correctAnswer: 2 },
    { question: "Какую ОС разработала компания Google для смартфонов?", options: ["а) iOS", "б) Android", "в) Tizen"], correctAnswer: 1 },
    { question: "Какая ОС не имеет графического интерфейса по умолчанию?", options: ["а) Windows", "б) Linux (многие серверные версии)", "в) macOS"], correctAnswer: 1 },
    { question: "Какая ОС используется в умных часах (например, Samsung Galaxy Watch)?", options: ["а) Wear OS", "б) iOS", "в) Windows Mobile"], correctAnswer: 1 },
    { question: "Какая ОС подходит для программистов и разработчиков? (возможно несколько вариантов)", options: ["а) Windows", "б) Linux", "в) macOS"], correctAnswer: [1, 2], multiple: true },
    { question: "Какая ОС раньше называлась 'Windows Phone'?", options: ["а) Android", "б) Windows Mobile", "в) KaiOS"], correctAnswer: 1 },
];

let shuffledQuizData = [];
let currentQuestion = 0;
let score = 0;
let userAnswers = [];
const errorMsg = document.createElement('div');
errorMsg.className = 'error-msg';
errorMsg.style.color = '#e74c3c';
errorMsg.style.marginTop = '10px';
errorMsg.style.display = 'none';

// Перемешивание вопросов
function shuffle(array) {
    const copy = [...array];
    for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
}

// Регистрация
if (window.location.pathname.includes('register.html')) {
    const registrationForm = document.getElementById('registration-form');
    registrationForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const userData = {
            lastname: document.getElementById('lastname').value.trim(),
            firstname: document.getElementById('firstname').value.trim(),
            class: document.getElementById('class').value.trim()
        };
        localStorage.setItem('userData', JSON.stringify(userData));
        window.location.href = 'quiz.html';
    });
}

// Загрузка информации о пользователе
function loadUserInfo() {
    const userData = JSON.parse(localStorage.getItem('userData'));
    const userInfoDiv = document.getElementById('user-info');
    if (userData && userInfoDiv) {
        userInfoDiv.innerHTML = `
            <div class="user-info">
                <p><strong>Участник:</strong> ${userData.lastname} ${userData.firstname}</p>
                <p><strong>Класс/Группа:</strong> ${userData.class}</p>
            </div>
        `;
    }
}

// Загрузка вопроса
function loadQuestion() {
    const quizContainer = document.getElementById('quiz-container');
    if (!quizContainer) return;

    const questionData = shuffledQuizData[currentQuestion];
    const isLastQuestion = currentQuestion === shuffledQuizData.length - 1;
    const isMultiple = questionData.multiple || Array.isArray(questionData.correctAnswer);

    quizContainer.innerHTML = `
        <div class="question">${questionData.question}</div>
        <div class="options">
            ${questionData.options.map((option, index) => `
                <div class="option">
                    <input type="${isMultiple ? 'checkbox' : 'radio'}" name="answer" id="option${index}" value="${index}">
                    <label for="option${index}">${option}</label>
                </div>
            `).join('')}
        </div>
        <button id="next-btn" class="btn">${isLastQuestion ? 'Завершить опрос' : 'Продолжить'}</button>
    `;

    quizContainer.appendChild(errorMsg);
    document.getElementById('next-btn').addEventListener('click', handleNextQuestion);
}

// Обработка ответа
function handleNextQuestion() {
    const questionData = shuffledQuizData[currentQuestion];
    const isMultiple = questionData.multiple || Array.isArray(questionData.correctAnswer);
    const selectedOptions = Array.from(document.querySelectorAll('input[name="answer"]:checked')).map(input => parseInt(input.value));

    if (selectedOptions.length === 0) {
        errorMsg.textContent = 'Пожалуйста, выберите ответ!';
        errorMsg.style.display = 'block';
        return;
    }

    userAnswers.push(selectedOptions);
    const correctAnswers = Array.isArray(questionData.correctAnswer) ? questionData.correctAnswer : [questionData.correctAnswer];

    if (isMultiple) {
        const isCorrect = selectedOptions.length === correctAnswers.length && 
                         selectedOptions.every(opt => correctAnswers.includes(opt));
        if (isCorrect) score++;
    } else {
        if (correctAnswers.includes(selectedOptions[0])) score++;
    }

    if (currentQuestion < shuffledQuizData.length - 1) {
        currentQuestion++;
        loadQuestion();
    } else {
        localStorage.setItem('quizScore', score);
        localStorage.setItem('totalQuestions', shuffledQuizData.length);
        localStorage.setItem('userAnswers', JSON.stringify(userAnswers));
        localStorage.setItem('shuffledQuiz', JSON.stringify(shuffledQuizData));
        window.location.href = 'results.html';
    }
}

// Загрузка результатов
function loadUserResultsInfo() {
    const userData = JSON.parse(localStorage.getItem('userData'));
    const userResultsInfoDiv = document.getElementById('user-results-info');
    if (userData && userResultsInfoDiv) {
        userResultsInfoDiv.innerHTML = `
            <div class="user-results-info">
                <h2>Результаты участника</h2>
                <p><strong>ФИ:</strong> ${userData.lastname} ${userData.firstname}</p>
                <p><strong>Класс/Группа:</strong> ${userData.class}</p>
            </div>
        `;
    }
}

// Отображение результатов
if (window.location.pathname.includes('results.html')) {
    loadUserResultsInfo();
    const resultsDiv = document.getElementById('results');
    const score = parseInt(localStorage.getItem('quizScore')) || 0;
    const totalQuestions = parseInt(localStorage.getItem('totalQuestions')) || 0;
    const savedAnswers = JSON.parse(localStorage.getItem('userAnswers') || '[]');
    const shuffledData = JSON.parse(localStorage.getItem('shuffledQuiz') || '[]');
    const percentage = totalQuestions > 0 ? (score / totalQuestions) * 100 : 0;

    let rating = '';
    if (percentage >= 80) rating = '★★★★★';
    else if (percentage >= 60) rating = '★★★★';
    else if (percentage >= 40) rating = '★★★';
    else if (percentage >= 20) rating = '★★';
    else rating = '★';

    let reviewHTML = '<div class="review-section"><h3>Обратная связь по вопросам:</h3><ol>';
    shuffledData.forEach((q, index) => {
        const correct = Array.isArray(q.correctAnswer) ? q.correctAnswer : [q.correctAnswer];
        const userAnswer = savedAnswers[index] || [];
        const isCorrect = Array.isArray(userAnswer) 
            ? userAnswer.length === correct.length && userAnswer.every(opt => correct.includes(opt))
            : correct.includes(userAnswer[0]);
        
        reviewHTML += `<li class="${isCorrect ? 'correct' : 'incorrect'}">
            <strong>${q.question}</strong><br>
            Ваш ответ: <em>${userAnswer.map(opt => q.options[opt]).join(', ') || 'не выбран'}</em><br>
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

// Инициализация теста
if (window.location.pathname.includes('quiz.html')) {
    shuffledQuizData = shuffle(quizData);
    loadUserInfo();
    loadQuestion();
}