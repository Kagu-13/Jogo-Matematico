/**
 * config.js
 * ------------------------------
 * Configurações centralizadas do jogo matemático com tema RPG
 * Contém constantes, textos e configurações que podem ser facilmente editadas
 */

// === CONFIGURAÇÕES GERAIS DO JOGO ===

/**
 * Configurações básicas do jogo
 * Altere estes valores para modificar o comportamento geral do jogo
 */
const CONFIG = {
    // Número de vidas (poções) iniciais do jogador
    VIDAS_INICIAIS: 3,
    
    // Número total de fases/reinos no jogo
    TOTAL_FASES: 5,
    
    // Número de questões necessárias para completar cada fase
    QUESTOES_POR_FASE: 5,
    
    // Dificuldade das questões (afeta a complexidade dos números)
    DIFICULDADE: {
        FACIL: {
            MIN_NUMERO: -5,
            MAX_NUMERO: 5,
            VARIACAO_DISTRATORES: 5
        },
        MEDIA: {
            MIN_NUMERO: -10,
            MAX_NUMERO: 10,
            VARIACAO_DISTRATORES: 10
        },
        DIFICIL: {
            MIN_NUMERO: -20,
            MAX_NUMERO: 20,
            VARIACAO_DISTRATORES: 15
        }
    },
    
    // Tempo de espera (ms) entre questões após resposta
    TEMPO_ENTRE_QUESTOES: 1500,
    
    // Tempo de espera (ms) para animações
    TEMPO_ANIMACAO: 500
};

// === TEXTOS E NARRATIVAS ===

/**
 * Informações sobre os reinos (fases)
 * Cada reino tem um nome, descrição e tipo de questões
 */
const REINOS = [
    {
        id: 1,
        nome: "Enchanted Forest",
        descricao: "A mystical place where trees whisper linear equations.",
        tipo: "equacao1"
    },
    {
        id: 2,
        nome: "Misty Mountains",
        descricao: "Nebulous peaks where linear functions determine safe paths.",
        tipo: "funcao1"
    },
    {
        id: 3,
        nome: "Crystal Caves",
        descricao: "Glittering caves where crystals form quadratic equations.",
        tipo: "equacao2"
    },
    {
        id: 4,
        nome: "Floating City",
        descricao: "A city in the clouds where quadratic functions control trajectories.",
        tipo: "funcao2"
    },
    {
        id: 5,
        nome: "Castle of Knowledge",
        descricao: "Home of the Great Mage Algebrius, guardian of all mathematical lore.",
        tipo: "misto"
    }
];

/**
 * Narrativas para contextualizar as questões em cada reino
 * Cada reino tem múltiplas narrativas que são usadas para diferentes questões
 */
const NARRATIVAS = {
    // Floresta Encantada - Equações de 1º grau
    1: [
        "As you enter the Enchanted Forest, an ancient tree guards the first crystal. It whispers a riddling equation you must solve to proceed.",
        "A group of guardian sprites blocks your path. To prove your worth they ask you to solve a magical linear equation controlling the plants' growth.",
        "A magical stream runs through the forest. To cross it you must calculate the exact number of stones to form a safe bridge.",
        "A druid protector tests your knowledge. He draws mystic symbols that form an equation you must decode.",
        "Before the crystal altar, a final protective sigil appears. Solve the inscribed equation to release the first Crystal of Knowledge."
    ],
    
    // Montanhas Nebulosas - Funções de 1º grau
    2: [
        "In the Misty Mountains, an old cartographer explains that to find a safe path you must understand how altitude changes with distance.",
        "A swaying suspension bridge hangs over an abyss. To cross safely you need to calculate the slope at key points.",
        "A band of dwarf miners needs help computing the depth of a new tunnel. They show a graph that you must interpret.",
        "A giant eagle offers to carry you across a dangerous stretch, but you must calculate the optimal trajectory so it won't tire.",
        "At the highest peak, where the second crystal rests, you face a puzzle linking temperature and altitude. Solve it to claim the crystal."
    ],
    
    // Cavernas Cristalinas - Equações de 2º grau
    3: [
        "In the Crystal Caves, shining crystals form mathematical patterns. A crystal guardian asks you to solve an equation to harmonize the energies.",
        "An underground lake reflects perfect geometric forms. To cross it you must compute the roots of an equation that controls the water level.",
        "Stalactites and stalagmites grow following precise patterns. Discover the equation that determines where they meet.",
        "An ancient stone mechanism blocks your way. The gears follow a quadratic relation that you must decipher to activate it.",
        "The chamber of the third crystal is guarded by a parabolic force field. Find its weak points by solving the equation that describes it."
    ],
    
    // Cidade Flutuante - Funções de 2º grau
    4: [
        "In the Floating City, platforms move along parabolic paths. A local sage asks you to compute the highest point of one to proceed.",
        "Light bridges connect floating buildings. To activate one you must determine the function that describes its perfect arc.",
        "An eccentric inventor designed a transport system that launches capsules between towers. Help him calculate the ideal trajectory for a crucial delivery.",
        "The city's levitation depends on energy crystals placed at specific points. Determine where to place a replacement crystal using quadratic functions.",
        "The fourth Crystal of Knowledge sits in the central plaza, protected by a riddle linking fountain heights and distances."
    ],
    
    // Castelo do Conhecimento - Mistura de todos os tipos
    5: [
        "In the Castle of Knowledge, the Great Mage Algebrius greets you with a challenge that blends linear and quadratic equations into a single puzzle.",
        "The castle's magical library has moving shelves that follow complex mathematical patterns. Uncover the logic to find the book you seek.",
        "In the artifacts hall, a magic mirror shows distorted reflections via mathematical functions. Determine the correct function to reveal the true image.",
        "The castle clocktower marks time through intricate mathematical relations. Solve the riddle to synchronize the hands correctly.",
        "Before the altar of the final Crystal of Knowledge, the Great Mage presents his ultimate challenge, combining everything you've learned."
    ]
};

/**
 * Textos para as diferentes telas do jogo
 * Facilmente editáveis para personalização
 */
const TEXTOS = {
    // Tela de introdução
    INTRODUCAO: {
        TITULO: "The Beginning of the Journey",
        CONTEUDO: [
            "In a world where numbers and equations shape magic, you are a young apprentice with a special talent for mathematics.",
            "The Great Mage Algebrius summoned you for an important mission: recover the 5 Crystals of Knowledge that were stolen and hidden across five different realms.",
            "Each crystal is protected by mathematical riddles that only a true master can solve.",
            "Your journey begins in the Enchanted Forest, where the first crystal awaits..."
        ],
        BOTAO: "Begin Journey"
    },
    
    // Tela de como jogar
    COMO_JOGAR: {
        TITULO: "How to Play",
        CONTEUDO: [
            "Welcome to the Mathematical Journey, adventurer!",
            "In this magical world you'll use your math skills to overcome challenges and traverse five distinct realms.",
            "Rules:",
            "• You start with 3 life potions",
            "• Each wrong answer consumes one potion",
            "• Get 5 correct challenges to advance to the next realm",
            "• Complete all 5 realms to become the Master of Mathematics",
            "Realms:",
            "• Enchanted Forest: Linear equations",
            "• Misty Mountains: Linear functions",
            "• Crystal Caves: Quadratic equations",
            "• Floating City: Quadratic functions",
            "• Castle of Knowledge: Mixed challenges"
        ],
        BOTAO: "Back to Menu"
    },
    
    // Tela de créditos
    CREDITOS: {
        TITULO: "Credits",
        CONTEUDO: [
            "The Mathematical Journey",
            "An educational game combining math and adventure",
            "Developed: Tulio and Jose Levi",
            "Beta Testers: Ximenes and Francisco Fernandes",
            "Version: 2.5",
        ],
        BOTAO: "Back to Menu"
    },
    
    // Tela de game over
    GAME_OVER: {
        TITULO: "Your Journey Has Ended...",
        CONTEUDO: [
            "Unfortunately your potions are gone and you couldn't complete your mission.",
            "But don't give up! Every great mage fails before achieving mastery.",
            "Would you like to try again?"
        ],
        BOTAO_TENTAR: "Try Again",
        BOTAO_MENU: "Back to Menu"
    },
    
    // Tela de vitória
    VITORIA: {
        TITULO: "Victory!",
        CONTEUDO: [
            "Congratulations, great mage! You recovered all 5 Crystals of Knowledge!",
            "Your mastery of mathematics impressed even the Great Mage Algebrius.",
            "The realms are now safe thanks to your wisdom and courage.",
            "Your legend will be told for generations!"
        ],
        BOTAO_JOGAR: "Play Again",
        BOTAO_MENU: "Back to Menu"
    },
    
    // Feedback para respostas
    FEEDBACK: {
        CORRETO: "Correct! Magic flows through you! ✨",
        INCORRETO: "Incorrect! You lost a magic potion! 💔"
    }
};

// Exporta as configurações para uso em outros arquivos
window.CONFIG = CONFIG;
window.REINOS = REINOS;
window.NARRATIVAS = NARRATIVAS;
window.TEXTOS = TEXTOS;