const quizData = [
    {
        question: "O que a Ética Utilitarista defende como princípio moral?",
        options: [
            "A ação correta maximiza a felicidade geral.",
            "O dever deve ser cumprido, independente dos resultados.",
            "A moralidade depende das virtudes do caráter humano.",
            "Ações morais são aquelas aprovadas pela sociedade."
        ],
        correctAnswer: 0
    },
    {
        question: "Na Ética Deontológica de Kant, como uma ação moral é avaliada?",
        options: [
            "Pelos resultados práticos que ela traz à maioria.",
            "Pela intenção de agir pelo dever (Imperativo Categórico).",
            "Pela análise de prós e contras financeiros.",
            "Pela busca do prazer individual e evitar a dor."
        ],
        correctAnswer: 1
    },
    {
        question: "Dilema do Trem: Desviar um trem para salvar 5 pessoas e sacrificar 1 é um raciocínio:",
        options: [
            "Niilista",
            "Deontológico",
            "Utilitarista",
            "Aristotélico"
        ],
        correctAnswer: 2
    }
];

let currentQuestionIndex = 0;
let score = 0;
let countdown;
let chartInstance = null;

// Função genérica de navegação
function goToScreen(screenId) {
    document.querySelectorAll('.screen').forEach(el => el.classList.remove('active'));
    document.getElementById(screenId).classList.add('active');
}

function startQuiz() {
    const age = document.getElementById('userAge').value;
    if (!age || age <= 0) {
        alert("Preencha sua idade para continuar.");
        return;
    }
    
    currentQuestionIndex = 0;
    score = 0;
    loadQuestion();
    goToScreen('screen-quiz');
}

function loadQuestion() {
    const q = quizData[currentQuestionIndex];
    document.getElementById('questionCounter').innerText = `Pergunta ${currentQuestionIndex + 1} de ${quizData.length}`;
    document.getElementById('questionText').innerText = q.question;
    
    const optionsContainer = document.getElementById('optionsContainer');
    optionsContainer.innerHTML = ''; 
    
    // Esconde a área de feedback e botão de próxima
    document.getElementById('feedbackArea').classList.add('hidden');

    const labels = ['A', 'B', 'C', 'D'];

    q.options.forEach((opt, index) => {
        const btn = document.createElement('button');
        btn.className = `opt-btn opt-color-${index}`;
        btn.innerHTML = `<span class="opt-letter">${labels[index]}</span> <span>${opt}</span>`;
        
        // Atrela o clique à função de checagem
        btn.onclick = () => handleAnswer(index, btn);
        optionsContainer.appendChild(btn);
    });

    startTimer();
}

function startTimer() {
    clearInterval(countdown);
    let timeLeft = 20;
    document.getElementById('timerText').innerText = timeLeft + 's';
    
    countdown = setInterval(() => {
        timeLeft--;
        document.getElementById('timerText').innerText = timeLeft + 's';
        
        if (timeLeft <= 0) {
            clearInterval(countdown);
            handleAnswer(-1, null); // Tempo esgotado
        }
    }, 1000);
}

// Trata a resposta: trava botões e mostra feedback imediato na mesma tela
function handleAnswer(selectedIndex, clickedButton) {
    clearInterval(countdown);
    
    const q = quizData[currentQuestionIndex];
    const isCorrect = selectedIndex === q.correctAnswer;
    
    // Trava todos os botões para não deixar alterar a resposta
    const allButtons = document.querySelectorAll('.opt-btn');
    allButtons.forEach((btn, idx) => {
        btn.disabled = true; // Desabilita o clique
        
        // Destaca a resposta correta e apaga um pouco as outras
        if (idx === q.correctAnswer) {
            btn.style.border = "4px solid #10b981"; // Borda verde na certa
        } else if (idx === selectedIndex) {
            btn.style.border = "4px solid #ef4444"; // Borda vermelha se errou
        } else {
            btn.style.opacity = "0.4"; // Esmaece as que não foram escolhidas
        }
    });

    // Configura os textos do feedback
    const title = document.getElementById('feedbackMessage');
    const subtext = document.getElementById('feedbackSubtext');

    if (isCorrect) {
        score++;
        title.innerText = "✅ Resposta Correta!";
        title.style.color = "#10b981";
        subtext.innerText = "+10 pontos garantidos.";
    } else {
        title.innerText = selectedIndex === -1 ? "⏰ Tempo Esgotado!" : "❌ Resposta Incorreta!";
        title.style.color = "#ef4444";
        subtext.innerText = "A resposta correta era a alternativa " + ['A','B','C','D'][q.correctAnswer] + ".";
    }

    // Exibe a área de feedback com o botão "Próxima"
    document.getElementById('feedbackArea').classList.remove('hidden');
}

function nextQuestion() {
    currentQuestionIndex++;
    if (currentQuestionIndex < quizData.length) {
        loadQuestion();
    } else {
        showResults();
    }
}

function showResults() {
    goToScreen('screen-results');
    document.getElementById('finalScoreText').innerText = `${score} / ${quizData.length}`;
    
    const percentCorrect = Math.round((score / quizData.length) * 100);
    const percentWrong = 100 - percentCorrect;
    renderChart(percentCorrect, percentWrong);
}

function renderChart(correct, wrong) {
    const ctx = document.getElementById('resultsChart').getContext('2d');
    if (chartInstance) chartInstance.destroy();

    chartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Acertos', 'Erros'],
            datasets: [{
                data: [correct, wrong],
                backgroundColor: ['#10b981', '#ef4444'],
                borderWidth: 0
            }]
        },
        options: { responsive: true, maintainAspectRatio: false, cutout: '70%' }
    });
}