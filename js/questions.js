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
 * Gera uma questão de equação de 1º grau com contexto narrativo
 * Formato: ax + b = c
 * 
 * @param {number} phaseIndex - Índice da fase atual (1-5)
 * @param {number} questionIndex - Índice da questão na fase atual
 * @return {Object} Objeto com a questão, contexto, opções e resposta correta
 */
function generateEq1WithContext(phaseIndex, questionIndex) {
    // Gera a equação matemática com dificuldade apropriada
    const difficulty = CONFIG.DIFICULDADE.FACIL;
    const a = utils.random(1, 10);
    const b = utils.random(difficulty.MIN_NUMERO, difficulty.MAX_NUMERO);
    const x = utils.random(difficulty.MIN_NUMERO, difficulty.MAX_NUMERO);
    const c = a * x + b;
    
    // Obtém o contexto narrativo para esta questão
    const context = NARRATIVAS[phaseIndex][questionIndex % NARRATIVAS[phaseIndex].length];
    
    // Cria o texto da questão
    const questionText = `Resolva a equação: ${a}x + ${b} = ${c}`;
    
    // Gera as opções e identifica a resposta correta
    const correctAnswer = x;
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
        questionText = `Dada a função f(x) = ${a}x + ${b}, qual o valor de f(${x_val})?`;
        correctAnswer = fx_val;
    } else {
        // Pergunta o valor de x para um f(x) dado
        // Garante que a seja diferente de 0 para poder isolar x
        const a_safe = a === 0 ? (Math.random() < 0.5 ? -1 : 1) : a;
        const fx_val_safe = a_safe * x_val + b;
        questionText = `Dada a função f(x) = ${a_safe}x + ${b}, para qual valor de x temos f(x) = ${fx_val_safe}?`;
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
 * Gera uma questão de equação de 2º grau com contexto narrativo
 * Formato: ax² + bx + c = 0
 * 
 * @param {number} phaseIndex - Índice da fase atual (1-5)
 * @param {number} questionIndex - Índice da questão na fase atual
 * @return {Object} Objeto com a questão, contexto, opções e resposta correta
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
    const correct = formatDecimal(smallest, 2);

    // Build distractors near the correct value, formatted with dot
    const distractors = new Set();
    while (distractors.size < 3) {
        const offset = (random(-5, 5) + Math.random()); // small random offset
        const value = formatDecimal(Number(correct) + offset, 2);
        if (value !== correct) distractors.add(value);
    }

    const options = shuffleArray([correct, ...Array.from(distractors)]);

    const questionText = `Solve: ${a}x² + ${b}x + ${c} = 0. What is the smallest root?`;
    return {
        q: questionText,
        a: correct,
        opcoes: options
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
        questionText = `Dada a função f(x) = ${a}x² + ${b}x + ${c}, qual o valor de f(${x_val})?`;
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
        questionText = `Qual a coordenada x do vértice da parábola f(x) = ${a}x² + ${adjusted_b}x + ${c}?`;
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
        questionText = `Qual a coordenada y do vértice da parábola f(x) = ${a}x² + ${adjusted_b}x + ${c}?`;
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
        
        questionText = `Quais são os zeros (raízes) da função f(x) = ${a}x² + ${b}x + ${c}?`;
        
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