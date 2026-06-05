
/* ── 1. DOM REFERENCES ──────────────────────── */
    const hamburger          = document.getElementById('hamburger');
    const nav                = document.getElementById('nav');
    const recipeGrid         = document.getElementById('recipeGrid');
    const modalOverlay       = document.getElementById('modalOverlay');
    const openFormBtn        = document.getElementById('openFormBtn');
    const modalClose         = document.getElementById('modalClose');
    const saveRecipeBtn      = document.getElementById('saveRecipeBtn');
    const searchInput        = document.getElementById('searchInput');
    const categoryFilter     = document.getElementById('categoryFilter');
    const shoppingPanel      = document.getElementById('shoppingPanel');
    const shoppingItems      = document.getElementById('shoppingItems');
    const shoppingRecipeName = document.getElementById('shoppingRecipeName');
    const shoppingCount      = document.getElementById('shoppingCount');
    const closeShoppingPanel = document.getElementById('closeShoppingPanel');
    const countBadge         = document.getElementById('countBadge');
    const favLink            = document.getElementById('favLink');

    /* ── 2. DATA ────────────────────────────────── */
    let recipes = [
      {
        id: 1, name: 'Jollof Rice', category: 'dinner',
        cuisine: 'Nigerian', emoji: '🍚',
        ingredients: ['2 cups rice', 'Tomato paste', 'Onions', 'Seasoning', 'Chicken stock'],
        instructions: 'Fry tomato base, add stock, cook rice in sauce until tender.',
        isFavorite: false
      },
      {
        id: 2, name: 'Avocado Toast', category: 'breakfast',
        cuisine: 'International', emoji: '🥑',
        ingredients: ['2 slices bread', '1 ripe avocado', 'Salt', 'Pepper', 'Lemon'],
        instructions: 'Toast bread. Mash avocado with lemon and salt. Spread.',
        isFavorite: false
      },
      {
        id: 3, name: 'Chicken Pasta', category: 'dinner',
        cuisine: 'Italian', emoji: '🍝',
        ingredients: ['200g pasta', 'Chicken breast', 'Cream', 'Garlic', 'Parmesan'],
        instructions: 'Cook pasta. Fry garlic and chicken, add cream, toss.',
        isFavorite: true
      },
      {
        id: 4, name: 'Mango Smoothie', category: 'snack',
        cuisine: 'Tropical', emoji: '🥭',
        ingredients: ['2 mangoes', '1 cup milk', 'Honey', 'Ice cubes'],
        instructions: 'Blend all until smooth. Serve cold.',
        isFavorite: false
      },
      {
        id: 5, name: 'Chocolate Cake', category: 'dessert',
        cuisine: 'American', emoji: '🎂',
        ingredients: ['Flour', 'Cocoa', 'Sugar', 'Eggs', 'Butter', 'Milk', 'Baking powder'],
        instructions: 'Mix ingredients, bake at 180°C for 35 minutes.',
        isFavorite: false
      },
      {
        id: 6, name: 'Egusi Soup', category: 'lunch',
        cuisine: 'Nigerian', emoji: '🥘',
        ingredients: ['Egusi', 'Palm oil', 'Assorted meat', 'Pepper', 'Crayfish', 'Stockfish', 'Spinach'],
        instructions: 'Fry egusi in palm oil, add meat stock, pepper and crayfish. Simmer 20 minutes, add greens.',
        isFavorite: true
      }
    ];

    let showFavoritesOnly = false;

    /* ── 3. LOCALSTORAGE ────────────────────────── */
    function saveToStorage() {
      localStorage.setItem('recipebookData_v2', JSON.stringify(recipes));
    }

    function loadFromStorage() {
      const s = localStorage.getItem('recipebookData_v2');
      if (s !== null) {
        try { recipes = JSON.parse(s); } catch(e) {}
      }
    }

    /* ── 4. RENDER ──────────────────────────────── */
    function renderRecipes(list) {
      countBadge.textContent = list.length;

      if (list.length === 0) {
        recipeGrid.innerHTML = `
          <div class="empty-state">
            <div class="icon">🍽</div>
            <p>No recipes found.<br>Try a different search or add a new one!</p>
          </div>`;
        return;
      }

      let html = '';
      list.forEach(function(r) {
        const preview = r.ingredients.slice(0, 3)
          .map(i => `<span>• ${i}</span>`)
          .join('');
        const heart    = r.isFavorite ? '❤️' : '🤍';
        const favClass = r.isFavorite ? 'btn-icon btn-favorite active' : 'btn-icon btn-favorite';

        html += `
          <div class="card">
            <div class="card-header">
              ${r.emoji || '🍽'}
              <span class="fav-dot">${r.isFavorite ? '❤️' : ''}</span>
            </div>
            <div class="card-body">
              <h3 class="card-title">${r.name}</h3>
              <div class="card-meta">
                <span class="card-badge">${r.category}</span>
                <span class="card-cuisine">${r.cuisine}</span>
              </div>
              <div class="card-ingredients">${preview}</div>
            </div>
            <div class="card-actions">
              <button class="btn-icon btn-delete"   data-id="${r.id}">🗑 Delete</button>
              <button class="btn-icon btn-shopping" data-id="${r.id}">🛒 Shop</button>
              <button class="${favClass}"            data-id="${r.id}">${heart} Fav</button>
            </div>
          </div>`;
      });

      recipeGrid.innerHTML = html;
      attachCardEvents();
    }

    /* ── 5. CARD EVENTS ─────────────────────────── */
    function attachCardEvents() {
      document.querySelectorAll('.btn-delete').forEach(function(btn) {
        btn.addEventListener('click', function() {
          const id = Number(this.dataset.id);
          if (!confirm('Delete this recipe?')) return;
          recipes = recipes.filter(function(r) { return r.id !== id; });
          saveToStorage();
          applyFilters();
        });
      });

      document.querySelectorAll('.btn-favorite').forEach(function(btn) {
        btn.addEventListener('click', function() {
          toggleFavorite(Number(this.dataset.id));
        });
      });

      document.querySelectorAll('.btn-shopping').forEach(function(btn) {
        btn.addEventListener('click', function() {
          openShoppingList(Number(this.dataset.id));
        });
      });
    }

    /* ── 6. HAMBURGER ───────────────────────────── */
    hamburger.addEventListener('click', function() {
      nav.classList.toggle('open');
    });

    /* ── 7. MODAL ───────────────────────────────── */
    openFormBtn.addEventListener('click', function() {
      modalOverlay.classList.add('open');
      document.getElementById('recipeName').focus();
    });

    modalClose.addEventListener('click', function() {
      modalOverlay.classList.remove('open');
    });

    modalOverlay.addEventListener('click', function(e) {
      if (e.target === modalOverlay) modalOverlay.classList.remove('open');
    });

    saveRecipeBtn.addEventListener('click', function() {
      const name        = document.getElementById('recipeName').value.trim();
      const category    = document.getElementById('recipeCategory').value;
      const cuisine     = document.getElementById('recipeCuisine').value.trim();
      const emoji       = document.getElementById('recipeEmoji').value.trim() || '🍽';
      const instruct    = document.getElementById('recipeInstructions').value.trim();
      const ingredients = document.getElementById('recipeIngredients').value
        .split('\n')
        .map(function(l) { return l.trim(); })
        .filter(Boolean);

      if (!name || ingredients.length === 0) {
        alert('Please enter a recipe name and at least one ingredient.');
        return;
      }

      recipes.push({
        id: Date.now(),
        name, category,
        cuisine: cuisine || 'Not specified',
        emoji, ingredients, instructions: instruct,
        isFavorite: false
      });

      saveToStorage();
      applyFilters();
      modalOverlay.classList.remove('open');
      clearForm();
    });

    function clearForm() {
      ['recipeName','recipeCuisine','recipeIngredients','recipeInstructions','recipeEmoji']
        .forEach(function(id) { document.getElementById(id).value = ''; });
    }

    /* ── 8. SEARCH & FILTER ─────────────────────── */
    function applyFilters() {
      const s = searchInput.value.toLowerCase().trim();
      const c = categoryFilter.value;

      let filtered = recipes.filter(function(r) {
        const textMatch = r.name.toLowerCase().includes(s) || r.cuisine.toLowerCase().includes(s);
        const catMatch  = c === 'all' || r.category === c;
        const favMatch  = !showFavoritesOnly || r.isFavorite;
        return textMatch && catMatch && favMatch;
      });

      renderRecipes(filtered);
    }

    searchInput.addEventListener('input', applyFilters);
    categoryFilter.addEventListener('change', applyFilters);

    /* ── 9. FAVORITES FILTER ────────────────────── */
    favLink.addEventListener('click', function(e) {
      e.preventDefault();
      showFavoritesOnly = !showFavoritesOnly;
      favLink.style.color = showFavoritesOnly ? '#D8F3DC' : '';
      applyFilters();
    });

    /* ── 10. SHOPPING LIST ──────────────────────── */
    closeShoppingPanel.addEventListener('click', function() {
      shoppingPanel.classList.remove('open');
    });

    function openShoppingList(id) {
      const r = recipes.find(function(recipe) { return recipe.id === id; });
      if (!r) return;

      shoppingRecipeName.textContent = r.emoji + ' ' + r.name;

      shoppingItems.innerHTML = r.ingredients
        .map(function(ing) {
          return `<div class="shopping-item"><span class="dot"></span>${ing}</div>`;
        })
        .join('');

      shoppingCount.textContent = r.ingredients.length + ' item' + (r.ingredients.length !== 1 ? 's' : '');
      shoppingPanel.classList.add('open');
    }

    /* ── 11. FAVORITES TOGGLE ───────────────────── */
    function toggleFavorite(id) {
      const r = recipes.find(function(recipe) { return recipe.id === id; });
      if (r) {
        r.isFavorite = !r.isFavorite;
        saveToStorage();
        applyFilters();
      }
    }

    /* ── 12. INIT ───────────────────────────────── */
    function init() {
      loadFromStorage();
      applyFilters();
    }

    init();
