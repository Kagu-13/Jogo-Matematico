/**
 * game.js
 * ------------------------------
 * Lógica principal do jogo matemático com tema RPG
 * Responsável por gerenciar as fases, questões e interações do jogador
 * 
 * Dependências: config.js, utils.js, questions.js, map.js
 */

// === GERENCIAMENTO DE FASES ===

/**
 * Carrega uma fase específica do jogo
 * Prepara a interface e inicia os desafios da fase
 * 
 * @param {number} phaseNumber - Número da fase a ser carregada (1-5)
 */
function loadPhase(phaseNumber) {
    // Atualiza o estado do jogo
    gameState.currentPhase = phaseNumber;
    gameState.score = 0;
    gameState.questionsAnswered = 0;
    
    // Salva o estado atualizado
    utils.saveGameState(gameState);
    
    // Obtém informações do reino atual
    const realmInfo = window.mapFunctions.getCurrentRealmInfo();
    
    // Elementos do jogo
    const gameScreen = document.getElementById('game-screen');
    
    // Cria o HTML da tela de jogo
    gameScreen.innerHTML = `
        <div class="phase-intro">
            <h2 class="rpg-subtitle">${realmInfo.name}</h2>
            <div class="narrative-content">
                <p>${realmInfo.description}</p>
                <p>Prepare-se para enfrentar os desafios matemáticos deste reino!</p>
            </div>
            <button id="start-phase" class="rpg-button">Iniciar Desafios</button>
        </div>
        
        <div class="game-container" style="display: none;">
            <div class="status-bar">
                <span class="phase-display">Reino: ${phaseNumber}/${CONFIG.TOTAL_FASES}</span>
                <span class="lives-display">Poções: </span>
                <span class="score-display">Desafios: ${gameState.questionsAnswered}/${CONFIG.QUESTOES_POR_FASE}</span>
            </div>
            
            <div class="question-area">
                <p class="question-context"></p>
                <p class="question-text"></p>
            </div>
            
            <div class="options-grid">
                <!-- Opções serão inseridas aqui -->
            </div>
            
            <div class="feedback-area">
                <p id="feedback-text"></p>
            </div>
        </div>
    `;
    
    // Mostra a tela de jogo
    utils.fadeIn(gameScreen, CONFIG.TEMPO_ANIMACAO);
    
    // Adiciona evento ao botão de iniciar fase
    document.getElementById('start-phase').addEventListener('click', function() {
        // Esconde a introdução e mostra o jogo
        document.querySelector('.phase-intro').style.display = 'none';
        document.querySelector('.game-container').style.display = 'block';
        
        // Gera a primeira questão
        generateQuestion();
    });
    
    // Atualiza a exibição de vidas
    updateLivesDisplay();
}

/**
 * Atualiza a exibição de vidas (poções)
 * Mostra o número atual de poções disponíveis
 */
function updateLivesDisplay() {
    const livesDisplay = document.querySelector('.lives-display');
    if (livesDisplay) {
        let livesHTML = 'Poções: ';
        for (let i = 0; i < gameState.lives; i++) {
            livesHTML += '🧪';
        }
        livesDisplay.innerHTML = livesHTML;
    }
}

// === GERENCIAMENTO DE QUESTÕES ===

// Variável para armazenar a questão atual
let currentQuestion = null;

/**
 * Gera uma nova questão
 * Obtém uma questão do gerador e atualiza a interface
 */
function generateQuestion() {
    // Limpa o feedback anterior
    const feedbackText = document.getElementById('feedback-text');
    if (feedbackText) {
        feedbackText.textContent = '';
        feedbackText.className = '';
    }
    
    // Gera uma nova questão contextualizada
    currentQuestion = window.questionGenerator.generateQuestionWithContext(
        gameState.currentPhase, 
        gameState.questionsAnswered
    );
    
    // Atualiza a interface com a nova questão
    document.querySelector('.question-context').textContent = currentQuestion.context;
    document.querySelector('.question-text').textContent = currentQuestion.questionText;
    
    // Limpa as opções anteriores
    const optionsGrid = document.querySelector('.options-grid');
    optionsGrid.innerHTML = '';
    
    // Adiciona as novas opções
    currentQuestion.options.forEach((option, index) => {
        const button = document.createElement('button');
        button.className = 'option-button';
        button.textContent = option;
        button.onclick = () => checkAnswer(index);
        optionsGrid.appendChild(button);
    });
}

/**
 * Verifica a resposta selecionada pelo jogador
 * Atualiza o estado do jogo e fornece feedback
 * 
 * @param {number} selectedIndex - Índice da opção selecionada
 */
function checkAnswer(selectedIndex) {
    const feedbackText = document.getElementById('feedback-text');
    
    if (selectedIndex === currentQuestion.correctAnswerIndex) {
        // Resposta correta
        feedbackText.textContent = TEXTOS.FEEDBACK.CORRETO;
        feedbackText.className = 'feedback-correct';
        gameState.score++;
        gameState.questionsAnswered++;
        
        // Atualiza o contador de desafios
        document.querySelector('.score-display').textContent = `Desafios: ${gameState.questionsAnswered}/${CONFIG.QUESTOES_POR_FASE}`;
        
        // Salva o estado atualizado
        utils.saveGameState(gameState);
        
        // Verifica se completou a fase
        if (gameState.questionsAnswered >= CONFIG.QUESTOES_POR_FASE) {
            // Avança para a próxima fase via mapa
            setTimeout(() => {
                const gameScreen = document.getElementById('game-screen');
                utils.fadeOut(gameScreen, CONFIG.TEMPO_ANIMACAO, function() {
                    window.mapFunctions.advanceToNextPhase();
                });
            }, CONFIG.TEMPO_ENTRE_QUESTOES);
            return;
        }
    } else {
        // Resposta errada
        feedbackText.textContent = TEXTOS.FEEDBACK.INCORRETO;
        feedbackText.className = 'feedback-wrong';
        gameState.lives--;
        
        // Atualiza a exibição de vidas
        updateLivesDisplay();
        
        // Salva o estado atualizado
        utils.saveGameState(gameState);
        
        // Verifica se perdeu todas as vidas
        if (gameState.lives <= 0) {
            setTimeout(() => {
                window.showGameOver();
            }, CONFIG.TEMPO_ENTRE_QUESTOES);
            return;
        }
    }
    
    // Gera uma nova questão após um breve delay
    setTimeout(generateQuestion, CONFIG.TEMPO_ENTRE_QUESTOES);
}

// Exporta as funções para uso em outros arquivos
window.loadPhase = loadPhase;
window.generateQuestion = generateQuestion;
window.checkAnswer = checkAnswer;
window.updateLivesDisplay = updateLivesDisplay;
