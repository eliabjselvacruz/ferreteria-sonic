import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { db } from "../database/firebaseconfig";
import { collection, getDocs, addDoc, doc, deleteDoc, updateDoc } from "firebase/firestore";
import TablaProductos from "../components/productos/TablaProductos";
import ModalRegistroProducto from "../components/productos/ModalRegistroProducto";
import ModalEliminacionProducto from "../components/productos/ModalEliminacionProducto";
import ModalEdicionProducto from "../components/productos/ModalEdicionProducto";
import CuadroBusquedas from "../components/busquedas/CuadroBusquedas";

const Productos = () => {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const productosCollection = collection(db, "productos");
  const categoriasCollection = collection(db, "categorias");
  const [productosFiltrados, setProductosFiltrados] = useState([]);
  const [textoBusqueda, setTextoBusqueda] = useState("");

  // Estados para manejo del modal de registro
  const [mostrarModal, setMostrarModal] = useState(false);
  const [nuevoProducto, setNuevoProducto] = useState({
    nombre: "",
    descripcion: "",
    precio: null,
    stock: null,
    categoria: "",
    imagen: ""
  });

  const [mostrarModalEliminar, setMostrarModalEliminar] = useState(false);
  const [productoAEliminar, setProductoAEliminar] = useState(null);

  // Estado para el modal de edición
  const [mostrarModalEditar, setMostrarModalEditar] = useState(false);
  const [productoEditado, setProductoEditado] = useState(null);

  // Manejador de cambios en inputs del formulario de edición
  const manejoCambioInputEditar = (e) => {
    const { name, value } = e.target;
    setProductoEditado((prev) => ({
      ...prev,
      [name]: name === "precio" || name === "stock" ? Number(value) || 0 : value,
    }));
  };

  // Función para abrir el modal de edición con datos prellenados
  const manejarEditar = (producto) => {
    setProductoEditado({ ...producto });
    setMostrarModalEditar(true);
  };

  // Función para actualizar un producto existente
  const editarProducto = async () => {
    if (
      !productoEditado?.nombre ||
      !productoEditado?.descripcion ||
      !productoEditado?.precio ||
      !productoEditado?.stock ||
      !productoEditado?.categoria
    ) {
      alert("Por favor, completa todos los campos antes de actualizar.");
      return;
    }
    setMostrarModalEditar(false);
    try {
      const productoRef = doc(db, "productos", productoEditado.id);
      await updateDoc(productoRef, {
        nombre: productoEditado.nombre,
        descripcion: productoEditado.descripcion,
        precio: productoEditado.precio,
        stock: productoEditado.stock,
        categoria: productoEditado.categoria,
        imagen: productoEditado.imagen
      });
      cargarProductos();
      console.log("Producto actualizado exitosamente.");
      setProductoEditado(null);
    } catch (error) {
      console.error("Error al actualizar el producto:", error);
      alert("Error al actualizar el producto: " + error.message);
    }
  };

  // Manejador de cambios en inputs del formulario de nuevo producto
  const manejoCambioInput = (e) => {
    const { name, value } = e.target;
    setNuevoProducto((prev) => ({
      ...prev,
      [name]: name === "precio" || name === "stock" ? Number(value) || 0 : value,
    }));
  };

  // Función para agregar un nuevo producto
  const agregarProducto = async () => {
    // Validar campos requeridos
    if (
      !nuevoProducto.nombre ||
      !nuevoProducto.descripcion ||
      !nuevoProducto.precio ||
      !nuevoProducto.stock ||
      !nuevoProducto.categoria
    ) {
      alert("Por favor, completa todos los campos antes de guardar.");
      return;
    }
    // Cerrar modal
    setMostrarModal(false);
    try {
      // Referencia a la colección de productos en Firestore
      await addDoc(productosCollection, nuevoProducto);
      // Limpiar campos del formulario
      setNuevoProducto({
        nombre: "",
        descripcion: "",
        precio: null,
        stock: null,
        categoria: "",
        imagen: ""
      });
      cargarProductos();
      console.log("Producto agregado exitosamente.");
    } catch (error) {
      console.error("Error al agregar el producto:", error);
      alert("Error al agregar el producto: " + error.message);
    }
  };

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

  // Función para manejar el clic en el botón "Eliminar"
  const manejarEliminar = (producto) => {
    setProductoAEliminar(producto);
    setMostrarModalEliminar(true);
  };

  // Función para eliminar un producto
  const eliminarProducto = async () => {
    if (!productoAEliminar) return;
    try {
      const productoRef = doc(db, "productos", productoAEliminar.id);
      await deleteDoc(productoRef);
      cargarProductos();
      console.log("Producto eliminado exitosamente.");
      setMostrarModalEliminar(false);
      setProductoAEliminar(null);
    } catch (error) {
      console.error("Error al eliminar el producto:", error);
      alert("Error al eliminar el producto: " + error.message);
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
      <h4>Gestión de Productos</h4>
      <Row>
        <Col lg={3} md={4} sm={4} xs={5}>
          <Button
            className="mb-3"
            onClick={() => setMostrarModal(true)}
            style={{ width: "100%" }}
          >
            Agregar producto
          </Button>
        </Col>
        <Col lg={5} md={8} sm={8} xs={7}>
          <CuadroBusquedas
            textoBusqueda={textoBusqueda}
            manejarCambioBusqueda={manejarCambioBusqueda}
          />
        </Col>
      </Row>

      <TablaProductos
        productos={productosFiltrados}
        categorias={categorias}
        manejarEliminar={manejarEliminar}
        manejarEditar={manejarEditar}
      />

      <ModalRegistroProducto
        mostrarModal={mostrarModal}
        setMostrarModal={setMostrarModal}
        nuevoProducto={nuevoProducto}
        manejoCambioInput={manejoCambioInput}
        agregarProducto={agregarProducto}
        categorias={categorias}
      />

      <ModalEliminacionProducto
        mostrarModalEliminar={mostrarModalEliminar}
        setMostrarModalEliminar={setMostrarModalEliminar}
        productoAEliminar={productoAEliminar}
        eliminarProducto={eliminarProducto}
      />

      <ModalEdicionProducto
        mostrarModalEditar={mostrarModalEditar}
        setMostrarModalEditar={setMostrarModalEditar}
        productoEditado={productoEditado}
        manejoCambioInputEditar={manejoCambioInputEditar}
        editarProducto={editarProducto}
        categorias={categorias}
      />
    </Container>
  );
};

export default Productos;