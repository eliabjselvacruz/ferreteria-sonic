import React from "react";
import { Table, Button } from "react-bootstrap";
const TablaCategorias = ({ categorias, manejarEliminar }) => {

  return (
    <Table striped bordered hover responsive>
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Descripción</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {categorias.map((categoria) => (
          <tr key={categoria.id}>
            <td>{categoria.nombre}</td>
            <td>{categoria.descripcion}</td>
            <td>
              <Button
                variant="outline-danger"
                size="sm"
                className="m-1"
                onClick={() => manejarEliminar(categoria)}
              >
                <i className="bi bi-trash"></i>
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}

export default TablaCategorias;