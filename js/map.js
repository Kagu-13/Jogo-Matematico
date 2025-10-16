/**
 * map.js
 * ------------------------------
 * Implementação do mapa de progresso entre fases do jogo matemático RPG
 * Responsável por exibir o mapa, atualizar o progresso e gerenciar transições entre fases
 * 
 * Dependências: config.js, utils.js
 */

// === GERENCIAMENTO DO MAPA DE PROGRESSO ===

/**
 * Inicializa o mapa de progresso
 * Configura os elementos do mapa e prepara os eventos
 */
function initializeMap() {
    // Elementos do mapa
    const mapScreen = document.getElementById('map-screen');
    const continueJourneyBtn = document.getElementById('continue-journey');
    const progressText = document.getElementById('progress-text');
    
    // Referências aos reinos no mapa
    const realms = [];
    for (let i = 1; i <= CONFIG.TOTAL_FASES; i++) {
        realms.push(document.getElementById(`realm-${i}`));
    }
    
    // Adiciona evento ao botão de continuar jornada
    if (continueJourneyBtn) {
        continueJourneyBtn.addEventListener('click', function() {
            // Esconde o mapa
            utils.fadeOut(mapScreen, CONFIG.TEMPO_ANIMACAO, function() {
                // Se completou todas as fases, mostra a tela de vitória
                if (gameState.completedPhases >= gameState.totalPhases) {
                    showVictory();
                } else {
                    // Caso contrário, carrega a próxima fase
                    loadPhase(gameState.currentPhase);
                }
            });
        });
    }
    
    // Exporta funções e elementos para uso global
    window.mapElements = {
        mapScreen,
        continueJourneyBtn,
        progressText,
        realms
    };
}

/**
 * Atualiza o mapa com o progresso atual do jogador
 * Marca reinos completados, atuais e bloqueados
 */
function updateMap() {
    // Verifica se o mapa foi inicializado
    if (!window.mapElements) {
        console.error('Map not initialized');
        return;
    }
    
    const { mapScreen, progressText, realms } = window.mapElements;
    
    // Atualiza o texto de progresso
    if (progressText) {
        progressText.textContent = `${gameState.completedPhases}/${gameState.totalPhases}`;
    }
    
    // Atualiza o status visual de cada reino
    for (let i = 0; i < realms.length; i++) {
        const realm = realms[i];
        if (!realm) continue;
        
        const realmStatus = realm.querySelector('.realm-status');
        
        // Remove classes anteriores
        realm.classList.remove('completed', 'current', 'locked');
        
        if (i < gameState.currentPhase - 1) {
            // Realm already completed
            if (realmStatus) realmStatus.textContent = 'Completed';
            realm.classList.add('completed');
        } else if (i === gameState.currentPhase - 1) {
            // Current realm
            if (realmStatus) realmStatus.textContent = 'Current';
            realm.classList.add('current');
        } else {
            // Locked realm
            if (realmStatus) realmStatus.textContent = 'Locked';
            realm.classList.add('locked');
        }
    }
    
    // Atualiza o botão de continuar jornada
    const { continueJourneyBtn } = window.mapElements;
    if (continueJourneyBtn) {
        if (gameState.currentPhase > gameState.totalPhases) {
            continueJourneyBtn.textContent = 'View Final Result';
        } else {
            continueJourneyBtn.textContent = 'Continue Journey';
        }
    }
}

/**
 * Mostra o mapa com animação de fade-in
 * Atualiza o mapa antes de exibi-lo
 */
function showMapWithAnimation() {
    // Verifica se o mapa foi inicializado
    if (!window.mapElements) {
        console.error('O mapa não foi inicializado');
        return;
    }
    
    const { mapScreen } = window.mapElements;
    
    // Primeiro atualiza o mapa
    updateMap();
    
    // Depois mostra a tela com animação
    utils.fadeIn(mapScreen, CONFIG.TEMPO_ANIMACAO);
}

/**
 * Avança para a próxima fase do jogo
 * Incrementa a fase atual e o contador de fases completadas
 */
function advanceToNextPhase() {
    // Incrementa a fase atual e o contador de fases completadas
    gameState.currentPhase++;
    gameState.completedPhases++;
    
    // Salva o estado atualizado
    utils.saveGameState(gameState);
    
    // Mostra o mapa atualizado
    showMapWithAnimation();
}

/**
 * Obtém informações do reino atual
 * Retorna nome e descrição do reino baseado na fase atual
 * 
 * @return {Object} Objeto com nome e descrição do reino atual
 */
function getCurrentRealmInfo() {
    const phaseIndex = gameState.currentPhase - 1;
    if (phaseIndex >= 0 && phaseIndex < REINOS.length) {
        return {
            name: REINOS[phaseIndex].nome,
            description: REINOS[phaseIndex].descricao
        };
    }
    
    // Fallback para reino desconhecido
    return {
        name: 'Unknown Realm',
        description: 'A mysterious place beyond the known map.'
    };
}

// Exporta as funções para uso em outros arquivos
window.mapFunctions = {
    initializeMap,
    updateMap,
    showMapWithAnimation,
    advanceToNextPhase,
    getCurrentRealmInfo
};
