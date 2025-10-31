import React, { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { db } from "../database/firebaseconfig";
import { collection, getDocs } from "firebase/firestore";
import TarjetaProducto from "../components/catalogo/TarjetaProducto";
import CuadroBusquedas from "../components/busquedas/CuadroBusquedas";


const Catalogo = () => {

  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const productosCollection = collection(db, "productos");
  const categoriasCollection = collection(db, "categorias");
  const [productosFiltrados, setProductosFiltrados] = useState([]);
  const [textoBusqueda, setTextoBusqueda] = useState("");

  const cargarProductos = async () => {
    try {
      const consulta = await getDocs(productosCollection);
      const datosProductos = consulta.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProductos(datosProductos);
      setProductosFiltrados(datosProductos);
      console.log("Productos cargados desde Firestore:", datosProductos);
    } catch (error) {
      console.error("Error al cargar productos:", error);
    }
  };

  const cargarCategorias = async () => {
    try {
      const consulta = await getDocs(categoriasCollection);
      const datosCategorias = consulta.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCategorias(datosCategorias);
      console.log("Categorías cargadas desde Firestore:", datosCategorias);
    } catch (error) {
      console.error("Error al cargar categorías:", error);
    }
  };

  useEffect(() => {
    cargarProductos();
    cargarCategorias();
  }, []);

  const manejarCambioBusqueda = (e) => {
    const texto = e.target.value.toLowerCase();
    setTextoBusqueda(texto);
    const filtrados = productos.filter((producto) => {
      const nombreCat =
        categorias.find((c) => c.id === producto.categoria)?.nombre || "";
      return (
        producto.nombre.toLowerCase().includes(texto) ||
        producto.descripcion.toLowerCase().includes(texto) ||
        nombreCat.toLowerCase().includes(texto) ||
        producto.precio.toString().includes(texto) ||
        producto.stock.toString().includes(texto)
      );
    });
    setProductosFiltrados(filtrados);
  };

  return (
    <Container className="mt-4">
      <h4>Catálogo de Productos</h4>
      <Row className="mb-3">
        <Col lg={6} md={8} sm={12}>
          <CuadroBusquedas
            textoBusqueda={textoBusqueda}
            manejarCambioBusqueda={manejarCambioBusqueda}
          />
        </Col>
      </Row>
      <Row>
        {productosFiltrados.length > 0 ? (
          productosFiltrados.map((producto) => (
            <Col lg={4} md={6} sm={12} key={producto.id} className="mb-4">
              <TarjetaProducto
                producto={producto}
                categorias={categorias}
              />
            </Col>
          ))
        ) : (
          <Col>
            <p>No se encontraron productos.</p>
          </Col>
        )}
      </Row>
    </Container>
  );


}

export default Catalogo;