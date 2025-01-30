import React, { useState, useEffect } from 'react';
import NavbarUnLoged from './navbar_unloged';
import NavbarLoged from './navbar_loged';
import { BinIdRecipe, BinIdIngredient, BinIdInscription } from './acessCode';
import { getData, saveRecipe, calculateMinPurchaseQty, handleChange, saveInscription, calculateIngredientPrice } from './dataFunction';
import { useTranslation } from "react-i18next";

function RecipeOrderTable({ isAuthenticated }) {
  const [ingredients, setIngredients] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingData, setLoadingData] = useState(true);
  const { t, i18n } = useTranslation();
   const [inscriptionList, setInscriptionList] = useState([]); 

  // Fetch recipes and ingredients when the component mounts
  useEffect(() => {
    const fetchRecipe = async () => {
      const allRecipe = await getData(BinIdRecipe); // Call to fetch recipe data
      setRecipes(allRecipe.recipes);
      console.log(recipes); // Log the recipes to the console
      setLoadingData(false);
    };
    fetchRecipe(recipes);
    
    const fetchIngredient = async () => {
      const allIngredients = await getData(BinIdIngredient); // Call to fetch ingredient data
      setIngredients(allIngredients.ingredients);
      setLoading(false); // Set loading to false once ingredient data is fetched
    };
    fetchIngredient(ingredients);

    const fetchInscriptions = async () => {
          const allInscriptions = await getData(BinIdInscription); // Fetch the inscription data
          setInscriptionList(allInscriptions.inscriptions); // Store the inscriptions data in the state
          setIsLoading(false); // Set loading state to false when data is fetched
        };
        fetchInscriptions(inscriptionList); // Trigger the fetch operation
  }, []);

  console.log("inscription", inscriptionList)

  const NumberInscription = inscriptionList.length;


  // Function to calculate ingredient data based on the recipes and ingredients
  const calculateIngredientData = () => {
    // Reset price for all recipes
    recipes.forEach(recipe => {
      recipe.price = 0;
    });

    // Loop through ingredients and calculate total price per recipe
    ingredients.forEach((ingredient) => {
      console.log("ingredient", ingredient);
      ingredient.listRecipe.forEach((item) => {
        const matchingRecipe = recipes.find(
          recIng => recIng.title == item // Find the matching recipe by title
        );
        console.log("matchingRecipe", matchingRecipe);
        
        const i = ingredient.ingredientPrice; // Ingredient price
        
        // Find the matching ingredient in the recipe
        const j = matchingRecipe.ingredients.find(
          ing => ing.type == ingredient.type
        );
        console.log("ingredient",j)
        console.log("i", calculateIngredientPrice(ingredient.unitPrice, calculateMinPurchaseQty(matchingRecipe.command, j.quantity, matchingRecipe.portions), ingredient.priceQty).toFixed(2));
        
        // If a valid recipe is found and ingredient price is not empty
        if (i !== "" && matchingRecipe) {
          matchingRecipe.price += parseFloat(calculateIngredientPrice(ingredient.unitPrice, calculateMinPurchaseQty(matchingRecipe.command, j.quantity, matchingRecipe.portions), ingredient.priceQty).toFixed(2)); // Update the recipe price
        }
        console.log("matchingRecipe.price", matchingRecipe.price); // Log the updated recipe price
      });
    });
    // Save the updated recipes to the state and storage
    saveRecipe(recipes, BinIdRecipe, setRecipes);
  };

  // Recalculate ingredient data once loading is complete
  useEffect(() => {
    if (!loading && !loadingData) {
      calculateIngredientData(); // Trigger recalculation when loading finishes
    }
  }, [loading, loadingData]);

  // Handle changes to the command input and recalculate the ingredient data
  const handleChangeAndRecalculate = (index, command, value, recipes, saveRecipe, BinIdRecipe, setRecipes) => {
    handleChange(index, command, value, recipes, saveRecipe, BinIdRecipe, setRecipes); // Call the shared handleChange function
    calculateIngredientData(); // Recalculate ingredient data after a change
  };

  const updateAllRecipeCommands = () => {
    const updatedRecipes = recipes.map(recipe => ({
      ...recipe,
      command: NumberInscription // Met à jour la commande avec le nombre d'inscriptions
    }));
    setRecipes(updatedRecipes); // Met à jour l'état local des recettes
    saveRecipe(updatedRecipes, BinIdRecipe, setRecipes); // Sauvegarde les nouvelles commandes
    calculateIngredientData(); // Recalcule les prix après la mise à jour
  };
  const calculateTotalPrice = () => {
    return recipes.reduce((total, recipe) => total + (recipe.price || 0), 0).toFixed(2);
  };

  return (
    <>
     {isAuthenticated ? <NavbarLoged /> : <NavbarUnLoged />}
      <h2>{t("Recipe Order Table")}</h2><br/>
      <h6>{t("Number of inscription at the event :")} {NumberInscription} </h6>
      <h6>{t("Number of vegetarians :")} </h6>
      <button onClick={updateAllRecipeCommands}>{t("Update Commands with Number of Inscriptions")}</button> {/* Nouveau bouton */}
      <br/>
      <div style={{ overflowX: 'auto' }}>
        <table border="1" style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th>{t("Title")}</th> 
              <th>{t("Command")}</th> 
              <th>{t("Proportional factor")}</th> 
              <th>{t("Price €")}</th> 
            </tr>
          </thead>
          {loading && loadingData && isLoading? (
        <div>{t("Loading")}...</div> // Replaced <tr> with <div> here for loading state
        ) : (
          <tbody>
            {recipes.map((recipe, index) => (
              <tr key={index}>
                <td>{recipe.title}</td>
                <td>
                  <input
                    type="number"
                    value={recipe.command}
                    // When the command input changes, handle the change and recalculate prices
                    onChange={(e) => handleChangeAndRecalculate(index, 'command', e.target.value, recipes, saveRecipe, BinIdRecipe, setRecipes)}
                  />
                </td>
                <td>
                {(recipe.command && recipe.portions) ? (recipe.command / recipe.portions).toFixed(2) : 'N/A'}{/* Display the calculated proportional rappor of the recipe */}
                </td>
                <td>
                  {recipe.price} {/* Display the calculated price of the recipe */}
                </td>
              </tr>
            ))}
          </tbody>)}
        </table>
        <h6>{t("Total Price of All Recipes:")} {calculateTotalPrice()} €</h6> {/* Nouveau total ajouté */}

      </div>
    </>
  );
}

export default RecipeOrderTable;
