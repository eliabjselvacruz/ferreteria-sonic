import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { db } from "../database/firebaseconfig";
import { collection, getDocs, addDoc, doc, deleteDoc, updateDoc } from "firebase/firestore";
import TablaCategorias from "../components/categorias/TablaCategorias";
import ModalRegistroCategoria from "../components/categorias/ModalRegistroCategoria";
import ModalEliminacionCategoria from "../components/categorias/ModalEliminacionCategoria";
import ModalEdicionCategoria from "../components/categorias/ModalEdicionCategoria";

const Categorias = () => {

  const [categorias, setCategorias] = useState([]);
  const categoriasCollection = collection(db, "categorias");

  // Estados para manejo del modal de registro
  const [mostrarModal, setMostrarModal] = useState(false);
  const [nuevaCategoria, setNuevaCategoria] = useState({
    nombre: "",
    descripcion: "",
  });

  const [mostrarModalEliminar, setMostrarModalEliminar] = useState(false);
  const [categoriaAEliminar, setCategoriaAEliminar] = useState(null);

  // Estado para el modal de edición
  const [mostrarModalEditar, setMostrarModalEditar] = useState(false);
  const [categoriaEditada, setCategoriaEditada] = useState(null);

  // Manejador de cambios en inputs del formulario de edición
  const manejoCambioInputEditar = (e) => {
    const { name, value } = e.target;
    setCategoriaEditada((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Función para abrir el modal de edición con datos prellenados
  const manejarEditar = (categoria) => {
    setCategoriaEditada({ ...categoria });
    setMostrarModalEditar(true);
  };

  // Función para actualizar una categoría existente
  const editarCategoria = async () => {
    if (!categoriaEditada?.nombre || !categoriaEditada?.descripcion) {
      alert("Por favor, completa todos los campos antes de actualizar.");
      return;
    }

    setMostrarModalEditar(false);

    try {
      const categoriaRef = doc(db, "categorias", categoriaEditada.id);
      await updateDoc(categoriaRef, {
        nombre: categoriaEditada.nombre,
        descripcion: categoriaEditada.descripcion,
      });
      cargarCategorias();
      console.log("Categoría actualizada exitosamente.");
      setCategoriaEditada(null);
    } catch (error) {
      console.error("Error al actualizar la categoría:", error);
      alert("Error al actualizar la categoría: " + error.message);
    }
  };

  // Manejador de cambios en inputs del formulario de nueva categoría
  const manejoCambioInput = (e) => {
    const { name, value } = e.target;
    setNuevaCategoria((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Función para agregar una nueva categoría
  const agregarCategoria = async () => {
    // Validar campos requeridos
    if (!nuevaCategoria.nombre || !nuevaCategoria.descripcion) {
      alert("Por favor, completa todos los campos antes de guardar.");
      return;
    }
    // Cerrar modal
    setMostrarModal(false);

    try {
      // Referencia a la colección de categorías en Firestore
      const categoriasCollection = collection(db, "categorias");
      // Agregar a Firestore
      await addDoc(categoriasCollection, nuevaCategoria);
      // Limpiar campos del formulario
      setNuevaCategoria({ nombre: "", descripcion: "" });
      cargarCategorias();
      console.log("Categoría agregada exitosamente.");
    } catch (error) {
      console.error("Error al agregar la categoría:", error);
      alert("Error al agregar la categoría: " + error.message);
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
  const manejarEliminar = (categoria) => {
    setCategoriaAEliminar(categoria);
    setMostrarModalEliminar(true);
  };

  // Función para eliminar una categoría
  const eliminarCategoria = async () => {
    if (!categoriaAEliminar) return;

    try {
      const categoriaRef = doc(db, "categorias", categoriaAEliminar.id);
      await deleteDoc(categoriaRef);
      cargarCategorias();
      console.log("Categoría eliminada exitosamente.");
      setMostrarModalEliminar(false);
      setCategoriaAEliminar(null);
    } catch (error) {
      console.error("Error al eliminar la categoría:", error);
      alert("Error al eliminar la categoría: " + error.message);
    }
  };

  useEffect(() => {
    cargarCategorias();
  }, []);

  return (
    <Container className="mt-4">
      <h4>Gestión de Categorías</h4>
      <Row>
        <Col lg={3} md={4} sm={4} xs={5}>
          <Button
            className="mb-3"
            onClick={() => setMostrarModal(true)}
            style={{ width: "100%" }}
          >
            Agregar categoría
          </Button>
        </Col>
      </Row>

      <TablaCategorias 
        categorias={categorias}
        manejarEliminar={manejarEliminar}
        manejarEditar={manejarEditar}
      />

      <ModalRegistroCategoria
        mostrarModal={mostrarModal}
        setMostrarModal={setMostrarModal}
        nuevaCategoria={nuevaCategoria}
        manejoCambioInput={manejoCambioInput}
        agregarCategoria={agregarCategoria}
      />

      <ModalEliminacionCategoria
        mostrarModalEliminar={mostrarModalEliminar}
        setMostrarModalEliminar={setMostrarModalEliminar}
        categoriaAEliminar={categoriaAEliminar}
        eliminarCategoria={eliminarCategoria}
      />

      <ModalEdicionCategoria
        mostrarModalEditar={mostrarModalEditar}
        setMostrarModalEditar={setMostrarModalEditar}
        categoriaEditada={categoriaEditada}
        manejoCambioInputEditar={manejoCambioInputEditar}
        editarCategoria={editarCategoria}
      />


    </Container>
  );
}

export default Categorias;