const images = [
    'images/img1.png', 'images/img2.png', 'images/img3.png', 'images/img4.png', 'images/img5.png',
    'images/img6.png', 'images/img7.png', 'images/img8.png', 'images/img9.png', 'images/img10.png',
    'images/img1.png', 'images/img2.png', 'images/img3.png', 'images/img4.png', 'images/img5.png',
    'images/img6.png', 'images/img7.png', 'images/img8.png', 'images/img9.png', 'images/img10.png'
];

let cardValues = [];
let cardIds = [];
let matchedCards = [];
let timer;
let timeLeft = 60;
let gameStarted = false;
let gamePaused = false;
let canFlip = true; // Variável para controlar se cartas podem ser viradas

function initGame() {
    matchedCards = [];
    cardValues = shuffle(images); // Embaralha as imagens toda vez que o jogo começa
    cardIds = [];
    timeLeft = 60;
    document.getElementById('game-board').innerHTML = '';
    createBoard();
    startTimer();
    gameStarted = true;
    gamePaused = false;
    canFlip = true; // Permite virar cartas ao iniciar o jogo
    document.getElementById('popup').classList.add('hidden'); // Oculta popup ao iniciar o jogo
}

function createBoard() {
    const board = document.getElementById('game-board');
    for (let i = 0; i < cardValues.length; i++) {
        const card = document.createElement('div');
        card.classList.add('card');
        card.setAttribute('data-id', i);

        const img = document.createElement('img');
        img.src = cardValues[i];
        img.alt = `Imagem ${i+1}`;
        card.appendChild(img);

        card.addEventListener('click', flipCard);
        board.appendChild(card);
    }
}

function shuffle(array) {
    let currentIndex = array.length, randomIndex;
    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
    return array;
}

function flipCard() {
    if (!gameStarted || gamePaused || !canFlip) return; // Ignora cliques se o jogo não estiver iniciado, estiver pausado ou não puder virar cartas

    const selectedCard = this;
    const selectedId = selectedCard.getAttribute('data-id');

    if (cardIds.length === 2 || cardIds.includes(selectedId)) return;

    selectedCard.classList.add('flipped');
    cardIds.push(selectedId);
    cardValues.push(selectedCard.querySelector('img').src);

    if (cardIds.length === 2) {
        canFlip = false; // Bloqueia a virada de novas cartas
        setTimeout(checkMatch, 500);
    }
}

function checkMatch() {
    const cards = document.querySelectorAll('.card');
    const [firstId, secondId] = cardIds;
    const [firstValue, secondValue] = cardValues;

    if (firstValue === secondValue) {
        matchedCards.push(firstId, secondId);
        document.getElementById('pairs-count').textContent = `Pares encontrados: ${matchedCards.length / 2}`;
    } else {
        // Se não houver correspondência, remove a classe 'flipped' das cartas
        setTimeout(() => {
            cards[firstId].classList.remove('flipped');
            cards[secondId].classList.remove('flipped');
        }, 500);
    }

    cardIds = [];
    cardValues = [];
    canFlip = true; // Permite virar novas cartas

    // Verifica se todos os pares foram encontrados
    if (matchedCards.length === images.length) {
        clearInterval(timer);
        document.getElementById('popup-message').innerHTML = '<h2>Parabéns!</h2><p>Você encontrou todos os pares!</p>';
        document.getElementById('popup').classList.remove('hidden');
    }
}

function startTimer() {
    if (timer) clearInterval(timer);
    timer = setInterval(() => {
        if (timeLeft <= 0) {
            clearInterval(timer);
            // Remover mensagem de tempo esgotado
            if (matchedCards.length === images.length) {
                // Mostrar mensagem de vitória se todos os pares foram encontrados antes do tempo acabar
                document.getElementById('popup-message').innerHTML = '<h2>Parabéns!</h2><p>Você encontrou todos os pares!</p>';
                document.getElementById('popup').classList.remove('hidden');
            }
        } else {
            timeLeft--;
            document.getElementById('timer').textContent = `Tempo restante: ${timeLeft}s`;
        }
    }, 1000);
}

document.getElementById('start-btn').addEventListener('click', initGame);

document.getElementById('popup-close').addEventListener('click', () => {
    document.getElementById('popup').classList.add('hidden');
});

document.getElementById('pause-btn').addEventListener('click', () => {
    if (!gameStarted) return; // Não faz nada se o jogo não estiver iniciado
    if (gamePaused) {
        startTimer();
        document.getElementById('pause-btn').textContent = 'Pausar';
        gamePaused = false;
    } else {
        clearInterval(timer);
        document.getElementById('pause-btn').textContent = 'Retomar';
        gamePaused = true;
    }
});
