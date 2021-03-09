function characterCardTemplate(character) {
    const favoriteChar = favoriteCharacters.filter(char => char.id === character.char_id);
    const { char_id, name, nickname, status, img } = character;
    const characterRating = () => {
        if (state['currentView'] !== 'favorites') return '';
        const rating = favoriteChar[0].rating;
        const starIcons = rating === 0 ? '(not rated)' : '<i class="fas fa-star"></i>'.repeat(rating);
        return `
            <div class="char-rating">
                Rating: ${starIcons}
            </div>
        `;
    }

    const favoriteActionBtn = () => {
        if(favoriteChar.length > 0) {
            return `<div class="btn btn-outline" onClick="handleRemoveFavoriteCharacter(${char_id})"><i class="fas fa-ban"></i> Remove Favorite</div>`
        }
        return `<div class="btn btn-outline" onClick="handleAddFavoriteCharacter(${char_id})"><i class="fas fa-star"></i> Add to Favorites</div>`
    }

    return `
        <div id="${char_id}" class="character-card" data-character-card="${nickname}" data-status="${status}" aria-hidden="false">
            <div class="img-wrapper">
                <img src="${img}" alt="${name}">
            </div>
            <div class="card-popup-box">
                <div class="char-nickname">${nickname}</div>
                ${characterRating()}
                <div class="btn btn-outline" onClick="handleShowCharacterDetails(${char_id})"><i class="fas fa-info"></i> View Details</div>
                ${favoriteActionBtn()}
            </div>
        </div>
    `;
}

function characterModal(character) {
    const { id, name, nickname, img, status, occupation, portrayed, rating } = character;
    const isFavoriteCharacter = favoriteCharacters.filter(fav => fav.id === id).length > 0 ? true : false;

    const setStarClass = (star) => {
        if (!isFavoriteCharacter) return '';
        if (rating >= star) return 'selected'
        else return '';
    }

    const starRating = () => {
        if (!isFavoriteCharacter) return '';
        return `
            <div class="star-rating">
                Rating:
                <i class="fas fa-star ${setStarClass(1)}" data-star onClick="handleChangeRating(${id}, 1)"></i>
                <i class="fas fa-star ${setStarClass(2)}" data-star onClick="handleChangeRating(${id}, 2)"></i>
                <i class="fas fa-star ${setStarClass(3)}" data-star onClick="handleChangeRating(${id}, 3)"></i>
                <i class="fas fa-star ${setStarClass(4)}" data-star onClick="handleChangeRating(${id}, 4)"></i>
                <i class="fas fa-star ${setStarClass(5)}" data-star onClick="handleChangeRating(${id}, 5)"></i>
            </div>
        `;
    }

    const actionBtn = () => {
        if (isFavoriteCharacter) {
            return `
                <div class="btn btn-outline" onClick="handleRemoveFavorite(${id})">
                    <i class="fas fa-ban"></i> Remove Favorite
                </div>
            `;
        } else {
            return `
                <div class="btn btn-outline" onClick="handleAddFavorite(${id})">
                    <i class="fas fa-star"></i> Add to Favorites
                </div>
            `;
        
        }
    }

    return `
        <div class="modal-close-btn" onClick="handleCloseModal()">&times;</div>
        <div class="character-modal-container">
            <div class="modal-character">
                <div class="char-img">
                    <img src="${img}" alt="${name}">
                </div>
                <div class="char-details">
                    <div class="char-name">${name}</div>
                    ${starRating()}
                    <ul class="character-info defaults-removed">
                        <li>Nickname: <span class="detail">"${nickname}"</span></li>
                        <li>Status: <span class="detail">${status}</span></li>
                        <li>Occupation(s): <span class="detail">${occupation}</span></li>
                        <li>Portrayed by: <span class="detail">${portrayed}</span></li>
                    </ul>
                    ${actionBtn()}
                </div>
            </div>
        </div>
    `;
}