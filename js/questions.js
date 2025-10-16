/**
 * questions.js
 * ------------------------------
 * Gerador de questões matemáticas contextualizadas para o jogo RPG
 * Responsável por criar questões de diferentes tipos com narrativas temáticas
 * 
 * Dependências: config.js, utils.js
 */

// === GERADORES DE QUESTÕES POR TIPO ===

/**
 * Returns an English context sentence for a question using NARRATIVAS (config.js)
 * Falls back to simple templates if NARRATIVAS is not available.
 */
function getContext(phaseIndex, questionIndex) {
    if (typeof NARRATIVAS !== 'undefined' && NARRATIVAS[phaseIndex]) {
        const arr = NARRATIVAS[phaseIndex];
        return arr[questionIndex % arr.length] || arr[Math.floor(Math.random() * arr.length)];
    }

    // fallback contexts (English)
    const FALLBACK = {
        1: [
            "An ancient tree whispers a linear riddle you must solve.",
            "Sprites demand you solve a simple equation to pass."
        ],
        2: [
            "A bridge keeper asks you to interpret a linear function.",
            "A cartographer shows a straight-line relation to decode."
        ],
        3: [
            "Crystals hum a quadratic pattern; find its roots.",
            "An underground guardian presents a quadratic challenge."
        ],
        4: [
            "Platforms follow parabolic arcs; compute the peak.",
            "An inventor needs the vertex of a parabola calculated."
        ],
        5: [
            "The Great Mage mixes puzzles from all realms. Prove your mastery.",
            "A final blended challenge awaits at the altar."
        ]
    };

    const arr = FALLBACK[phaseIndex] || ["A mysterious mathematical challenge appears."];
    return arr[questionIndex % arr.length];
}

/**
 * Gera uma questão de equação de 1º grau com contexto narrativo (EN)
 * Formato: ax + b = c  (constructed so solution is integer or nicely formatted)
 */
function generateEq1WithContext(phaseIndex, questionIndex) {
    // choose integer solution first, then build equation
    const x = random(-10, 10);
    const a = random(1, 10);
    const b = random(-15, 15);
    const c = a * x + b;

    const context = getContext(phaseIndex, questionIndex);

    const correct = String(x);

    // distractors (nearby values), ensure uniqueness and string form
    const distractors = new Set();
    while (distractors.size < 3) {
        const delta = random(-4, 4);
        const val = x + delta;
        if (String(val) !== correct) distractors.add(String(val));
    }

    const options = shuffleArray([correct, ...Array.from(distractors)]);

    const questionText = `Solve for x: ${a}x + ${b} = ${c}`;
    return {
        q: questionText,
        a: correct,
        opcoes: options,
        context: context
    };
}

/**
 * Gera uma questão de função de 1º grau com contexto narrativo
 * Formato: f(x) = ax + b
 * 
 * @param {number} phaseIndex - Índice da fase atual (1-5)
 * @param {number} questionIndex - Índice da questão na fase atual
 * @return {Object} Objeto com a questão, contexto, opções e resposta correta
 */
function generateFunc1WithContext(phaseIndex, questionIndex) {
    // Gera a função matemática com dificuldade apropriada
    const difficulty = CONFIG.DIFICULDADE.MEDIA;
    const a = utils.random(1, 5) * (Math.random() < 0.5 ? -1 : 1);
    const b = utils.random(difficulty.MIN_NUMERO, difficulty.MAX_NUMERO);
    const x_val = utils.random(difficulty.MIN_NUMERO, difficulty.MAX_NUMERO);
    const fx_val = a * x_val + b;
    
    // Obtém o contexto narrativo para esta questão
    const context = NARRATIVAS[phaseIndex][questionIndex % NARRATIVAS[phaseIndex].length];
    
    // Decide aleatoriamente se pergunta f(x) ou x
    let questionText, correctAnswer;
    if (Math.random() < 0.5) {
        // Pergunta o valor de f(x) para um x dado
        questionText = `Given the function f(x) = ${a}x + ${b}, what is the value of f(${x_val})?`;
        correctAnswer = fx_val;
    } else {
        // Pergunta o valor de x para um f(x) dado
        // Garante que a seja diferente de 0 para poder isolar x
        const a_safe = a === 0 ? (Math.random() < 0.5 ? -1 : 1) : a;
        const fx_val_safe = a_safe * x_val + b;
        questionText = `Given the function f(x) = ${a_safe}x + ${b}, for which value of x do we have f(x) = ${fx_val_safe}?`;
        correctAnswer = x_val;
    }
    
    // Gera as opções e identifica a resposta correta
    const options = utils.generateDistractors(correctAnswer, 3, difficulty.VARIACAO_DISTRATORES);
    options.push(correctAnswer);
    utils.shuffleArray(options);
    const correctAnswerIndex = options.indexOf(correctAnswer);
    
    // Retorna o objeto completo da questão
    return {
        context: context,
        questionText: questionText,
        options: options.map(String),
        correctAnswerIndex: correctAnswerIndex
    };
}

/**
 * Gera uma questão de equação de 2º grau com contexto narrativo (EN)
 * Retorna as opções e a resposta formatadas com point decimal se necessário
 */
function generateEq2WithContext(phaseIndex, questionIndex) {
    // Generate coefficients ensuring real roots
    let a, b, c, disc;
    do {
        a = random(1, 5);
        b = random(-10, 10);
        c = random(-10, 10);
        disc = b * b - 4 * a * c;
    } while (disc < 0);

    const sqrt = Math.sqrt(disc);
    let x1 = (-b - sqrt) / (2 * a);
    let x2 = (-b + sqrt) / (2 * a);

    // Avoid identical roots (very unlikely after above, but safe)
    if (Math.abs(x1 - x2) < 1e-9) x2 += 1;

    const smallest = Math.min(x1, x2);

    // format decimal with utils.formatDecimal if available, otherwise use toFixed
    const fmt = (num) => {
        if (typeof utils !== 'undefined' && typeof utils.formatDecimal === 'function') {
            return utils.formatDecimal(num, 2);
        }
        if (Number.isInteger(num)) return String(num);
        return num.toFixed(2);
    };

    const correct = fmt(smallest);

    // Build distractors near the correct value, formatted with dot
    const distractors = new Set();
    while (distractors.size < 3) {
        const offset = (random(-5, 5) + Math.random()); // small random offset
        const value = fmt(Number(correct) + offset);
        if (value !== correct) distractors.add(value);
    }

    const options = shuffleArray([correct, ...Array.from(distractors)]);

    const context = getContext(phaseIndex, questionIndex);
    const questionText = `Solve: ${a}x² + ${b}x + ${c} = 0. What is the smallest root?`;

    return {
        q: questionText,
        a: correct,
        opcoes: options,
        context: context
    };
}

/**
 * Gera uma questão de função de 2º grau com contexto narrativo
 * Formato: f(x) = ax² + bx + c
 * 
 * @param {number} phaseIndex - Índice da fase atual (1-5)
 * @param {number} questionIndex - Índice da questão na fase atual
 * @return {Object} Objeto com a questão, contexto, opções e resposta correta
 */
function generateFunc2WithContext(phaseIndex, questionIndex) {
    // Gera a função matemática com dificuldade apropriada
    const difficulty = CONFIG.DIFICULDADE.DIFICIL;
    const a = utils.random(1, 3) * (Math.random() < 0.5 ? -1 : 1);
    const b = utils.random(difficulty.MIN_NUMERO, difficulty.MAX_NUMERO);
    const c = utils.random(difficulty.MIN_NUMERO, difficulty.MAX_NUMERO);
    
    // Obtém o contexto narrativo para esta questão
    const context = NARRATIVAS[phaseIndex][questionIndex % NARRATIVAS[phaseIndex].length];
    
    // Escolhe aleatoriamente o tipo de pergunta
    const questionTypes = ['value', 'vertex_x', 'vertex_y', 'roots'];
    const questionType = questionTypes[Math.floor(Math.random() * questionTypes.length)];
    
    let questionText, correctAnswer, options;
    
    // Gera a questão de acordo com o tipo escolhido
    if (questionType === 'value') {
        // Pergunta o valor de f(x) para um x dado
        const x_val = utils.random(-3, 3);
        const fx_val = a * (x_val**2) + b * x_val + c;
        questionText = `Given the function f(x) = ${a}x² + ${b}x + ${c}, what is the value of f(${x_val})?`;
        correctAnswer = fx_val;
        options = utils.generateDistractors(correctAnswer, 3, difficulty.VARIACAO_DISTRATORES);
        options.push(correctAnswer);
        utils.shuffleArray(options);
        const correctAnswerIndex = options.indexOf(correctAnswer);
        
        return {
            context: context,
            questionText: questionText,
            options: options.map(String),
            correctAnswerIndex: correctAnswerIndex
        };
    } 
    else if (questionType === 'vertex_x') {
        // Pergunta a coordenada x do vértice
        // Ajusta b para ter divisão exata
        const adjusted_b = utils.random(-3, 3) * (2 * a);
        const xv = -adjusted_b / (2 * a);
        questionText = `What is the x-coordinate of the vertex of the parabola f(x) = ${a}x² + ${adjusted_b}x + ${c}?`;
        correctAnswer = xv;
        options = utils.generateDistractors(correctAnswer, 3, 3);
        options.push(correctAnswer);
        utils.shuffleArray(options);
        const correctAnswerIndex = options.indexOf(correctAnswer);
        
        return {
            context: context,
            questionText: questionText,
            options: options.map(String),
            correctAnswerIndex: correctAnswerIndex
        };
    }
    else if (questionType === 'vertex_y') {
        // Pergunta a coordenada y do vértice
        // Ajusta b para ter divisão exata
        const adjusted_b = utils.random(-3, 3) * (2 * a);
        const xv = -adjusted_b / (2 * a);
        const yv = a * (xv**2) + adjusted_b * xv + c;
        questionText = `What is the y-coordinate of the vertex of the parabola f(x) = ${a}x² + ${adjusted_b}x + ${c}?`;
        correctAnswer = yv;
        options = utils.generateDistractors(correctAnswer, 3, difficulty.VARIACAO_DISTRATORES);
        options.push(correctAnswer);
        utils.shuffleArray(options);
        const correctAnswerIndex = options.indexOf(correctAnswer);
        
        return {
            context: context,
            questionText: questionText,
            options: options.map(String),
            correctAnswerIndex: correctAnswerIndex
        };
    }
    else { // roots
        // Pergunta as raízes da função
        // Gera uma equação com raízes inteiras
        let x1 = utils.random(-4, 4);
        let x2 = utils.random(-4, 4);
        while (x1 === x2) {
            x2 = utils.random(-4, 4);
        }
        
        const a = utils.random(1, 2) * (Math.random() < 0.5 ? -1 : 1);
        const b = -a * (x1 + x2);
        const c = a * x1 * x2;
        
        questionText = `What are the zeros (roots) of the function f(x) = ${a}x² + ${b}x + ${c}?`;
        
        const roots = [x1, x2].sort((a, b) => a - b);
        const correctAnswerStr = `{${roots[0]}, ${roots[1]}}`;
        
        // Gera distrações (pares de números)
        const distractors = new Set();
        while (distractors.size < 3) {
            const d_x1 = x1 + utils.random(-2, 2);
            const d_x2 = x2 + utils.random(-2, 2);
            const distractor_roots = [d_x1, d_x2].sort((a, b) => a - b);
            const distractor_str = `{${distractor_roots[0]}, ${distractor_roots[1]}}`;
            if (distractor_str !== correctAnswerStr) {
                distractors.add(distractor_str);
            }
        }
        
        options = Array.from(distractors);
        options.push(correctAnswerStr);
        utils.shuffleArray(options);
        const correctAnswerIndex = options.indexOf(correctAnswerStr);
        
        return {
            context: context,
            questionText: questionText,
            options: options,
            correctAnswerIndex: correctAnswerIndex
        };
    }
}

// === GERADOR PRINCIPAL DE QUESTÕES ===

/**
 * Gera uma questão baseada na fase atual do jogo
 * Seleciona o tipo apropriado de questão para cada fase
 * 
 * @param {number} phase - Número da fase atual (1-5)
 * @param {number} questionIndex - Índice da questão na fase atual
 * @return {Object} Objeto com a questão, contexto, opções e resposta correta
 */
function generateQuestionWithContext(phase, questionIndex) {
    switch (phase) {
        case 1: // Floresta Encantada - Equações de 1º grau
            return generateEq1WithContext(phase, questionIndex);
            
        case 2: // Montanhas Nebulosas - Funções de 1º grau
            return generateFunc1WithContext(phase, questionIndex);
            
        case 3: // Cavernas Cristalinas - Equações de 2º grau
            return generateEq2WithContext(phase, questionIndex);
            
        case 4: // Cidade Flutuante - Funções de 2º grau
            return generateFunc2WithContext(phase, questionIndex);
            
        case 5: // Castelo do Conhecimento - Mistura de todos os tipos
            // Escolhe aleatoriamente entre os tipos de questões
            const questionType = Math.floor(Math.random() * 4) + 1;
            switch (questionType) {
                case 1: return generateEq1WithContext(phase, questionIndex);
                case 2: return generateFunc1WithContext(phase, questionIndex);
                case 3: return generateEq2WithContext(phase, questionIndex);
                case 4: return generateFunc2WithContext(phase, questionIndex);
            }
            break;
            
        default:
            // Fallback para fase 1 se a fase for inválida
            return generateEq1WithContext(1, questionIndex);
    }
}

// Exporta as funções para uso em outros arquivos
window.questionGenerator = {
    generateQuestionWithContext: generateQuestionWithContext,
    // Exporta também os geradores específicos para possível uso direto
    generateEq1WithContext: generateEq1WithContext,
    generateFunc1WithContext: generateFunc1WithContext,
    generateEq2WithContext: generateEq2WithContext,
    generateFunc2WithContext: generateFunc2WithContext
};
