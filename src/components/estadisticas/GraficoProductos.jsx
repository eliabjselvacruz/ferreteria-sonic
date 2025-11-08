import { Card } from "react-bootstrap";
import { Bar } from 'react-chartjs-2';
import Chart from 'chart.js/auto';

const GraficoProductos = ({ nombres, precios }) => {
  const data = {
    labels: nombres, // Nombres de los productos
    datasets: [
      {
        label: 'Precio (C$)',
        data: precios, // Precios de los productos
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Precios de Productos',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Precio (C$)',
        },
      },
      x: {
        title: {
          display: true,
          text: 'Productos',
        },
      },
    },
  };

  return (
    <div style={{ width: "100%", height: "400px" }}> {/* Altura fija para el contenedor */}
      <Card style={{ height: "100%" }}>
        <Card.Body>
          <Card.Title>Gráfico Productos</Card.Title>
          <div style={{ height: "100%", position: "relative" }}>
            <Bar data={data} options={options} />
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default GraficoProductos;