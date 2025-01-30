import { ACCESS_KEY } from './acessCode';
import { useEffect } from 'react';

// Function to calculate the minimum purchase quantity based on command, quantity, and portion
export function calculateMinPurchaseQty(command, quantity, portion) {
  return (command * quantity) / portion;
}

// Function to calculate the ingredient price based on price, minimum purchase quantity, and purchase quantity
export function calculateIngredientPrice(price, minPurchaseQty, quantity) {
  return (price * minPurchaseQty) / quantity;
}

// Function to handle changes to ingredient fields and save the updated data
export const handleChange = (index, field, value, dataList, saveFunction, BinId, setIngredientList) => {
  const updatedIngredientList = [...dataList]; // Clone the ingredient list array
  updatedIngredientList[index][field] = value; // Update the specific field for the selected ingredient
  saveFunction(updatedIngredientList, BinId, setIngredientList); // Save the updated ingredient list
};

// Function to fetch data from a JSON bin by its BinId
export const getData = async (BinId) => {
  try {
    const res = await fetch(`https://api.jsonbin.io/v3/b/${BinId}/latest`, {
      method: 'GET',
      headers: { 'X-Master-Key': ACCESS_KEY }
    });
    const json = await res.json();
    return json.record; // Return the record from the JSON bin
  } catch (e) {
    console.error(e);
    return []; // Return an empty array if there was an error fetching the data
  }
};

// Function to save recipe data to the JSON bin
export const saveRecipe = async (recipeList, BinId, setRecipeList) => {
  try {
    const res = await fetch(`https://api.jsonbin.io/v3/b/${BinId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-Master-Key': ACCESS_KEY
      },
      body: JSON.stringify({ recipes: recipeList }) // Save the recipes as an array
    });
    console.log("saveRecipet")
    if (res.ok) {
      setRecipeList(recipeList); // Update the recipe list state with the new data
    }
  } catch (e) {
    console.error(e); // Log any error that occurs during the save process
  }
};

// Function to save ingredient data to the JSON bin
export const saveIngredient2 = async (ingredientList, BinId, setIngredientList) => {
  try {
    const res = await fetch(`https://api.jsonbin.io/v3/b/${BinId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-Master-Key': ACCESS_KEY
      },
      body: JSON.stringify({ ingredients: ingredientList }) // Save the ingredients as an array
    });
    if (res.ok) {
      setIngredientList(ingredientList); // Update the ingredient list state with the new data
    }
  } catch (e) {
    console.error(e); // Log any error that occurs during the save process
  }
};

// Function to save a generic data object to the JSON bin (used for different types of data)
export const saveIngredient = async (ingredientList, BinId, set) => {
  try {
    const res = await fetch(`https://api.jsonbin.io/v3/b/${BinId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-Master-Key': ACCESS_KEY
      },
      body: JSON.stringify(ingredientList) // Save the generic data
    });
    if (res.ok) {
      set(ingredientList); // Update the state with the new data
    }
  } catch (e) {
    console.error(e); // Log any error that occurs during the save process
  }
};

// Function to save inscription data to the JSON bin
export const saveInscription = async (inscriptionList, BinId, setInscriptionList) => {
  try {
    const res = await fetch(`https://api.jsonbin.io/v3/b/${BinId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-Master-Key': ACCESS_KEY
      },
      body: JSON.stringify({ inscriptions: inscriptionList }) // Save the inscriptions as an array
    });
    if (res.ok) {
      setInscriptionList(inscriptionList); // Update the inscription list state with the new data
    }
  } catch (e) {
    console.error(e); // Log any error that occurs during the save process
  }
};

// Synchronize ingredient data with recipe data, updating ingredient information
export const SyncIngredients = (recipeList, existingIngredientList, isIngredientsLoading, isRecipesLoading, BinIdIngredient, setIngredientList) => {

  useEffect(() => {
    if (!isIngredientsLoading && !isRecipesLoading) { // Run only when ingredients and recipes are loaded
      console.log("Synchronizing Ingredients with Recipes");
      const newIngredientList = []; // List to store new ingredients found from recipes

      recipeList.forEach(recipe => {
        if (recipe.ingredients) {
          recipe.ingredients.forEach(ingredient => {
            // Check if the ingredient already exists in the existing ingredients list or in the new ingredient list
            const ingredientExistsInExisting = existingIngredientList.some(ing => ing.type === ingredient.type);
            const ingredientExistsInNew = newIngredientList.some(ing => ing.type === ingredient.type);

            if (!ingredientExistsInExisting && !ingredientExistsInNew) {
              // Add new ingredient if it doesn't exist in either list
              newIngredientList.push({
                type: ingredient.type,
                priceQty: "",
                supplier: "",
                unitPrice: "",
                minPurchaseQty: "",
                purchaseQty: "",
                ingredientPrice: "",
                webLink: "",
                measure: ingredient.measure,
                listRecipe: [recipe.title]
              });
            } else if (!ingredientExistsInExisting && ingredientExistsInNew) {
              // Add recipe to the existing ingredient in the new list
              const existingIngredient = newIngredientList.find(ing => ing.type === ingredient.type);
              if (!existingIngredient.listRecipe.includes(recipe.title)) {
                existingIngredient.listRecipe.push(recipe.title);
              }
            } else if (ingredientExistsInExisting && !ingredientExistsInNew) {
              // Add recipe to the existing ingredient in the original list
              const existingIngredient = existingIngredientList.find(ing => ing.type === ingredient.type);
              if (!existingIngredient.listRecipe.includes(recipe.title)) {
                existingIngredient.listRecipe.push(recipe.title);
              }
            }
          });
        }
      });

      // Filter out ingredients that are no longer relevant and update the ingredient list
      const filteredIngredients = existingIngredientList.filter(ing =>
        recipeList.some(recipe =>
          recipe.ingredients.some(recIng => recIng.type === ing.type)
        )
      );

      const updatedIngredientList = [...newIngredientList, ...filteredIngredients];
      saveIngredient2(updatedIngredientList, BinIdIngredient, setIngredientList); // Save the updated ingredient list
    }
  }, [isIngredientsLoading, isRecipesLoading]);
};
