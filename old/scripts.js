const menuToggleBtn = document.querySelector('[data-menu-toggle]');
const navMenu = document.querySelector('[data-nav-menu]');
const navLinks = document.querySelectorAll('[data-link]');
const contentSection = document.querySelector('[data-content-section]');
const pageTitle = document.querySelector('[data-page-title]');
const filterBar = document.querySelector('[data-filter-options-container]');
const filterLinks = document.querySelectorAll('[data-filter]');
const sortLinks = document.querySelectorAll('[data-sort]');
const itemCounts = document.querySelectorAll('[data-count]');
const searchInput = document.getElementById('search');
const searchIcon = document.querySelector('[data-search-icon]');
const characterGrid = document.querySelector('[data-character-grid]');
const mainContainer = document.getElementsByTagName('main')[0];
const toTopBtn = document.querySelector('[data-top-btn]');

const API_URL = 'https://breakingbadapi.com/api/characters?limit=31';
const favoriteCharactersStorage = 'breakingBadApiApp.favoriteCharacters';
let characters = [], favoriteCharacters = [];

menuToggleBtn.addEventListener('click', () => {
    menuToggleBtn.classList.toggle('menu-active');
    navMenu.classList.toggle('menu-active');
});

toTopBtn.addEventListener('click', () => {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
})

window.addEventListener('scroll', () => {
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        toTopBtn.style.display = 'flex';
    } else {
        toTopBtn.style.display = 'none';
    }
})

async function fetchCharacters() {
    try {
        let rest = await fetch(API_URL);
        characters = await rest.json();
    } catch (err) {
        console.error(err);
    }
    getFavoriteCharacters();
    render();
}

function getFavoriteCharacters() {
    favoriteCharacters = JSON.parse(localStorage.getItem(favoriteCharactersStorage));
    if (favoriteCharacters === null) favoriteCharacters = [];
    return characters.filter(char => favoriteCharacters.every(fav => fav.id !== char.char_id));
}

function render() {
    let activeCharacters= getFavoriteCharacters();
    if (state['searchQuery'] = '') {
        activeCharacters = filterCharacters(state['charFilter']);
        activeCharacters = sortCharacters(state['sort']);
    }

    if (state['currentView'] === 'home') return renderHomeComponent(activeCharacters, activeCharacters);
    if (state['currentView'] === 'favorites') return renderFavoritesComponent();
}

function updateCounts(data) {
    itemCounts.forEach(item => {
        const filteredCharacters = data.filter(char => char.status.toUpperCase() === item.dataset.count.toUpperCase());
        item.innerText = filteredCharacters.length;
        if (item.dataset.count === 'all') item.innerText = data.length;
    })
}



// fetchCharacters();