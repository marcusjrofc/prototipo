// Base de dados: Dilemas Éticos Práticos
const quizData = [
    {
        question: "Dilema do Trem: Um trem vai matar 5 pessoas. Você pode puxar uma alavanca e desviar para outra linha, onde matará 1. Um utilitarista faria o quê?",
        image: "./imgs/img1.jpg",
        options: [
            "Não puxaria, pois não temos o direito de intervir no destino.",
            "Puxaria a alavanca. Matar 1 é melhor que deixar 5 morrerem.",
            "Não puxaria, pois matar ativamente alguém fere o dever moral.",
            "Tentaria parar o trem com as próprias mãos."
        ],
        correctAnswer: 1 // Utilitarismo puro = saldo positivo de vidas
    },
    {
        question: "Dilema do Transplante: Um médico tem 5 pacientes precisando de órgãos. Um homem saudável entra na clínica. Segundo Kant (Deontologia), o médico pode sacrificar o saudável?",
        image: "./imgs/img2.jpg",
        options: [
            "Não. Nunca se deve usar uma pessoa apenas como meio para um fim.",
            "Sim. Salvar 5 vidas justifica o sacrifício de 1.",
            "Sim, desde que a morte do paciente seja indolor.",
            "Depende de quem são os 5 pacientes."
        ],
        correctAnswer: 0 // Kant = as pessoas são fins em si mesmas
    },
    {
        question: "Bomba Relógio: Um terrorista escondeu uma bomba na cidade. A única forma de achá-la é torturá-lo. Qual justificativa apoia a tortura neste caso?",
        image: "./imgs/img3.jpg",
        options: [
            "A Ética Deontológica, focada no dever puro.",
            "A Ética Aristotélica da virtude e moderação.",
            "A Ética Utilitarista, focada em salvar milhares minimizando a dor geral.",
            "A Ética Niilista."
        ],
        correctAnswer: 2 // Utilitarismo
    },
    {
        question: "O Bote Salva-Vidas: O barco vai afundar se uma das 4 pessoas não for jogada ao mar. Três são médicos que têm a cura do câncer, um é um criminoso. O que Kant diria?",
        image: "./imgs/img4.jpg",
        options: [
            "Jogue o criminoso, os médicos valem mais para a sociedade.",
            "Jogue qualquer um, não faz diferença.",
            "A moralidade proíbe o assassinato intencional de quem quer que seja.",
            "Tire a sorte no palitinho para ser justo."
        ],
        correctAnswer: 2 // Deontologia = a regra moral é absoluta
    },
    {
        question: "A Mentira Sincera: Um assassino bate à sua porta procurando seu amigo inocente que está escondido lá. Kant defende que você:",
        image: "./imgs/img5.jpg",
        options: [
            "Minta, para salvar a vida do seu amigo.",
            "Diga a verdade. Mentir fere o Imperativo Categórico.",
            "Minta apenas se tiver certeza de que vai funcionar.",
            "Ataque o assassino preventivamente."
        ],
        correctAnswer: 1 // Kant era famosamente contra a mentira em qualquer circunstância
    }
];

let currentQuestionIndex = 0;
let score = 0;
let countdown;
let chartInstance = null;

function goToScreen(screenId) {
    document.querySelectorAll('.screen').forEach(el => el.classList.remove('active'));
    document.getElementById(screenId).classList.add('active');
}

function startQuiz() {
    const age = document.getElementById('userAge').value;
    if (!age) { alert("Por favor, preencha sua idade!"); return; }
    
    currentQuestionIndex = 0; score = 0;
    loadQuestion();
    goToScreen('screen-quiz');
}

function loadQuestion() {
    const q = quizData[currentQuestionIndex];
    document.getElementById('questionCounter').innerText = `Dilema ${currentQuestionIndex + 1} de ${quizData.length}`;
    document.getElementById('questionText').innerText = q.question;
    document.getElementById('questionImage').src = q.image; 
    
    const optionsContainer = document.getElementById('optionsContainer');
    optionsContainer.innerHTML = ''; 
    document.getElementById('feedbackArea').classList.add('hidden');

    const labels = ['A', 'B', 'C', 'D'];
    q.options.forEach((opt, index) => {
        const btn = document.createElement('button');
        btn.className = `opt-btn opt-color-${index}`;
        btn.innerHTML = `<span class="opt-letter">${labels[index]}</span> <span>${opt}</span>`;
        btn.onclick = () => handleAnswer(index);
        optionsContainer.appendChild(btn);
    });

    startTimer();
}

function startTimer() {
    clearInterval(countdown);
    let timeLeft = 30; // 30 segundos para ler os dilemas
    document.getElementById('timerText').innerText = timeLeft + 's';
    
    countdown = setInterval(() => {
        timeLeft--;
        document.getElementById('timerText').innerText = timeLeft + 's';
        if (timeLeft <= 0) { clearInterval(countdown); handleAnswer(-1); }
    }, 1000);
}

function handleAnswer(selectedIndex) {
    clearInterval(countdown);
    const q = quizData[currentQuestionIndex];
    const isCorrect = selectedIndex === q.correctAnswer;
    
    // Trava botões e estiliza
    const allButtons = document.querySelectorAll('.opt-btn');
    allButtons.forEach((btn, idx) => {
        btn.disabled = true;
        if (idx === q.correctAnswer) {
            btn.style.border = "4px solid #10b981"; btn.style.background = "#d1fae5";
        } else if (idx === selectedIndex) {
            btn.style.border = "4px solid #ef4444"; btn.style.background = "#fee2e2";
        } else {
            btn.style.opacity = "0.5"; 
        }
    });

    const title = document.getElementById('feedbackMessage');
    const subtext = document.getElementById('feedbackSubtext');

    if (isCorrect) {
        score++;
        title.innerText = "✅ Escolha Correta!"; title.style.color = "#10b981";
        subtext.innerText = "Você identificou perfeitamente o conceito ético.";
    } else {
        title.innerText = selectedIndex === -1 ? "⏰ Tempo Esgotado!" : "❌ Escolha Incorreta!"; title.style.color = "#ef4444";
        subtext.innerText = "A resposta correta era a letra " + ['A','B','C','D'][q.correctAnswer];
    }
    
    document.getElementById('feedbackArea').classList.remove('hidden');
}

function nextQuestion() {
    currentQuestionIndex++;
    if (currentQuestionIndex < quizData.length) { loadQuestion(); } 
    else { showResults(); }
}

function showResults() {
    goToScreen('screen-results');
    document.getElementById('finalScoreText').innerText = `${score} / ${quizData.length}`;
    const pC = Math.round((score / quizData.length) * 100);
    
    const ctx = document.getElementById('resultsChart').getContext('2d');
    if (chartInstance) chartInstance.destroy();
    chartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: { labels: ['Decisões Corretas', 'Erros'], datasets: [{ data: [pC, 100 - pC], backgroundColor: ['#10b981', '#ef4444'], borderWidth: 0 }] },
        options: { responsive: true, maintainAspectRatio: false, cutout: '75%', plugins: { legend: { position: 'bottom' } } }
    });
}