import NavbarUnLoged from './navbar_unloged'; 
import NavbarLoged from './navbar_loged';
import { Form, Button, Alert } from 'react-bootstrap';
import React, { useState, useRef, useEffect } from "react";
import { BinIdLogin } from './acessCode';
import { getData } from './dataFunction';
import {useTranslation} from "react-i18next";

function Login({ isAuthenticated, setAuthenticated }) {
    // Refs to reference the username and password input fields
    const usernameInputRef = useRef(); 
    const passwordInputRef = useRef(); 
    // State to hold login data 
    const [loginData, setLoginData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isErrorVisible, setIsErrorVisible] = useState(false);
    const { t, i18n } = useTranslation();

    // Fetch login data when the component mounts
    useEffect(() => {
        const fetchLoginData = async () => {
            try {
                const fetchedLoginData = await getData(BinIdLogin); // Fetch login data from API
                console.log(fetchedLoginData); // Log the fetched data to ensure it's correct
                setLoginData(fetchedLoginData.login); // Update state with fetched login data
                setIsLoading(false); // Set loading state to false once data is loaded
            } catch (error) {
                console.error("Error fetching login data", error); // Log errors if any
                setIsLoading(false); // Set loading state to false even if there's an error
            }
        };
        fetchLoginData(); // Call the function to fetch data
    }, []);

    // Handle form submission for login
    const handleSubmit = (e) => {
        if (!isLoading) {
            e.preventDefault(); // Prevent form from reloading the page
            console.log(loginData); // Log loginData to ensure it's being fetched correctly

            const username = usernameInputRef.current.value;
            const password = passwordInputRef.current.value;

            console.log("Username:", username); // Log the username (for debugging)
            console.log("Password:", password); // Log the password (for debugging)

            // Check if the entered username and password match any of the users in the login data
            const userFound = loginData.some(
                (user) => user.username === username && user.password === password
            );

            // If a match is found, authenticate the user
            if (userFound) {
                setAuthenticated(true); // Set authenticated state to true
            } else {
                // Show error message if login fails
                setIsErrorVisible(true);
                setTimeout(() => setIsErrorVisible(false), 3000); // Hide error message after 3 seconds
            }    
        }
    };

    return (
        <>
            {isAuthenticated ? (<NavbarLoged />) : (<NavbarUnLoged />)}
            <h2>{t("Login")}</h2> <br/>
            {isErrorVisible && (
                <Alert variant="danger" onClose={() => setIsErrorVisible(false)} dismissible>
                    Incorrect username or password.
                </Alert>
            )}

            <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="username">
                    <Form.Label>{t("Username")}</Form.Label>
                    <Form.Control type="text" placeholder={t("Your username")} ref={usernameInputRef} />
                </Form.Group>
                <Form.Group className="mb-3" controlId="password">
                    <Form.Label>{t("Password")}</Form.Label>
                    <Form.Control type="password" placeholder={t("Your password")} ref={passwordInputRef} />
                </Form.Group>
                <Button variant="primary" type="submit">
                    {t("Submit")}
                </Button>
            </Form>
        </>
    );
}

export default Login;
