import React from "react";
import { Table, Button } from "react-bootstrap";

const TablaProductos = ({ productos, categorias, manejarEliminar, manejarEditar }) => {
  return (
    <Table striped bordered hover responsive>
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Descripción</th>
          <th>Precio</th>
          <th>Stock</th>
          <th>Categoría</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {productos.map((producto) => {
          const nombreCat = categorias.find((c) => c.id === producto.categoria)?.nombre || "Sin categoría";
          return (
            <tr key={producto.id}>
              <td>{producto.nombre}</td>
              <td>{producto.descripcion}</td>
              <td>${producto.precio}</td>
              <td>{producto.stock}</td>
              <td>{nombreCat}</td>
              <td>
                <Button
                  variant="outline-warning"
                  size="sm"
                  className="me-1"
                  onClick={() => manejarEditar(producto)}
                >
                  <i className="bi bi-pencil"></i>
                </Button>
                <Button
                  variant="outline-danger"
                  size="sm"
                  className="m-1"
                  onClick={() => manejarEliminar(producto)}
                >
                  <i className="bi bi-trash"></i>
                </Button>
              </td>
            </tr>
          );
        })}
      </tbody>
    </Table>
  );
};

export default TablaProductos;