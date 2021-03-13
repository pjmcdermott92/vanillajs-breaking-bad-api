const initialState = { currentView: 'home', filter: 'all', sort: 'default', searchQuery: 'none'}
let state = initialState;

function setState(key, value) {
    if (!key || !value) return;
    const newState = state;
    newState[key] = value;
    state = newState;

    return render();
}

function render() {
    const { currentView, filter, sort, searchQuery } = state;
    if (currentView === 'home') {
        setPageTitle('Home', false);
        filterBar.style.display = '';
        const activeCharacters = filterFavoriteCharacters();
        let currentCharacters;
        if (searchQuery !== 'none') {
            currentCharacters = searchCharacters(searchQuery, activeCharacters);
            updateCounts(currentCharacters);
        } else {
            currentCharacters = activeCharacters;
            updateCounts(currentCharacters); 
        }

        currentCharacters = filterCharacters(filter, currentCharacters);
        currentCharacters = sortCharacters(sort, currentCharacters);
        if(currentCharacters.length === 0) return characterGrid.innerHTML = '<p>There are no characters to display.</p>'
        renderCharacterCards(currentCharacters);
        updateFilterLinks();
        updateSortLinks();
    }

    if (currentView === 'about') {
        setPageTitle('About this Application', true);
        filterBar.style.display = 'none';
        characterGrid.innerHTML = getAboutPageContent();
    }

    if (currentView === 'favorites') {
        setPageTitle('Favorite Characters', true);
        filterBar.style.display = 'none';
        if (favoriteCharacters.length === 0) return characterGrid.innerHTML = '<p>You have not saved any Favorite Characters yet.</p>';
        const populatedFavorites = () => {
            let currentCharacters = [];
            favoriteCharacters.forEach(fav => {
                const character = characters.filter(char => char.char_id === fav.id);
                const { char_id, status, img, name, nickname } = character[0];
                const newCharObj = {
                    char_id: char_id, status: status, img: img, name: name, nickname: nickname, rating: fav.rating
                };
                currentCharacters.push(newCharObj);
            })
            return currentCharacters;
        }
        renderCharacterCards(populatedFavorites());
    }
}

function renderCharacterCards(data) {
    let cards = '';
    data.forEach(character => {
        const newCard = getCharacterCardTemplate(character);
        cards += newCard;
    });
    characterGrid.innerHTML = cards;
}

function setPageTitle(value, show) {
    pageTitle.innerHTML = `<h2>${value}</h2>`;
    show ? pageTitle.style.display = 'block' : pageTitle.style.display = 'none';
}

function updateFilterLinks() {
    filterLinks.forEach(link => {
        link.classList.remove('active');
        if( link.dataset.filter === state.filter) link.classList.add('active');
    });
}

function updateSortLinks() {
    sortLinks.forEach(link => {
        link.classList.remove('active');
        const sort = link.dataset.sort;
        sort === state.sort && link.classList.add('active');
    })
}

function handleSearchInput() {
    const query = searchInput.value.toUpperCase().trim();
    if(searchInput.value.length === 0) {
        setState('searchQuery', 'none');
        searchIcon.innerHTML = `<i class="fas fa-search"></i>`;
    } else {
        setState('searchQuery', query);
        searchIcon.innerHTML = `<i class="fas fa-times"></i>`;
    }
}

function handleDetailModal(id) {
    const character = characters.filter(char => char.char_id === id);
    const { name, nickname, img, status, occupation, portrayed } = character[0];
    let rating = 0;
    if (state.currentView === 'favorites') rating = favoriteCharacters.filter(char => char.id === id)[0].rating;

    const charObj = {
        id: id, name: name, nickname: nickname, img: img, status: status, occupation: occupation, portrayed: portrayed, rating: rating
    }

    const modalDiv = document.createElement('div');
    modalDiv.classList.add('modal-overlay');
    modalDiv.innerHTML = getCharacterModalTemplate(charObj);
    mainContainer.appendChild(modalDiv);
}

function handleCloseModal() {
    const modal = document.getElementsByClassName('modal-overlay')[0];
    mainContainer.removeChild(modal);
}

function handleAddFavoriteCharacter(id) {
    addFavoriteCharacter(id);
    render();
    pushMessage('Character added to Favorites!');
}

function handleRemoveFavoriteCharacter(id) {
    removeFavoriteCharacter(id);
    render();
    pushMessage('Character removed from Favorites!');
}

function handleChangeRating(id, rating) {
    favoriteCharacters.find(char => char.id === id).rating = rating;
    saveFavoriteCharacters(favoriteCharacters);
    render();
    
    const stars = document.querySelectorAll('[data-star]');
    stars.forEach(star => star.classList.remove('selected'));
    for (i = 0; i < rating; i++) {
        stars[i].classList.add('selected');
    }
}

function handleAddFavorite(id) {
    handleAddFavoriteCharacter(id);
    handleCloseModal();
}

function handleRemoveFavorite(id) {
    handleRemoveFavoriteCharacter(id);
    handleCloseModal();
}

function pushMessage(message) {
    const msg = document.createElement('div');
    msg.classList.add('user-message');
    msg.setAttribute('data-push-message', 'message');
    msg.innerText = message;
    mainContainer.appendChild(msg);
    removePushMessage();
}

function removePushMessage() {
    const message = document.querySelector('[data-push-message]');
    setTimeout(() => {
        mainContainer.removeChild(message);
    }, 4000);
}