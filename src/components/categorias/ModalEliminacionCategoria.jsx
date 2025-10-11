import React from "react";
import { Modal, Button } from "react-bootstrap";

const ModalEliminacionCategoria = ({
  mostrarModalEliminar,
  setMostrarModalEliminar,
  categoriaAEliminar,
  eliminarCategoria,
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
        ¿Estás seguro de que deseas eliminar la categoría{" "}
        <strong>{categoriaAEliminar?.nombre}</strong>?
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="secondary"
          onClick={() => setMostrarModalEliminar(false)}
        >
          Cancelar
        </Button>
        <Button variant="danger" onClick={eliminarCategoria}>
          Eliminar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalEliminacionCategoria;