/**
 * utils.js
 * ------------------------------
 * Funções utilitárias para o jogo matemático com tema RPG
 * Contém funções auxiliares que são usadas por vários outros módulos
 */

// === FUNÇÕES MATEMÁTICAS E ALEATÓRIAS ===

/**
 * Gera um número inteiro aleatório entre min e max (inclusive)
 * 
 * @param {number} min - Valor mínimo
 * @param {number} max - Valor máximo
 * @return {number} Número inteiro aleatório
 */
function random(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Embaralha um array (algoritmo Fisher-Yates)
 * Útil para randomizar a ordem das opções de resposta
 * 
 * @param {Array} array - Array a ser embaralhado
 * @return {Array} O mesmo array, agora embaralhado
 */
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

/**
 * Gera opções de distração para questões de múltipla escolha
 * Cria valores próximos à resposta correta para servir como alternativas
 * 
 * @param {number} correctAnswer - A resposta correta
 * @param {number} count - Quantidade de distrações a gerar (padrão: 3)
 * @param {number} variation - Variação máxima em relação à resposta correta (padrão: 10)
 * @return {Array} Array com as opções de distração
 */
function generateDistractors(correctAnswer, count = 3, variation = 10) {
    const distractors = new Set();
    
    // Tenta gerar distrações com pequena variação
    for (let i = 0; i < 15; i++) { // Tenta mais vezes para garantir diversidade
        if (distractors.size >= count) {
            break;
        }
        const offset = random(-variation, variation);
        if (offset === 0) continue; // Evita gerar a própria resposta correta
        
        const distractor = correctAnswer + offset;
        if (distractor !== correctAnswer) {
            distractors.add(distractor);
        }
    }
    
    // Se não conseguiu gerar distrações suficientes, adiciona números aleatórios
    while (distractors.size < count) {
        const distractor = correctAnswer + random(-variation*2, variation*2);
        if (distractor !== correctAnswer) {
            distractors.add(distractor);
        }
    }
    
    return Array.from(distractors);
}

// === MANIPULAÇÃO DO DOM ===

/**
 * Cria um elemento HTML com atributos e conteúdo
 * 
 * @param {string} tag - Tag do elemento (div, p, button, etc)
 * @param {Object} attributes - Objeto com atributos a serem adicionados
 * @param {string|Node} content - Conteúdo do elemento (texto ou outro elemento)
 * @return {HTMLElement} Elemento criado
 */
function createElement(tag, attributes = {}, content = '') {
    const element = document.createElement(tag);
    
    // Adiciona atributos
    for (const [key, value] of Object.entries(attributes)) {
        if (key === 'className') {
            element.className = value;
        } else {
            element.setAttribute(key, value);
        }
    }
    
    // Adiciona conteúdo
    if (typeof content === 'string') {
        element.textContent = content;
    } else if (content instanceof Node) {
        element.appendChild(content);
    }
    
    return element;
}

/**
 * Esconde todos os elementos com a classe especificada
 * 
 * @param {string} className - Nome da classe dos elementos a esconder
 */
function hideElementsByClass(className) {
    const elements = document.getElementsByClassName(className);
    for (let i = 0; i < elements.length; i++) {
        elements[i].style.display = 'none';
    }
}

/**
 * Mostra um elemento específico e esconde todos os outros com a mesma classe
 * 
 * @param {HTMLElement} element - Elemento a ser mostrado
 * @param {string} className - Nome da classe dos elementos a esconder
 */
function showElementHideOthers(element, className) {
    hideElementsByClass(className);
    element.style.display = 'block';
}

/**
 * Adiciona uma animação de fade-in a um elemento
 * 
 * @param {HTMLElement} element - Elemento a receber a animação
 * @param {number} duration - Duração da animação em ms (padrão: 500ms)
 */
function fadeIn(element, duration = CONFIG.TEMPO_ANIMACAO) {
    element.style.opacity = '0';
    element.style.display = 'block';
    
    setTimeout(() => {
        element.style.transition = `opacity ${duration/1000}s ease`;
        element.style.opacity = '1';
    }, 10);
}

/**
 * Adiciona uma animação de fade-out a um elemento
 * 
 * @param {HTMLElement} element - Elemento a receber a animação
 * @param {number} duration - Duração da animação em ms (padrão: 500ms)
 * @param {Function} callback - Função a ser chamada após a animação
 */
function fadeOut(element, duration = CONFIG.TEMPO_ANIMACAO, callback = null) {
    element.style.transition = `opacity ${duration/1000}s ease`;
    element.style.opacity = '0';
    
    setTimeout(() => {
        element.style.display = 'none';
        if (callback && typeof callback === 'function') {
            callback();
        }
    }, duration);
}

// === GERENCIAMENTO DE ESTADO DO JOGO ===

/**
 * Salva o estado do jogo no localStorage
 * 
 * @param {Object} gameState - Estado atual do jogo
 */
function saveGameState(gameState) {
    localStorage.setItem('rpgMathGame', JSON.stringify(gameState));
}

/**
 * Carrega o estado do jogo do localStorage
 * 
 * @return {Object|null} Estado do jogo ou null se não existir
 */
function loadGameState() {
    const savedState = localStorage.getItem('rpgMathGame');
    return savedState ? JSON.parse(savedState) : null;
}

/**
 * Cria um novo estado de jogo com valores padrão
 * 
 * @return {Object} Novo estado de jogo
 */
function createNewGameState() {
    return {
        currentPhase: 1,
        lives: CONFIG.VIDAS_INICIAIS,
        score: 0,
        completedPhases: 0,
        totalPhases: CONFIG.TOTAL_FASES,
        questionsAnswered: 0
    };
}

/**
 * Formata um número para exibição, com um número fixo de casas decimais
 * 
 * @param {number} num - O número a ser formatado
 * @param {number} decimals - O número de casas decimais (padrão: 2)
 * @return {string} O número formatado como uma string
 */
function formatDecimal(num, decimals = 2) {
    // Returns a string using a dot as decimal separator. Keeps integers without trailing .00.
    const n = Number(num);
    if (!isFinite(n)) return String(num);
    if (Number.isInteger(n)) return String(n);
    return n.toFixed(decimals); // toFixed uses dot (e.g. "28.26")
}

// Exporta as funções para uso em outros arquivos
window.utils = {
    random,
    shuffleArray,
    generateDistractors,
    createElement,
    hideElementsByClass,
    showElementHideOthers,
    fadeIn,
    fadeOut,
    saveGameState,
    loadGameState,
    createNewGameState,
    formatDecimal
};
