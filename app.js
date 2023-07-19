// Variablen für die Verwaltung von Rezepten
let recipes = [];
let editingIndex = -1; // Index des bearbeiteten Rezepts

// Funktion zum Laden der Rezepte aus dem Local Storage
function loadRecipes() {
  const storedRecipes = localStorage.getItem('recipes');
  if (storedRecipes) {
    recipes = JSON.parse(storedRecipes);
    displayRecipes();
    displayFavorites();
  } else {
    // Grillrezepte hinzufügen, wenn kein Rezept im Local Storage vorhanden ist
    const grillRecipes = [
      {
        title: 'Grillhähnchen',
        category: 'Hauptgerichte',
        ingredients: 'Hähnchen, Salz, Pfeffer, Paprika, Knoblauch',
        steps: '1. Hähnchen würzen\n2. Auf den Grill legen\n3. Grillen bis durchgegart'
      },
      {
        title: 'Rindersteak',
        category: 'Hauptgerichte',
        ingredients: 'Rindersteak, Salz, Pfeffer, Öl',
        steps: '1. Rindersteak würzen\n2. Auf den Grill legen\n3. Grillen nach gewünschtem Gargrad'
      },
      {
        title: 'Gemüsespieße',
        category: 'Vorspeisen',
        ingredients: 'Gemüse nach Wahl, Öl, Salz, Pfeffer',
        steps: '1. Gemüse in Stücke schneiden\n2. Auf Spieße stecken\n3. Mit Öl, Salz und Pfeffer würzen\n4. Auf den Grill legen\n5. Grillen bis das Gemüse gar ist'
      },
      {
        title: 'Gegrillte Garnelen',
        category: 'Vorspeisen',
        ingredients: 'Garnelen, Knoblauch, Zitrone, Öl, Salz, Pfeffer',
        steps: '1. Garnelen schälen und entdarmen\n2. Knoblauch und Zitrone pressen\n3. Garnelen mit Knoblauch, Zitrone, Öl, Salz und Pfeffer marinieren\n4. Auf den Grill legen\n5. Grillen bis die Garnelen gar sind'
      },
      {
        title: 'Gegrillte Ananas',
        category: 'Desserts',
        ingredients: 'Ananas, Honig, Zimt',
        steps: '1. Ananas schälen und in Scheiben schneiden\n2. Scheiben mit Honig und Zimt bestreichen\n3. Auf den Grill legen\n4. Grillen bis die Ananas karamellisiert ist'
      },
      {
        title: 'Grillbananen',
        category: 'Desserts',
        ingredients: 'Bananen, Schokolade, Marshmallows',
        steps: '1. Bananen längs einschneiden\n2. Schokolade und Marshmallows in die Einschnitte geben\n3. In Alufolie einwickeln\n4. Auf den Grill legen\n5. Grillen bis die Schokolade geschmolzen ist und die Marshmallows leicht gebräunt sind'
      },
      // Weitere Grillrezepte hier hinzufügen...
    ];

    grillRecipes.forEach(recipe => addRecipe(recipe));
  }
}

// Funktion zum Speichern der Rezepte im Local Storage
function saveRecipes() {
  localStorage.setItem('recipes', JSON.stringify(recipes));
}

// Funktion zum Hinzufügen eines neuen Rezepts
function addRecipe(recipe) {
  const existingRecipeIndex = recipes.findIndex(r => r.title === recipe.title);
  if (existingRecipeIndex === -1) {
    recipe.ratings = [];
    recipes.push(recipe);
    saveRecipes();
    displayRecipes();
    clearForm();
  } else {
    alert('Ein Rezept mit diesem Titel existiert bereits.');
  }
}

// Funktion zum Bearbeiten eines vorhandenen Rezepts
function editRecipe(index, recipe) {
  recipes[index] = recipe;
  saveRecipes();
  displayRecipes();
  clearForm();
  editingIndex = -1; // Zurücksetzen des Bearbeitungsindex
  updateFormForAdd(); // Änderungen im Formular für das Hinzufügen vornehmen
}

// Funktion zum Löschen eines Rezepts
function deleteRecipe(index) {
  recipes.splice(index, 1);
  saveRecipes();
  displayRecipes();
  displayFavorites();
}

// Funktion zum Anzeigen der Rezepte
function displayRecipes() {
  const recipeList = document.getElementById('recipe-list');
  recipeList.innerHTML = '';

  recipes.forEach((recipe, index) => {
    const recipeItem = document.createElement('div');
    recipeItem.className = 'recipe-item';

    const title = recipe && recipe.title ? recipe.title : '';
    const category = recipe && recipe.category ? recipe.category :'';
    const ingredients = recipe && recipe.ingredients ? recipe.ingredients : '';
    const steps = recipe && recipe.steps ? recipe.steps.split('\n') : []; // Schritte als Liste

    const ratingCount = recipe && recipe.ratings && recipe.ratings.length ? recipe.ratings.length : 0;
    const averageRating = calculateAverageRating(recipe);

    const favoriteClass = recipe && recipe.favorite ? 'favorite' : '';

    recipeItem.innerHTML = `
      <h2>${title}</h2>
      <p>${category}</p>
      <p>${ingredients}</p>
      <ul>
        ${steps.map(step => `<li>${step}</li>`).join('')} <!-- Schritte als Liste -->
      </ul>
      <p>Anzahl der Bewertungen: ${ratingCount}</p>
      <p>Durchschnittliche Bewertung: ${averageRating}</p>
      <div class="rating-stars">
        ${renderRatingStars(recipes.indexOf(recipe))}
      </div>
      <button onclick="editRecipeForm(${recipes.indexOf(recipe)})">Bearbeiten</button>
      <button onclick="deleteRecipe(${recipes.indexOf(recipe)})">Löschen</button>
      <button onclick="toggleFavorite(${recipes.indexOf(recipe)})" class="${favoriteClass}">
        ${recipe && recipe.favorite ? 'Aus Favoriten entfernen' : 'Zu Favoriten hinzufügen'}
      </button>
    `;

    recipeList.appendChild(recipeItem);
  });
}


// Funktion zum Anzeigen der Favoritenliste
function displayFavorites() {
  const favoritesList = document.getElementById('favorites-list');
  favoritesList.innerHTML = '';

  const favoriteRecipes = recipes.filter(recipe => recipe.favorite);

  favoriteRecipes.forEach((recipe, index) => {
    const favoriteItem = document.createElement('div');
    favoriteItem.className = 'favorite-item';
    favoriteItem.innerHTML = `<h4 onclick="displayFilteredRecipes([recipes[${recipes.indexOf(recipe)}]])">${recipe.title}</h4>`;
    favoritesList.appendChild(favoriteItem);
  });
}

// Funktion zum Öffnen des Formulars zum Hinzufügen oder Bearbeiten eines Rezepts
function openAddRecipeForm() {
  clearForm();
  if (editingIndex === -1) {
    updateFormForAdd();
  } else {
    updateFormForEdit();
  }
}

// Funktion zum Hinzufügen oder Bearbeiten eines Rezepts
function addRecipeForm() {
  const title = document.getElementById('title').value;
  const category = document.getElementById('category').value;
  const ingredients = document.getElementById('ingredients').value;
  const steps = document.getElementById('steps').value;

  if (title && category && ingredients && steps) {
    const recipe = {
      title: title,
      category: category,
      ingredients: ingredients,
      steps: steps,
      favorite: false,
      ratings: []
    };
    if (editingIndex === -1) {
      addRecipe(recipe);
    } else {
      editRecipe(editingIndex, recipe);
    }
  } else {
    alert('Bitte füllen Sie alle Felder aus.');
  }
}

// Funktion zum Bearbeiten eines Rezepts
function editRecipeForm(index) {
  const recipe = recipes[index];
  document.getElementById('title').value = recipe.title;
  document.getElementById('category').value = recipe.category;
  document.getElementById('ingredients').value = recipe.ingredients;
  document.getElementById('steps').value = recipe.steps;
  editingIndex = index; // Setzen des Bearbeitungsindex
  updateFormForEdit();
}

// Funktion zum Aktualisieren eines vorhandenen Rezepts
function updateRecipeForm() {
  const title = document.getElementById('title').value;
  const category = document.getElementById('category').value;
  const ingredients = document.getElementById('ingredients').value;
  const steps = document.getElementById('steps').value;

  if (title && category && ingredients && steps && editingIndex !== -1) {
    const recipe = {
      title: title,
      category: category,
      ingredients: ingredients,
      steps: steps,
      favorite: recipes[editingIndex].favorite,
      ratings: recipes[editingIndex].ratings
    };
    editRecipe(editingIndex, recipe);
  } else {
    alert('Bitte füllen Sie alle Felder aus oder wählen Sie ein Rezept zum Bearbeiten aus.');
  }
}

// Funktion zum Zurücksetzen des Formulars
function clearForm() {
  document.getElementById('title').value = '';
  document.getElementById('category').value = '';
  document.getElementById('ingredients').value = '';
  document.getElementById('steps').value = '';
}

// Funktion zum Markieren eines Rezepts als Favorit
function toggleFavorite(index) {
  if (recipes[index]) {
    recipes[index].favorite = !recipes[index].favorite;
    saveRecipes();
    displayRecipes();
    displayFavorites(); // Aktualisierte Anzeige der Favoritenliste
  }
}

function rateRecipe(index, rating) {
  const recipe = recipes[index];

  // Überprüfen, ob das Rezept vorhanden ist und Bewertungen hat
  if (recipe && recipe.ratings) {
    const newRating = { rating: rating, date: new Date() };
    recipe.ratings.push(newRating);
    saveRecipes();
    displayRecipes(); // Update das angezeigte Rezept
  } else if (recipe) {
    recipe.ratings = [{ rating: rating, date: new Date() }]; // Neue Bewertungsliste erstellen
    saveRecipes();
    displayRecipes(); // Update das angezeigte Rezept
  }
}


// Funktion zur Berechnung der Durchschnittsbewertung eines Rezepts
function calculateAverageRating(recipe) {
  if (!recipe || !recipe.ratings || !Array.isArray(recipe.ratings) || recipe.ratings.length === 0) {
    return 'Keine Bewertungen';
  }
  const sum = recipe.ratings.reduce((total, rating) => total + rating.rating, 0);
  const average = sum / recipe.ratings.length;
  return average.toFixed(1);
}

// Funktion zur Darstellung der Sterne-Bewertungen
function renderRatingStars(index) {
  const recipe = recipes[index];
  let starsHtml = '';
  for (let i = 1; i <= 5; i++) {
    const checkedClass = i <= calculateAverageRating(recipe) ? 'checked' : '';
    starsHtml += `<span class="star ${checkedClass}" onclick="rateRecipe(${index}, ${i})">&#9733;</span>`;
  }
  return starsHtml;
}

// Funktion zur Suche nach Rezepten basierend auf Kriterien
function searchRecipes(criteria) {
  const filteredRecipes = recipes.filter(recipe => {
    const titleMatch = recipe.title.toLowerCase().includes(criteria.toLowerCase());
    const categoryMatch = recipe.category.toLowerCase().includes(criteria.toLowerCase());
    const ingredientsMatch = recipe.ingredients.toLowerCase().includes(criteria.toLowerCase());
    const stepsMatch = recipe.steps.toLowerCase().includes(criteria.toLowerCase());
    return titleMatch || categoryMatch || ingredientsMatch || stepsMatch;
  });
  displayFilteredRecipes(filteredRecipes);
}

// Funktion zum Anzeigen der gefilterten Rezepte
function displayFilteredRecipes(filteredRecipes) {
  const recipeList = document.getElementById('recipe-list');
  recipeList.innerHTML = '';

  filteredRecipes.forEach((recipe, index) => {
    const recipeItem = document.createElement('div');
    recipeItem.className = 'recipe-item';

    const title = recipe && recipe.title ? recipe.title : '';
    const category = recipe && recipe.category ? recipe.category :'';
    const ingredients = recipe && recipe.ingredients ? recipe.ingredients : '';
    const steps = recipe && recipe.steps ? recipe.steps.split('\n') : []; // Schritte als Liste

    const ratingCount = recipe && recipe.ratings && recipe.ratings.length ? recipe.ratings.length : 0;
    const averageRating = calculateAverageRating(recipe);

    const favoriteClass = recipe && recipe.favorite ? 'favorite' : '';

    recipeItem.innerHTML = `
      <h2>${title}</h2>
      <p>${category}</p>
      <p>${ingredients}</p>
      <ul>
        ${steps.map(step => `<li>${step}</li>`).join('')} <!-- Schritte als Liste -->
      </ul>
      <p>Anzahl der Bewertungen: ${ratingCount}</p>
      <p>Durchschnittliche Bewertung: ${averageRating}</p>
      <div class="rating-stars">
        ${renderRatingStars(recipes.indexOf(recipe))}
      </div>
      <button onclick="editRecipeForm(${recipes.indexOf(recipe)})">Bearbeiten</button>
      <button onclick="deleteRecipe(${recipes.indexOf(recipe)})">Löschen</button>
      <button onclick="toggleFavorite(${recipes.indexOf(recipe)})" class="${favoriteClass}">
        ${recipe && recipe.favorite ? 'Aus Favoriten entfernen' : 'Zu Favoriten hinzufügen'}
      </button>
    `;

    recipeList.appendChild(recipeItem);
  });
}

// Funktion zum Anpassen des Formulars für das Hinzufügen
function updateFormForAdd() {
  document.getElementById('form-title').innerText = 'Rezept hinzufügen';
  document.getElementById('add-recipe-button').innerText = 'Hinzufügen';
}

// Funktion zum Anpassen des Formulars für die Bearbeitung
function updateFormForEdit() {
  document.getElementById('form-title').innerText = 'Rezept bearbeiten';
  document.getElementById('add-recipe-button').innerText = 'Aktualisieren';
}

// Grillrezepte zu den Rezepten hinzufügen
loadRecipes();
