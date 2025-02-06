import React, { useState, useEffect } from "react";
import { FormControl, FormLabel, Card, Button, Form, CardBody, CardHeader } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import NewIngredient from './newIngredient';

function NewRecipe({ addRecipe, eventsList }) {
  // State avec les valeurs par défaut de la recette
  const [title, setTitle] = useState("");
  const [ingredients, setIngredient] = useState([]);
  const [portions, setPortion] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [selectedEvent, setSelectedEvent] = useState(""); // Événement sélectionné
  const { t, i18n } = useTranslation();

  // Fonction pour supprimer un ingrédient
  const deleteIngredient = (indexToDelete) => {
    const updatedIngredient = ingredients.filter((_, index) => index !== indexToDelete);
    setIngredient(updatedIngredient);
  };

  // Fonction pour ajouter un nouvel ingrédient
  const handleIngredients = (ingredients) => {
    setIngredient((prev) => [...prev, ...ingredients]);
  };

  // Fonction de soumission du formulaire
  const handleSubmit = (e) => {
    e.preventDefault(); // Empêche le rechargement de la page

    // Crée un objet de nouvelle recette avec l'événement sélectionné
    const newRecipe = {
      title,
      ingredients,
      portions,
      description,
      imageUrl,
      event: selectedEvent // Ajouter l'événement à la recette
    };

    // Ajouter la recette avec l'événement à l'état principal
    addRecipe(newRecipe);

    // Réinitialisation des champs du formulaire
    setTitle("");
    setIngredient([]);
    setDescription("");
    setPortion("");
    setImageUrl("");
    setSelectedEvent(""); // Réinitialiser l'événement sélectionné
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

          {/* Gestion des ingrédients */}
          <div>
            <NewIngredient handleIngredients={handleIngredients} ingredients={ingredients} deleteIngredient={deleteIngredient} />
          </div>

          <div>
            <FormLabel htmlFor="portion">{t("Portion")}:</FormLabel>
            <FormControl
              id="portion"
              value={portions}
              onChange={(e) => setPortion(e.target.value)}
              required
            />
            <small>{t("The portion corresponds to the number of people the recipe is intended for.")}</small>
          </div>
          <br />

          <div>
            <FormLabel htmlFor="description">{t("Description")}:</FormLabel>
            <FormControl
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
            <small>{t("You can add the preparation steps for the recipe here")}</small>
          </div>
          <br />

          <div>
            <FormLabel htmlFor="imageUrl">{t("Image")}:</FormLabel>
            <FormControl
              type="text"
              id="imageUrl"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
            />
            <small>{t("Enter the recipe image URL.")}</small>
          </div>

          {/* Sélection de l'événement auquel la recette appartient */}
          <div>
            <FormLabel htmlFor="event">{t("Select Event")}</FormLabel>
            <FormControl
              as="select"
              id="event"
              value={selectedEvent}
              onChange={(e) => setSelectedEvent(e.target.value)}
              required
            >
              <option value="">{t("Select an Event")}</option>
              {eventsList && eventsList.length > 0 && eventsList.map((event, index) => (
                <option key={index} value={event.title}>{event.title}</option>
              ))}
            </FormControl>
          </div>

          <div className="mt-3">
            <Button type="submit">{t("Create")}</Button>
          </div>
        </Form>
      </CardBody>
    </Card>
  );
}

export default NewRecipe;
