import { Container, Nav, Navbar, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useTranslation } from 'react-i18next';
import { changeLanguage } from 'i18next';
import { Link } from "react-router-dom";

function NavbarUnLoged() {
  const { t, i18n } = useTranslation();
  return (
    <>
      <Navbar bg="light" data-bs-theme="light">
        <Container>
          <Nav className="me-auto">
            {/* Modifie les liens pour inclure /valme */}
            <Link to="/inscription">changer</Link>
            <Nav.Link href="/menu">{t("Recipe Gallery")}</Nav.Link>
            <Nav.Link href="/valme/#/inscription">{t("Inscription")}</Nav.Link>
            <Nav.Link href="/valme/login">{t("Login")}</Nav.Link>
          </Nav>
          <Button
            variant="outline-primary"
            onClick={() =>
              changeLanguage(i18n.language === 'fr' ? 'en' : 'fr')
            }
          >
            {i18n.language === 'fr' ? 'English' : 'Français'}
          </Button>
        </Container>
      </Navbar>
    </>
  );
}

export default NavbarUnLoged;
