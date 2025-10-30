import React from "react";
import { Modal, Form, Button } from "react-bootstrap";

const ModalEdicionProducto = ({
  mostrarModalEditar,
  setMostrarModalEditar,
  productoEditado,
  manejoCambioInputEditar,
  editarProducto,
  categorias,
}) => {

  // Función para manejar la selección de imagen
  const manejarImagen = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validar tamaño (1MB = 1,048,576 bytes)
      if (file.size > 1048576) {
        alert("La imagen no debe exceder 1MB.");
        e.target.value = null; // Limpiar el input
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        manejoCambioInputEditar({
          target: {
            name: "imagen",
            value: reader.result, // Base64 string
          },
        });
      };
      reader.readAsDataURL(file);
    }
  };


  if (!productoEditado) return null;
  return (
    <Modal show={mostrarModalEditar} onHide={() => setMostrarModalEditar(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Editar Producto</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Nombre</Form.Label>
            <Form.Control
              type="text"
              name="nombre"
              value={productoEditado.nombre}
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
              value={productoEditado.descripcion}
              onChange={manejoCambioInputEditar}
              placeholder="Ingresa la descripción"
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Precio</Form.Label>
            <Form.Control
              type="number"
              name="precio"
              value={productoEditado.precio}
              onChange={manejoCambioInputEditar}
              placeholder="Ingresa el precio"
              min="0"
              step="0.01"
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Stock</Form.Label>
            <Form.Control
              type="number"
              name="stock"
              value={productoEditado.stock}
              onChange={manejoCambioInputEditar}
              placeholder="Ingresa el stock"
              min="0"
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Categoría</Form.Label>
            <Form.Select
              name="categoria"
              value={productoEditado.categoria}
              onChange={manejoCambioInputEditar}
            >
              <option value="">Selecciona una categoría</option>
              {categorias.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.nombre}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Imagen</Form.Label>
            <Form.Control
              type="file"
              accept="image/*"
              onChange={manejarImagen}
            />
            {productoEditado.imagen && (
              <img
                src={productoEditado.imagen}
                alt="Vista previa"
                style={{ width: "100px", height: "100px", objectFit: "cover", marginTop: "10px" }}
              />
            )}
          </Form.Group>

        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setMostrarModalEditar(false)}>
          Cancelar
        </Button>
        <Button variant="primary" onClick={editarProducto}>
          Actualizar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalEdicionProducto;