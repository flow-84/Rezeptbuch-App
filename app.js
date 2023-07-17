// Variablen für die Verwaltung von Rezepten
let recipes = [];
let editingIndex = -1; // Index des bearbeiteten Rezepts

// Funktion zum Laden der Rezepte aus dem Local Storage
function loadRecipes() {
  const storedRecipes = localStorage.getItem('recipes');
  if (storedRecipes) {
    recipes = JSON.parse(storedRecipes);
    displayRecipes();
  }
}

// Funktion zum Speichern der Rezepte im Local Storage
function saveRecipes() {
  localStorage.setItem('recipes', JSON.stringify(recipes));
}

// Funktion zum Hinzufügen eines neuen Rezepts
function addRecipe(recipe) {
  recipes.push(recipe);
  saveRecipes();
  displayRecipes();
  clearForm();
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
}

// Funktion zum Anzeigen der Rezepte
function displayRecipes() {
  const recipeList = document.getElementById('recipe-list');
  recipeList.innerHTML = '';

  recipes.forEach((recipe, index) => {
    const recipeItem = document.createElement('div');
    recipeItem.innerHTML = `
      <h3>${recipe.title}</h3>
      <p>${recipe.category}</p>
      <p>${recipe.ingredients}</p>
      <p>${recipe.steps}</p>
      <p>Anzahl der Bewertungen: ${recipe.ratings.length}</p>
      <p>Durchschnittliche Bewertung: ${calculateAverageRating(recipe)}</p>
      <div class="rating-stars">
        ${renderRatingStars(index)}
      </div>
      <button onclick="editRecipeForm(${index})">Bearbeiten</button>
      <button onclick="deleteRecipe(${index})">Löschen</button>
    `;
    recipeList.appendChild(recipeItem);
  });
}

// Funktion zum Öffnen des Formulars zum Hinzufügen eines neuen Rezepts
function openAddRecipeForm() {
  clearForm();
  if (editingIndex === -1) {
    updateFormForAdd();
  } else {
    updateFormForEdit();
  }
}

// Funktion zum Hinzufügen eines neuen Rezepts
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

function editRecipeForm(index) {
  const recipe = recipes[index];
  document.getElementById('title').value = recipe.title;
  document.getElementById('category').value = recipe.category;
  document.getElementById('ingredients').value = recipe.ingredients;
  document.getElementById('steps').value = recipe.steps;
  editingIndex = index; // Setzen des Bearbeitungsindex
  document.getElementById('add-recipe-button').innerText = 'Aktualisieren'; // Änderungen im Button-Text vornehmen
}

// Funktion zum Aktualisieren eines vorhandenen Rezepts
function updateRecipeForm(index) {
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
      favorite: recipes[index].favorite,
      ratings: recipes[index].ratings
    };
    editRecipe(index, recipe);
  } else {
    alert('Bitte füllen Sie alle Felder aus.');
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
  }
}

// Funktion zum Vergeben von Sterne-Bewertungen für ein Rezept
function rateRecipe(index, rating) {
  const recipe = recipes[index];
  const lastRating = recipe.ratings.length > 0 ? recipe.ratings[recipe.ratings.length - 1] : null;
  const currentDate = new Date();

  if (lastRating === null || !lastRating.date || currentDate.getTime() - lastRating.date.getTime() >= 14 * 24 * 60 * 60 * 1000) {
    const newRating = { rating: rating, date: currentDate };
    recipe.ratings.push(newRating);
    saveRecipes();
    displayRecipes();
  } else {
    const daysRemaining = Math.ceil((lastRating.date.getTime() + 14 * 24 * 60 * 60 * 1000 - currentDate.getTime()) / (24 * 60 * 60 * 1000));
    alert(`Sie können das Rezept erst nach ${daysRemaining} Tagen erneut bewerten.`);
  }
}


// Funktion zur Berechnung der Durchschnittsbewertung eines Rezepts
function calculateAverageRating(recipe) {
  if (recipe.ratings.length === 0) {
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
    recipeItem.innerHTML = `
      <h3>${recipe.title}</h3>
      <p>${recipe.category}</p>
      <p>${recipe.ingredients}</p>
      <p>${recipe.steps}</p>
      <p>Anzahl der Bewertungen: ${recipe.ratings.length}</p>
      <p>Durchschnittliche Bewertung: ${calculateAverageRating(recipe)}</p>
      <div class="rating-stars">
        ${renderRatingStars(index)}
      </div>
      <button onclick="editRecipeForm(${index})">Bearbeiten</button>
      <button onclick="deleteRecipe(${index})">Löschen</button>
    `;
    recipeList.appendChild(recipeItem);
  });
}

// Funktion zum Anpassen des Formulars für das Hinzufügen
function updateFormForAdd() {
  document.getElementById('add-recipe-button').innerText = 'Hinzufügen';
}

// Funktion zum Anpassen des Formulars für die Bearbeitung
function updateFormForEdit() {
  document.getElementById('add-recipe-button').innerText = 'Aktualisieren';
}

// Funktion zum Laden der Rezepte beim Seitenaufruf
loadRecipes();

// cursor fire
document.addEventListener('mousemove', function(event) {
  var cursorFire = document.querySelector('.cursor-fire');
  var x = event.clientX - 20;
  var y = event.clientY - 20;
  cursorFire.style.left = x + 'px';
  cursorFire.style.top = y + 'px';
});
