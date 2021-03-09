const initialState = { currentView: 'home', charFilter: 'all', charSort: 'default', searchQuery: '' };
let state = initialState;

function setState(key, value) {
    if (!key || !value) return;
    const newState = state;
    newState[key] = value;
    state = newState;
    return render();
}

function render() {
    const { currentView, charFilter, charSort, searchQuery } = state;

    if (currentView === 'home') {
        let activeCharacters = getFavoriteCharacters();
        let currentCharacters = activeCharacters;
        if (searchQuery) currentCharacters = searchCharacters(searchQuery, activeCharacters);
        currentCharacters = filterCharacters(charFilter, currentCharacters);
        currentCharacters = sortCharacters(charSort, currentCharacters);
        renderHomeComponent(currentCharacters, activeCharacters);
    }
    if (currentView === 'favorites')
}

function renderHomeComponent(cardData, countData) {
    pageTitle.style.display = 'none';
    filterBar.style.display = '';
    renderCharacterCards(cardData);
    updateCounts(countData);
}

function renderCharacterCards(data) {
    let cards = '';
    data.forEach(character => {
        const newCard = characterCardTemplate(character);
        cards += newCard;
    });
    characterGrid.innerHTML = cards;
}

function renderDetailModal(id) {
    const character = characters.filter(char => char.char_id === id);
    const { name, nickname, img, status, occupation, portrayed } = character[0];
    let rating = 0;
    if (state['currentView'] === 'favorites') rating = favoriteCharacters.filter(char => char.id === id)[0].rating;

    const charObj = {
        id: id, name: name, nickname: nickname, img: img, status: status, occupation: occupation, portrayed: portrayed, rating: rating
    }

    const modalDiv = document.createElement('div');
    modalDiv.classList.add('modal-overlay');
    modalDiv.innerHTML = characterModal(charObj);
    mainContainer.appendChild(modalDiv);
}