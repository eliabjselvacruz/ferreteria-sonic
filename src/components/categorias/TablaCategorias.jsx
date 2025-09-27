import React from "react";
import { Table } from "react-bootstrap";

const TablaCategorias = ({ categorias }) => {
  return (
    <Table striped bordered hover responsive>
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Descripción</th>
        </tr>
      </thead>
      <tbody>
        {categorias.map((categoria) => (
          <tr key={categoria.id}>
            <td>{categoria.nombre}</td>
            <td>{categoria.descripcion}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default TablaCategorias;