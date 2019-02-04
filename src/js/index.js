import Search from './models/Search';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import {
    elements,
    renderLoader,
    clearLoader
} from './views/base';
import Recipe from './models/Recipe';


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

// dirty way rais events for common object
// window.addEventListener('hashchange', controlRecipe);
// window.addEventListener('load', controlRecipe);

// better way rais events for common object
let events = ['hashchange', 'load'];
events.forEach((event) => window.addEventListener(event, controlRecipe));