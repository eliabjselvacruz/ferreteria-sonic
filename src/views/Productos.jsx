import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { db } from "../database/firebaseconfig";
import { collection, getDocs, addDoc, doc, deleteDoc, updateDoc } from "firebase/firestore";
import TablaProductos from "../components/productos/TablaProductos";
import ModalRegistroProducto from "../components/productos/ModalRegistroProducto";
import ModalEliminacionProducto from "../components/productos/ModalEliminacionProducto";
import ModalEdicionProducto from "../components/productos/ModalEdicionProducto";
import CuadroBusquedas from "../components/busquedas/CuadroBusquedas";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

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

  const generarPDFProductos = () => {

    const doc = new jsPDF(); 

    // Encabezado del PDF
    doc.setFillColor(28, 41, 51);
    doc.rect(0, 0, 220, 30, 'F'); // ancho completo, alto 30

    // Título centrado con texto blanco
    doc.setTextColor(255, 255, 255); // Color del título
    doc.setFontSize(28);
    doc.text("Lista de Productos", doc.internal.pageSize.getWidth() / 2, 18, { align: "center" });

    const columnas = ["#", "Nombre", "Precio", "Categoría"];
    const filas = productosFiltrados.map((producto, index) => [
      index + 1,
      producto.nombre,
      `C$ ${producto.precio}`,
      categorias.find((c) => c.id === producto.categoria)?.nombre || "Sin categoría"
    ]);

    // Marcador para mostrar el total de páginas
    const totalPaginas = "{total_pages_count_string}";

    //Configuración de la tabla
    autoTable(doc, {
      head: [columnas],
      body: filas,
      startY: 40,
      theme: "grid",
      styles: { fontSize: 10, cellPadding: 2 },
      margin: { top: 20, left: 14, right: 14 },
      tableWidth: "auto", // Ajuste de ancho automatico
      columnStyles: {
        0: { cellWidth: 'auto' }, // Ajuste de ancho automatico
        1: { cellWidth: 'auto' },
        2: { cellWidth: 'auto' },
      },
      pageBreak: "auto",
      rowPageBreak: "auto",
      // Hook que se ejecuta al dibujar cada página
      didDrawPage: function (data) {
        // Altura y ancho de la página actual
        const alturaPagina = doc.internal.pageSize.getHeight();
        const anchoPagina = doc.internal.pageSize.getWidth();

        // Número de página actual
        const numeroPagina = doc.internal.getNumberOfPages();

        // Definir texto de número de página en el centro del documento
        doc.setFontSize(10);
        doc.setTextColor(0, 0, 0);
        const piePagina = `Página ${numeroPagina} de ${totalPaginas}`;
        doc.text(piePagina, anchoPagina / 2 + 15, alturaPagina - 10, { align: "center" });
      },
    });

    // Actualizar el marcador con el total real de páginas
    if (typeof doc.putTotalPages === 'function') {
      doc.putTotalPages(totalPaginas);
    }

    // Guardar el PDF con un nombre basado en la fecha actual
    const fecha = new Date();
    const dia = String(fecha.getDate()).padStart(2, '0');
    const mes = String(fecha.getMonth() + 1).padStart(2, '0');
    const anio = fecha.getFullYear();
    const nombreArchivo = `productos_${dia}${mes}${anio}.pdf`;

    // Guardar el documento PDF
    doc.save(nombreArchivo);
  };

  const exportarExcelProductos = () => {
    // Estructura de datos para la hoja Excel
    const datos = productosFiltrados.map((producto, index) => ({
      "#": index + 1,
      Nombre: producto.nombre,
      Precio: parseFloat(producto.precio),
      Categoría: categorias.find((c) => c.id === producto.categoria)?.nombre || "Sin categoría"
    }));

    // Crear hoja y libro Excel
    const hoja = XLSX.utils.json_to_sheet(datos);
    const libro = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(libro, hoja, 'Productos');

    // Crear el archivo binario
    const excelBuffer = XLSX.write(libro, { bookType: 'xlsx', type: 'array' });

    // Guardar el Excel con un nombre basado en la fecha actual
    const fecha = new Date();
    const dia = String(fecha.getDate()).padStart(2, '0');
    const mes = String(fecha.getMonth() + 1).padStart(2, '0');
    const anio = fecha.getFullYear();

    const nombreArchivo = `Productos_${dia}${mes}${anio}.xlsx`;

    // Guardar archivo
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(blob, nombreArchivo);
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
        <Col lg={2} md={4} sm={4} xs={5}>
          <Button
            className="mb-3" 
            onClick={generarPDFProductos}
            variant="secondary"
            style={{ width: "100%" }}
          >
            Generar PDF
          </Button>
        </Col>
        <Col lg={2} md={4} sm={4} xs={5}>
          <Button
            className="mb-3" 
            onClick={exportarExcelProductos}
            variant="secondary"
            style={{ width: "100%" }}
          >
            Generar Excel
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