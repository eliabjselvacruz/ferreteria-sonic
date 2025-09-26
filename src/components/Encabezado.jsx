import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Nav, Navbar, Offcanvas } from "react-bootstrap";

const Encabezado = () => {

  const [mostrarMenu, setMostrarMenu] = useState(false);

  const navigate = useNavigate();

  // Alternar visibilidad del menú
  const manejarToggle = () => setMostrarMenu(!mostrarMenu);
  
  // Navegar y cerrar menú
  const manejarNavegacion = (ruta) => {
    navigate(ruta);
    setMostrarMenu(false);
  };

  return (
    <Navbar expand="md" fixed="top" className="bg-primary" variant="dark">
      <Container>
        <Navbar.Brand
          onClick={() => manejarNavegacion("/inicio")}
          className="text-white fw-bold"
          style={{ cursor: "pointer" }}
        >
          Ferretría Sonic
        </Navbar.Brand>

        <Navbar.Toggle
          aria-controls="menu-offcanvas"
          onClick={manejarToggle}
          className="bg-primary"
        />

        <Navbar.Offcanvas
          id="menu-offcanvas"
          placement="end"
          show={mostrarMenu}
          onHide={() => setMostrarMenu(false)}
        >
          <Offcanvas.Header closeButton>
            <Offcanvas.Title>Menú Ferretería Sonic</Offcanvas.Title>
          </Offcanvas.Header>

          <Offcanvas.Body>
            <Nav className="flex-grow-1 pe-3">
              <Nav.Link onClick={() => manejarNavegacion("/inicio")}>Inicio</Nav.Link>
              <Nav.Link onClick={() => manejarNavegacion("/categorias")}>Categorías</Nav.Link>
              <Nav.Link onClick={() => manejarNavegacion("/productos")}>Productos</Nav.Link>
              <Nav.Link onClick={() => manejarNavegacion("/catalogo")}>Catálogo</Nav.Link>
              <Nav.Link onClick={() => manejarNavegacion("/empleados")}>Empleados</Nav.Link>
            </Nav>
          </Offcanvas.Body>

        </Navbar.Offcanvas>
      </Container>
    </Navbar>
  );
};

export default Encabezado;