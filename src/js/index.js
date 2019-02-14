import Search from './models/Search';
import Recipe from './models/Recipe';
import List from './models/List';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';
import {
    elements,
    renderLoader,
    clearLoader
} from './views/base';



/* Global state of the app
1- Search object
2-Current recipe object  
3-Shopping list object
4-Liked recipes
*/
const state = {};


///////////
/// SEARCH CONTROLLER
const controlSearch = async () => {
    // 1) Get query from view
    const query = searchView.getInput();

    if (query) {
        // 2) New search object and add to state
        state.search = new Search(query);

        // 3) Prepare UI for results 
        searchView.clearInput();
        searchView.clearResults();
        renderLoader(elements.searchRes);

        try {
            // 4) Search for recipes
            await state.search.getResults();

            // 5) Render results on UI
            clearLoader();
            searchView.renderResults(state.search.result);

        } catch (err) {
            alert('Something wrong with the search...');
            clearLoader();
        }

    }
}
///////////
/// SEARCH CONTROLLER

elements.searchForm.addEventListener('submit', e => {
    e.preventDefault();
    controlSearch();
});

elements.searchResPages.addEventListener('click', e => {
    const btn = e.target.closest('.btn-inline');
    if (btn) {
        // const goToPage = btn.getAttribute('data-goto');
        const goToPage = parseInt(btn.dataset.goto, 10);
        searchView.clearResults();
        searchView.renderResults(state.search.result, goToPage);
    }
});

///////////
/// RECIPE CONTROLLER
const controlRecipe = async () => {
    // GET ID FROM URL
    const id = window.location.hash.replace('#', '');
    console.log(id);

    if (id) {
        // Prepare UI for changes
        recipeView.clearRecipe();
        renderLoader(elements.recipe);

        // HighLight selected search item
        if (state.search) searchView.highLightSelected(id);

        // Create new recipe object
        state.recipe = new Recipe(id);

        try {
            // Get recipe data and parse ingredients
            await state.recipe.getRecipe();
            state.recipe.parseIngredients();

            // Calculate servings and time
            state.recipe.calcTime();
            state.recipe.calcServings();

            // Render recipe
            clearLoader();
            recipeView.renderRecipe(state.recipe);

        } catch (err) {
            console.log(err);
        }

    }
};
///////////
/// RECIPE CONTROLLER

///////////
/// LIST CONTROLLER

  const controlList = () => {
      // Create a new list IF there is none yet 
      if (!state.list) state.list = new List();  

      // Add each ingredient to the list and UI
      state.recipe.ingredients.forEach(el => {
        const item = state.list.addItem(el.count, el.unit, el.ingredient);
        listView.renderItem(item);
      });
  }

///////////
/// LIST CONTROLLER

// Handle delete and update list itme events
elements.shopping.addEventListener('click', e => {
    const id = e.target.closest('.shopping__item').dataset.itemid;

    // Handle the delete button
    if (e.target.matches('.shopping__delete, .shopping__delete *')) {
        // Delete from state
        state.list.deleteItem(id);

        // Delete from UI
        listView.deleteItem(id);
        
     // Handel the count update   
    } else if (e.target.matches('.shopping__count-value')) {
        const val = parseFloat(e.target.value, 10);
        state.list.updateCount(id, val);
    }
    
        
});  

// dirty way rais events for common object
// window.addEventListener('hashchange', controlRecipe);
// window.addEventListener('load', controlRecipe);

// better way rais events for common object
let events = ['hashchange', 'load'];
events.forEach((event) => window.addEventListener(event, controlRecipe));

elements.recipe.addEventListener('click', e => {
    if (e.target.matches('.btn-decrease, .btn-decrease *')) {
        // Decrease button is clicked
        if (state.recipe.servings > 1) {
            state.recipe.updateServings('dec');
            recipeView.updateServingsIngredients(state.recipe);
        }

    } else if (e.target.matches('.btn-increase, .btn-increase *')) {
        // Decrase button is clicked
        state.recipe.updateServings('inc');
        recipeView.updateServingsIngredients(state.recipe); 
    } else if (e.target.matches('.recipe__btn--add, .recipe__btn--add *')) {
       controlList(); 
    }
});


