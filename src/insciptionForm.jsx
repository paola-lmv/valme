import { Form, Button } from 'react-bootstrap';
import NavbarUnLoged from './navbar_unloged';
import NavbarLoged from './navbar_loged';
import React, { useState, useEffect } from 'react';
import { BinIdInscription } from './acessCode';
import { getData, saveInscription } from './dataFunction';
import {useTranslation} from  "react-i18next";


function InscriptionForm({ isAuthenticated }) {
    // State hooks for managing the variable
    const { t, i18n } = useTranslation();
    const [formData, setFormData] = useState({
        Surname: '',
        LastName: '',
        adhesion: '',
        vege:'',
        comments: ''
    });
    const [inscriptions, setInscriptions] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch existing inscription data when the component is mounted
    useEffect(() => {
        const fetchInscription = async () => {
            const allInscription = await getData(BinIdInscription); // Call to fetch data from the server
            setInscriptions(allInscription.inscriptions); // Update state with the fetched inscriptions
            setLoading(false); // Set loading to false once data is fetched
        };
        fetchInscription(); // Call the function to fetch inscriptions
    }, []);

    // Function to handle changes in form input fields
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    // Function to handle form submission
    const handleSubmit = (e) => {
        e.preventDefault(); // Prevent page reload on form submit

        const updatedInscriptions = [formData, ...inscriptions];  // Add the new form data to the list of existing inscriptions
        saveInscription(updatedInscriptions, BinIdInscription, setInscriptions);// Save the updated inscriptions list to the server

        setFormData({
            Surname: '',
            LastName: '',
            adhesion: '',
            vege:'',
            comments: ''
        });// Reset the form fields after submission
    };

    return (
        <>
            {isAuthenticated ? (<NavbarLoged />) : (<NavbarUnLoged />)}
            <h2>{t("Registration for the Upcoming Event")}</h2>
            <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="Surname">
                    <Form.Label>{t("Surname")}</Form.Label>
                    <Form.Control
                        type="text"
                        name="Surname"
                        placeholder={t("Your Surname")}
                        value={formData.Surname}
                        onChange={handleChange} // Handle change in input value
                    />
                </Form.Group>

                <Form.Group className="mb-3" controlId="LastName">
                    <Form.Label>{t("Last Name")}</Form.Label>
                    <Form.Control
                        type="text"
                        name="LastName"
                        placeholder={t("Your Last Name")}
                        value={formData.LastName}
                        onChange={handleChange} // Handle change in input value
                    />
                </Form.Group>

                <Form.Group className="mb-3" controlId="adhesion">
                    <Form.Label>{t("Are you a member of the BDE?")}</Form.Label>
                    <Form.Select
                        name="adhesion"
                        value={formData.adhesion}
                        onChange={handleChange} // Handle change in select value
                    >
                        <option value="">{t("Select an option")}</option>
                        <option value="Yes">{t("Yes")}</option>
                        <option value="No">{t("No")}</option>
                    </Form.Select>
                </Form.Group>
                <Form.Group className="mb-3" controlId="vege">
                    <Form.Label>{t("Are you  vegetarian ?")}</Form.Label>
                    <Form.Select
                        name="vege"
                        value={formData.vege}
                        onChange={handleChange} // Handle change in select value
                    >
                        <option value="">{t("Select an option")}</option>
                        <option value="Yes">{t("Yes")}</option>
                        <option value="No">{t("No")}</option>
                    </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3" controlId="comments">
                    <Form.Label>{t("Any remarks or suggestions?")}</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            name="comments"
                            placeholder={t("Write your remarks or suggestions here...")}
                            value={formData.comments || ''}  // Use a fallback to an empty string
                            onChange={handleChange}
                    />
                </Form.Group>

                <Button variant="primary" type="submit">
                {t("Submit")}
                </Button>
            </Form>
        </>
    );
};

export default InscriptionForm;
