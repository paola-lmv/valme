import NewIngredient from './newIngredient';
import React, { useState } from "react";
import { FormControl, FormLabel, Card, Button, Form, CardBody, CardHeader} from "react-bootstrap";
import {useTranslation} from  "react-i18next";

function NewRecipe({ addRecipe }) {
// State with initial recipe
const [title, setTitle] = useState("");
const [ingredients, setIngredient] = useState([]);
const [portions, setPortion] = useState([]);
const [description, setDescription] = useState("");
const [imageUrl, setImageUrl] = useState("")
const { t, i18n } = useTranslation();

const deleteIngredient = (indexToDelete) => {
  const updatedIngredient = ingredients.filter((_, index) => index !== indexToDelete);
  setIngredient(updatedIngredient)
};
// Fonction pour ajouter de nouveaux ingrédients à l'état
const handleIngredients = (ingredients) => {
  setIngredient((prev) => [...prev, ...ingredients]);
};
  const handleSubmit = (e) => {
    e.preventDefault(); // Prevents page refresh on form submit
    
    // Create a new post object
    const newRecipe = {
      title,
      ingredients,
      portions,
      description,
      imageUrl
    };
    
    // Add the new post to the App state
    addRecipe(newRecipe);
    

    // Clear the input fields after submission
    setTitle("");
    setIngredient([]);
    setDescription("");
    setPortion("");
    setImageUrl("");
  };

  return (
    <Card className="new-recipe mt-3">
      <CardHeader>{t("Create a New Recipe")}</CardHeader>
      <CardBody>
      <Form onSubmit={handleSubmit} className="mb-2">
        <div>
          <FormLabel htmlFor="title">{t("Title")}:</FormLabel>
          <FormControl
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
        <NewIngredient  handleIngredients={handleIngredients} ingredients={ingredients} deleteIngredient={deleteIngredient}/>
        </div>
        <div>
          <FormLabel htmlFor="portion">{t("Portion")}:</FormLabel>
          <FormControl
            id="portion"
            value={portions}
            onChange={(e) => setPortion(e.target.value)}
            required
          />
          <small>{t("The portion corresponds to the number of people the recipe is intended for.")}</small> {/* Détail de la proportion */}
        </div>
        <br/>
        <div>
          <FormLabel htmlFor="description">{t("Description")}:</FormLabel>
          <FormControl
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
          <small>{t("You can add the preparation steps for the recipe here")}</small> {/* Détail de la proportion */}
        </div>
        <br/>
        <div>
          <FormLabel htmlFor="imageUrl">{t("Image")}:</FormLabel>
          <FormControl
            type="text"
            id="imageUrl"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
          />
          <small>{t("Enter the recipe image URL.")}</small> {/* Détail de la proportion */}

        </div>
        <div className="mt-3">
          <Button type="submit">{t("Create")}</Button>
        </div>
       
      </Form> </CardBody>
    </Card>
  );
}


export default NewRecipe;