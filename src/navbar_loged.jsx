import { Container, Nav, Navbar, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useTranslation } from 'react-i18next';
import { changeLanguage } from 'i18next';

function NavbarLoged() {
  const { t, i18n } = useTranslation();
  return (
    <>
      <Navbar bg="light" data-bs-theme="light">
        <Container>
          <Navbar.Brand href="/valme/">{t("Log Out")}</Navbar.Brand>
          <Nav className="me-auto">
            {/* Ajout de /valme devant chaque lien */}
            <Nav.Link href="/valme/#/menu">{t("Recipe Gallery")}</Nav.Link>
            <Nav.Link href="/valme/#/inscriptionManagement">{t("Registration List")}</Nav.Link>
            <Nav.Link href="/valme/#/menuCreate">{t("Add New Recipe")}</Nav.Link>
            <Nav.Link href="/valme/#/recipeManagement">{t("Recipe Manager")}</Nav.Link>
            <Nav.Link href="/valme/#/database">{t("Database Control")}</Nav.Link>
            <Nav.Link href="/valme/#/recipeOrderTable">{t("Order Management")}</Nav.Link>
            <Nav.Link href="/valme/#/forecast">{t("The Forecast")}</Nav.Link>
          </Nav>
          <Button
            variant="outline-primary"
            onClick={() => changeLanguage(i18n.language === 'fr' ? 'en' : 'fr')}
          >
            {i18n.language === 'fr' ? 'English' : 'Français'}
          </Button>
        </Container>
      </Navbar>
    </>
  );
}

export default NavbarLoged;
