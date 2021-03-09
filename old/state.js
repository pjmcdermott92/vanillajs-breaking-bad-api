const initialState = { currentView: 'home', charFilter: 'all', charSort: 'default', searchQuery: '' };
let state = initialState;

function setState(key, value, callback) {
    if (!key || !value) return;
    const newState = state;
    newState[key] = value;
    state = newState;

    return callback();
}

function renderCharacterCards(data) {
    let cards = '';
    data.forEach(character => {
        const newCard = characterCardTemplate(character);
        cards += newCard;
    });
    characterGrid.innerHTML = cards;
}

// Character Functions
function handleRemoveFavoriteCharacter(id) {
    removeFavoriteCharacter(id);
    renderFavoritesComponent();
}

function handleAddFavoriteCharacter(id) {
    addFavoriteCharacter(id);
    if (currentPage === 'home') renderHomeComponent(filterFavoriteCharacters(), filterFavoriteCharacters());
    if (currentPage === 'favorites') renderFavoritesComponent();
}

function handleShowCharacterDetails(id) {
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

function handleCloseModal() {
    const modal = document.getElementsByClassName('modal-overlay')[0];
    mainContainer.removeChild(modal);
}

// Render Home Component
function renderHomeComponent(cardData, countData) {
    pageTitle.style.display = 'none';
    filterBar.style.display = '';
    renderCharacterCards(cardData);
    updateCounts(countData);
}

function renderFavoritesComponent() {
    const numFavCharacters = favoriteCharacters.length;
    pageTitle.innerHTML = `<h2>Favorite Characters (${numFavCharacters})</h2>`;
    pageTitle.style.display = 'block';
    filterBar.style.display = 'none';
    
    const populatedFavorites = () => {
        if (favoriteCharacters.length < 1) return;
        let favoriteChars = [];
        favoriteCharacters.forEach(fav => {
            const character = characters.filter(char => char.char_id === fav.id);
            const { char_id, status, img, name, nickname } = character[0];
            const newCharObj = {
                char_id: char_id, status: status, img: img, name: name, nickname: nickname, rating: fav.rating
            };
            favoriteChars.push(newCharObj);
        })
        return favoriteChars;
    }

    if (favoriteCharacters.length < 1) {
        characterGrid.innerHTML = '<p>You have not saved any Favorite Characters yet.';
        return
    } else {
        renderCharacterCards(populatedFavorites())
    }
}