import { useState } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import InscriptionForm from './insciptionForm';
import Login from './login';
import MenuCreate from './menuCreate';
import MenuDisplay from './menuDisplay';
import Forecast from './forecast';
import InscriptionManagement from './inscriptionManagement';
import RecipeManagement from './recipeManagement';
import RecipeOrderTable from './recipeOrderTable';
import DataBase from './dataBase';
import './i18n';

function App() {
  const [isAuthenticated, setAuthenticated] = useState(false);

  return (
    <Router basename="/valme"> {/* Utilisation du basename ici */}
      <Routes>
        <Route path="/" element={<MenuDisplay isAuthenticated={false} />} />
        <Route path="/menu" element={<MenuDisplay isAuthenticated={isAuthenticated} />} />
        <Route path="/inscription" element={<InscriptionForm isAuthenticated={isAuthenticated} />} />
        <Route 
          path="/login" 
          element={isAuthenticated ? <Navigate to="/menu" replace={true} /> : <Login isAuthenticated={isAuthenticated} setAuthenticated={setAuthenticated} />} 
        />
        <Route 
          path="/menuCreate" 
          element={isAuthenticated ? <MenuCreate isAuthenticated={isAuthenticated} /> : <Navigate to="/" replace={true} />} 
        />
        <Route 
          path="/forecast" 
          element={isAuthenticated ? <Forecast isAuthenticated={isAuthenticated} /> : <Navigate to="/" replace={true} />} 
        />
        <Route 
          path="/recipeManagement" 
          element={isAuthenticated ? <RecipeManagement isAuthenticated={isAuthenticated} /> : <Navigate to="/" replace={true} />} 
        />
        <Route 
          path="/inscriptionManagement" 
          element={isAuthenticated ? <InscriptionManagement isAuthenticated={isAuthenticated} /> : <Navigate to="/" replace={true} />} 
        />
        <Route 
          path="/recipeOrderTable" 
          element={isAuthenticated ? <RecipeOrderTable isAuthenticated={isAuthenticated} /> : <Navigate to="/" replace={true} />} 
        />
        <Route 
          path="/database" 
          element={isAuthenticated ? <DataBase isAuthenticated={isAuthenticated} /> : <Navigate to="/" replace={true} />} 
        />
      </Routes>
    </Router>
  );
}

export default App;
