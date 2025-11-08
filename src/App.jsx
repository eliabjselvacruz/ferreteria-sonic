import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

//Importar componente Encabezado.
import Encabezado from "./components/Encabezado";

//Importar las vistas.
import Login from "./views/Login";
import Inicio from "./views/Inicio";
import Categorias from "./views/Categorias";
import Productos from "./views/Productos";
import Catalogo from "./views/Catalogo";
import Empleados from "./views/Empleados";
import Contador from "./views/Contador";
import Estadisticas from "./views/Estadisticas";

//Importar archivo de estilos.
import "./App.css";

const App = () => {
  return (
    <Router>

      <Encabezado />

      <main className="margen-superior-main">
        <Routes>
          <Route path="/inicio" element={<Inicio />} />
          <Route path="/categorias" element={<Categorias />} />
          <Route path="/productos" element={<Productos />} />
          <Route path="/catalogo" element={<Catalogo />} />
          <Route path="/empleados" element={<Empleados />} />
          <Route path="/estadisticas" element={<Estadisticas />} />
          <Route path="/contador" element={<Contador />} />
          <Route path="/" element={<Login />} />
          <Route path="*" element={<h2>404 - Página no encontrada</h2>} />
        </Routes>
      </main>
    </Router>
  );
}
export default App;
