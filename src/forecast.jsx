import React, { useState, useEffect } from 'react'; 
import NavbarUnLoged from './navbar_unloged';
import NavbarLoged from './navbar_loged';
import { BinIdIngredient, BinIdRecipe } from './acessCode';
import { getData, SyncIngredients, calculateIngredientPrice, calculateMinPurchaseQty, saveIngredient2 } from './dataFunction';
import { useTranslation } from "react-i18next";

function Forecast({ isAuthenticated }) {
  // State hooks for managing ingredients, recipes, and loading status
  const [ingredientsList, setIngredientsList] = useState([]);
  const [recipesList, setRecipesList] = useState([]);
  const [isIngredientsLoading, setIsIngredientsLoading] = useState(true);
  const [isRecipesLoading, setIsRecipesLoading] = useState(true);
  const { t, i18n } = useTranslation();

  // Fetching all recipes and setting the state once data is retrieved
  useEffect(() => {
    const fetchRecipes = async () => {
      const allRecipes = await getData(BinIdRecipe); // Calling the function to fetch recipe data
      setRecipesList(allRecipes.recipes);
      setIsRecipesLoading(false); 
    };
    fetchRecipes();
    const fetchIngredients = async () => {
      const allIngredients = await getData(BinIdIngredient); 
      setIngredientsList(allIngredients.ingredients);
      setIsIngredientsLoading(false); 
    };
    fetchIngredients();
    recalculateIngredientData()
  }, []); // Empty dependency array to only run on component mount

  // Synchronize ingredients with the recipes data (called once after data is loaded)
  SyncIngredients(recipesList, ingredientsList, isIngredientsLoading, isRecipesLoading, BinIdIngredient, setIngredientsList); 

  // Function to recalculate ingredient data based on recipes
  const recalculateIngredientData = () => {
    console.log("lala")
    ingredientsList.forEach((ingredient) => {
      console.log(ingredient)
      let totalMinPurchaseQty = 0;
      // Iterate through all recipes that use the current ingredient
      ingredient.listRecipe.forEach((recipeName) => {
        console.log(recipeName)
        const matchingRecipe = recipesList.find(
          recipe => recipe.title === recipeName
        );
        const commandQty = parseFloat(matchingRecipe.command); // Recipe command quantity
        const matchingIngredient = matchingRecipe.ingredients.find(
          ingredientInRecipe => ingredientInRecipe.type === ingredient.type
        );
        const ingredientQty = parseFloat(matchingIngredient.quantity); // Ingredient quantity in the recipe
        const portionQty = parseFloat(matchingRecipe.portions); // Portion size in the recipe
        console.log("ingredientQty",ingredientQty)
        console.log("commandQty",commandQty)
        console.log("portionQty",portionQty)
        // Calculate the minimum purchase quantity for the ingredient in this recipe and add it to the total minimun purchase quantity
        totalMinPurchaseQty += calculateMinPurchaseQty(commandQty, ingredientQty, portionQty);
      });
      
      // Update the ingredient's minimum purchase quantity
      ingredient.minPurchaseQty= parseFloat(totalMinPurchaseQty.toFixed(2));
      // Calculate the ingredient price
      ingredient.ingredientPrice = parseFloat(calculateIngredientPrice(ingredient.unitPrice, ingredient.purchaseQty, ingredient.priceQty).toFixed(2)) ?? "undefined";
    });
    // Save the updated ingredient data
    saveIngredient2(ingredientsList, BinIdIngredient, setIngredientsList);
  };

  // Recalculate ingredient data when loading states change
  useEffect(() => {
    if (!isIngredientsLoading && !isRecipesLoading) {
      recalculateIngredientData();
    }
  }, [isIngredientsLoading, isRecipesLoading]);

  // Function to handle saving and recalculating the ingredient data
  const handleSaveAndRecalculate = () => {
    recalculateIngredientData(); // Recalculate data on save
  };

  // Function to handle ingredient value changes
  const handleChange = (index, field, value) => {
    const updatedIngredients = [...ingredientsList]; 
    updatedIngredients[index][field] = value; // Update the specific field for the selected ingredient
    setIngredientsList(updatedIngredients); // Set the updated ingredients list
  };

  const handleCopyMinToPurchase = () => {
    const updatedIngredients = ingredientsList.map(ingredient => ({
      ...ingredient,
      purchaseQty: ingredient.minPurchaseQty
    }));
    setIngredientsList(updatedIngredients);
    saveIngredient2(updatedIngredients, BinIdIngredient, setIngredientsList);
    recalculateIngredientData();
  };

  const totalIngredientPrice = ingredientsList.reduce((sum, ingredient) => sum + (ingredient.ingredientPrice || 0), 0).toFixed(2);


  return (
    <>
      {isAuthenticated ? <NavbarLoged /> : <NavbarUnLoged />}
      <h2>{t("Ingredients Table")}</h2>

      <button onClick={handleCopyMinToPurchase} style={{ marginTop: '10px', marginLeft: '10px', padding: '10px', fontSize: '16px' }}>
        {t("Copy Minimum Purchase to Chosen Purchase")}
      </button>
      {isIngredientsLoading ? (
        <p>{t("Loading")}...</p>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table border="1" style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th>{t("Name")}</th>
                <th>{t("Minimum Purchase Quantity")}</th>
                <th>{t("Chosen Purchase Quantity")}</th>
                <th>{t("Measure")}</th>
                <th>{t("Price €")}</th>
              </tr>
            </thead>
            <tbody>
              {ingredientsList.map((ingredient, index) => (
                <tr key={index}>
                  <td>{ingredient.type}</td>
                  <td>{ingredient.minPurchaseQty}</td>
                  <td>
                    <input
                      type="number"
                      value={ingredient.purchaseQty}
                      onChange={(e) => handleChange(index, 'purchaseQty', e.target.value)}
                    />
                  </td>
                  <td>{ingredient.measure}</td>
                  <td>{ingredient.ingredientPrice}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ marginTop: '20px', fontSize: '18px', fontWeight: 'bold' }}>
            <strong>{t("Total Price")}: {totalIngredientPrice} € </strong>
          </div>
          <button onClick={handleSaveAndRecalculate} style={{ marginTop: '20px', padding: '10px', fontSize: '16px' }}>
            {t("Save and Recalculate")}
          </button>
          <p>La modification d'une valeur peut prendre un peu de temps, le tableau met un moment à réagir. Merci de faire preuve de patience !</p>
        </div>
      )}
    </>
  );
}

export default Forecast;
