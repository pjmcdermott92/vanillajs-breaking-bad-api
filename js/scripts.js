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

for (link of navLinks) {
    link.addEventListener('click', e => {
        menuToggleBtn.classList.remove('menu-active');
        navMenu.classList.remove('menu-active');
        const currentLink = e.target.dataset.link;
        if (state['currentView'] === currentLink) return;
        setState('currentView', currentLink);
    })
}

searchInput.addEventListener('input', () => handleSearchInput())

searchIcon.addEventListener('click', () => {
    searchInput.value = '';
    handleSearchInput();
})

for (link of filterLinks) {
    link.addEventListener('click', e => setState('filter', e.target.dataset.filter));
}

for (link of sortLinks) {
    link.addEventListener('click', e => setState('sort', e.target.dataset.sort));
}

async function fetchCharacters() {
    try {
        let res = await fetch(API_URL);
        characters = await res.json();
    } catch (err) {
        console.error(err);
        return;
    }
    render();
}

function filterFavoriteCharacters() {
    favoriteCharacters = JSON.parse(localStorage.getItem(favoriteCharactersStorage));
    if (favoriteCharacters === null) favoriteCharacters = [];
    const filteredData = characters.filter(char => favoriteCharacters.every(fav => fav.id !== char.char_id));
    return filteredData;
}

function addFavoriteCharacter(id) {
    favoriteCharacters.forEach(char => {if (char.id === id) return});
    const charObj = { id: id, rating: 0 };
    const newList = [ ...favoriteCharacters, charObj ];
    saveFavoriteCharacters(newList);
}

function removeFavoriteCharacter(id) {
    const newList = favoriteCharacters.filter(char => char.id !== id);
    saveFavoriteCharacters(newList);
    favoriteCharacters = newList;
}

function saveFavoriteCharacters(characterList) {
    localStorage.setItem(favoriteCharactersStorage, JSON.stringify(characterList));
}

function searchCharacters(query, data) {
    const result = data.filter(character => character.name.toUpperCase().includes(query) || character.nickname.toUpperCase().includes(query));
    return result;
}

function filterCharacters(filter, data) {
    if (filter === 'all') return data;
    filter = filter.toUpperCase();
    const filteredData = data.filter(char => char.status.toUpperCase() === filter);
    return filteredData;
}

function sortCharacters(order, data) {
    if (order === 'default') return data;
    const filteredData = data.sort((a, b) => {
        if (order === 'asc' && a.nickname < b.nickname) return -1;
        if (order === 'dsc' && a.nickname > b.nickname) return -1;
    });
    return filteredData;
}

function updateCounts(data) {
    itemCounts.forEach(item => {
        const count = item.dataset.count;
        const filteredData = data.filter(char => char.status.toUpperCase() === count.toUpperCase());
        item.innerText = filteredData.length;
        if (count === 'all') item.innerText = data.length;    
    })
}

fetchCharacters();