import React from "react";
import { Modal, Button } from "react-bootstrap";

const ModalEliminacionProducto = ({
  mostrarModalEliminar,
  setMostrarModalEliminar,
  productoAEliminar,
  eliminarProducto,
}) => {
  return (
    <Modal
      show={mostrarModalEliminar}
      onHide={() => setMostrarModalEliminar(false)}
    >
      <Modal.Header closeButton>
        <Modal.Title>Confirmar Eliminación</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        ¿Estás seguro de que deseas eliminar el producto{" "}
        <strong>{productoAEliminar?.nombre}</strong>?
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="secondary"
          onClick={() => setMostrarModalEliminar(false)}
        >
          Cancelar
        </Button>
        <Button variant="danger" onClick={eliminarProducto}>
          Eliminar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalEliminacionProducto;