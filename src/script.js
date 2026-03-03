let games = [];
let activeCategory = 'All';
let searchQuery = '';

const gamesGrid = document.getElementById('games-grid');
const categoriesContainer = document.getElementById('categories-container');
const searchInput = document.getElementById('search-input');
const noResults = document.getElementById('no-results');
const gameModal = document.getElementById('game-modal');
const closeModal = document.getElementById('close-modal');
const gameIframe = document.getElementById('game-iframe');
const modalTitle = document.getElementById('modal-title');
const modalThumb = document.getElementById('modal-thumb');
const modalCategory = document.getElementById('modal-category');
const modalFullscreen = document.getElementById('modal-fullscreen');
const playerCount = document.getElementById('player-count');
const logo = document.getElementById('logo');
const likeBtn = document.getElementById('like-btn');
const dislikeBtn = document.getElementById('dislike-btn');
const likeCount = document.getElementById('like-count');
const dislikeCount = document.getElementById('dislike-count');

// Ratings state
let ratings = JSON.parse(localStorage.getItem('nexus_ratings') || '{}');
lucide.createIcons();

// Fetch Games Data
async function init() {
    try {
        const response = await fetch('./games.json');
        games = await response.json();
        renderCategories();
        renderGames();
    } catch (error) {
        console.error('Error loading games:', error);
    }
}

function renderCategories() {
    const categories = ['All', ...new Set(games.map(g => g.category))];
    categoriesContainer.innerHTML = categories.map(cat => `
        <button
            class="px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                activeCategory === cat 
                ? 'bg-emerald-500 text-black' 
                : 'bg-zinc-900 text-zinc-400 hover:bg-zinc-800 hover:text-white border border-white/5'
            }"
            onclick="setCategory('${cat}')"
        >
            ${cat}
        </button>
    `).join('');
}

function renderGames() {
    const filtered = games.filter(game => {
        const matchesSearch = game.title.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = activeCategory === 'All' || game.category === activeCategory;
        return matchesSearch && matchesCategory;
    });

    if (filtered.length === 0) {
        gamesGrid.innerHTML = '';
        noResults.classList.remove('hidden');
    } else {
        noResults.classList.add('hidden');
        gamesGrid.innerHTML = filtered.map(game => `
            <div
                class="group relative bg-zinc-900 rounded-2xl overflow-hidden border border-white/5 cursor-pointer transition-transform hover:-translate-y-1"
                onclick="openGame('${game.id}')"
            >
                <div class="aspect-[4/3] relative overflow-hidden">
                    <img 
                        src="${game.thumbnail}" 
                        alt="${game.title}" 
                        class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        referrerpolicy="no-referrer"
                    >
                    <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                        <span class="bg-emerald-500 text-black text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">
                            Play Now
                        </span>
                    </div>
                </div>
                <div class="p-3">
                    <h3 class="font-bold text-sm truncate group-hover:text-emerald-400 transition-colors">${game.title}</h3>
                    <div class="flex items-center justify-between mt-1">
                        <span class="text-[10px] text-zinc-500 uppercase font-semibold tracking-widest">${game.category}</span>
                        <div class="flex items-center gap-1 text-zinc-600">
                            <i data-lucide="clock" class="w-3 h-3"></i>
                            <span class="text-[10px]">Just added</span>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');
        lucide.createIcons();
    }
}

window.setCategory = (cat) => {
    activeCategory = cat;
    renderCategories();
    renderGames();
};

window.openGame = (id) => {
    const game = games.find(g => g.id === id);
    if (!game) return;

    modalTitle.innerText = game.title;
    modalCategory.innerText = game.category;
    modalThumb.src = game.thumbnail;
    gameIframe.src = game.url;
    playerCount.innerText = Math.floor(Math.random() * 2000 + 500).toLocaleString();
    
    // Update ratings UI
    updateRatingsUI(id);
    
    gameModal.classList.remove('hidden');
    gameModal.classList.add('flex');
    document.body.style.overflow = 'hidden';
};

function updateRatingsUI(id) {
    const gameRatings = ratings[id] || { likes: 0, dislikes: 0, userRating: null };
    likeCount.innerText = gameRatings.likes;
    dislikeCount.innerText = gameRatings.dislikes;
    
    // Reset classes
    likeBtn.classList.remove('bg-emerald-500/20', 'text-emerald-500', 'border-emerald-500/30');
    dislikeBtn.classList.remove('bg-red-500/20', 'text-red-500', 'border-red-500/30');
    
    if (gameRatings.userRating === 'like') {
        likeBtn.classList.add('bg-emerald-500/20', 'text-emerald-500', 'border-emerald-500/30');
    } else if (gameRatings.userRating === 'dislike') {
        dislikeBtn.classList.add('bg-red-500/20', 'text-red-500', 'border-red-500/30');
    }
}

function handleRating(id, type) {
    if (!ratings[id]) {
        ratings[id] = { likes: 0, dislikes: 0, userRating: null };
    }
    
    const gameRatings = ratings[id];
    
    if (gameRatings.userRating === type) {
        // Toggle off
        gameRatings.userRating = null;
        if (type === 'like') gameRatings.likes--;
        else gameRatings.dislikes--;
    } else {
        // Switch or set
        if (gameRatings.userRating === 'like') gameRatings.likes--;
        if (gameRatings.userRating === 'dislike') gameRatings.dislikes--;
        
        gameRatings.userRating = type;
        if (type === 'like') gameRatings.likes++;
        else gameRatings.dislikes++;
    }
    
    localStorage.setItem('nexus_ratings', JSON.stringify(ratings));
    updateRatingsUI(id);
}

function closeGameModal() {
    gameModal.classList.add('hidden');
    gameModal.classList.remove('flex');
    gameIframe.src = '';
    document.body.style.overflow = '';
}

// Event Listeners
searchInput.addEventListener('input', (e) => {
    searchQuery = e.target.value;
    renderGames();
});

closeModal.addEventListener('click', closeGameModal);

likeBtn.addEventListener('click', () => {
    const activeGame = games.find(g => g.url === gameIframe.src);
    if (activeGame) handleRating(activeGame.id, 'like');
});

dislikeBtn.addEventListener('click', () => {
    const activeGame = games.find(g => g.url === gameIframe.src);
    if (activeGame) handleRating(activeGame.id, 'dislike');
});

logo.addEventListener('click', () => {
    activeCategory = 'All';
    searchQuery = '';
    searchInput.value = '';
    renderCategories();
    renderGames();
});

modalFullscreen.addEventListener('click', () => {
    if (gameIframe.requestFullscreen) {
        gameIframe.requestFullscreen();
    } else if (gameIframe.webkitRequestFullscreen) {
        gameIframe.webkitRequestFullscreen();
    } else if (gameIframe.msRequestFullscreen) {
        gameIframe.msRequestFullscreen();
    }
});

// Close on background click
gameModal.addEventListener('click', (e) => {
    if (e.target === gameModal) closeGameModal();
});

// Init
init();
