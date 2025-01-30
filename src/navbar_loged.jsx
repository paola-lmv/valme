import {Container, Nav, Navbar,Button} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import {useTranslation} from  "react-i18next";
import { changeLanguage } from "i18next";


function NavbarLoged() {
    const { t, i18n } = useTranslation();
    return (
        <>
            <Navbar bg="light" data-bs-theme="light">
                <Container>
                  <Navbar.Brand href="/">{t("Log Out")}</Navbar.Brand>
                  <Nav className="me-auto">
                    <Nav.Link href="/#/menu">{t("Recipe Gallery")}</Nav.Link>
                    <Nav.Link href="/#/inscriptionManagement">{t("Registration List")} </Nav.Link>
                    <Nav.Link href="/#/menuCreate">{t("Add New Recipe")}</Nav.Link>
                    <Nav.Link href="/#/recipeManagement">{t("Recipe Manager")}</Nav.Link>
                    < Nav.Link href="/#/database">{t("Database Control")}</Nav.Link>        
                   < Nav.Link href="/#/recipeOrderTable">{t("Order Management")}</Nav.Link>
                   <Nav.Link href="/#/forecast">{t("The Forecast")}</Nav.Link>        
                  </Nav>
                  <Button variant="outline-primary" onClick={() =>  changeLanguage(i18n.language === 'fr' ? 'en' : 'fr')}>
                {i18n.language === 'fr' ? 'English' : 'Français'}
            </Button>
                </Container>
            </Navbar>
            
        </>
    )
};

export default NavbarLoged;