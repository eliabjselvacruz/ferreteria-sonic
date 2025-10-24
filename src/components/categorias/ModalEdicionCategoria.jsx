
import React from "react";
import { Modal, Form, Button } from "react-bootstrap";

const ModalEdicionCategoria = ({
  mostrarModalEditar,
  setMostrarModalEditar,
  categoriaEditada,
  manejoCambioInputEditar,
  editarCategoria,
}) => {
  if (!categoriaEditada) return null;

  return (
    <Modal show={mostrarModalEditar} onHide={() => setMostrarModalEditar(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Editar Categoría</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Nombre</Form.Label>
            <Form.Control
              type="text"
              name="nombre"
              value={categoriaEditada.nombre}
              onChange={manejoCambioInputEditar}
              placeholder="Ingresa el nombre"
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Descripción</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="descripcion"
              value={categoriaEditada.descripcion}
              onChange={manejoCambioInputEditar}
              placeholder="Ingresa la descripción"
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setMostrarModalEditar(false)}>
          Cancelar
        </Button>
        <Button variant="primary" onClick={editarCategoria}>
          Actualizar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalEdicionCategoria;