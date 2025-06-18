const productosDiv = document.getElementById('productos');
const agregarBtn = document.getElementById('agregarProducto');
const totalVentaInput = document.getElementById('totalVenta');
const totalGananciaInput = document.getElementById('totalGanancia');

let contador = 0;

function crearProducto() {
  contador++;

  const div = document.createElement('div');
  div.className = 'producto';
  div.innerHTML = `
    <h3>Producto ${contador}</h3>
    <label>Nombre del Producto:</label>
    <input type="text" class="nombreProducto">

    <label>Cantidad:</label>
    <input type="number" class="cantidad" min="1">

    <label>Precio de Costo:</label>
    <div class="input-simulado">
      <span class="simbolo-simulado">S/.</span>
      <input type="number" class="costo input-con-simbolo-real" step="0.01">
    </div>

    <label>Precio de Venta:</label>
    <div class="input-simulado">
      <span class="simbolo-simulado">S/.</span>
      <input type="number" class="venta input-con-simbolo-real" step="0.01">
    </div>

    <label>Venta Total:</label>
    <div class="input-simulado">
      <span class="simbolo-simulado">S/.</span>
      <input type="text" class="ventaTotal input-con-simbolo-real" readonly>
    </div>

    <label>Ganancia:</label>
    <div class="input-simulado">
      <span class="simbolo-simulado">S/.</span>
      <input type="text" class="ganancia input-con-simbolo-real" readonly>
    </div>
  `;

  productosDiv.appendChild(div);

  const inputs = div.querySelectorAll('.cantidad, .costo, .venta');
  inputs.forEach(input => input.addEventListener('input', calcularTotales));
}

function calcularTotales() {
  const productos = document.querySelectorAll('.producto');

  let totalVenta = 0;
  let totalGanancia = 0;

  productos.forEach(prod => {
    const cantidad = parseFloat(prod.querySelector('.cantidad').value) || 0;
    const costo = parseFloat(prod.querySelector('.costo').value) || 0;
    const venta = parseFloat(prod.querySelector('.venta').value) || 0;

    const ventaTotal = cantidad * venta;
    const ganancia = ventaTotal - (cantidad * costo);

    prod.querySelector('.ventaTotal').value = ventaTotal.toFixed(2);
    prod.querySelector('.ganancia').value = ganancia.toFixed(2);

    totalVenta += ventaTotal;
    totalGanancia += ganancia;
  });

  totalVentaInput.value = totalVenta.toFixed(2);
  totalGananciaInput.value = totalGanancia.toFixed(2);
}

function exportarPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  const cliente = document.getElementById("cliente").value;
  const fecha = new Date().toLocaleString();
  const productos = document.querySelectorAll('.producto');

  const filas = [];

  productos.forEach((prod, index) => {
    const nombre = prod.querySelector('.nombreProducto').value;
    const cantidad = prod.querySelector('.cantidad').value;
    const costo = prod.querySelector('.costo').value;
    const venta = prod.querySelector('.venta').value;
    const total = prod.querySelector('.ventaTotal').value;
    const ganancia = prod.querySelector('.ganancia').value;

    filas.push([
      index + 1,
      nombre,
      cantidad,
      costo,
      venta,
      total,
      ganancia
    ]);
  });

  doc.setFontSize(14);
  doc.text("Registro de Venta", 14, 15);
  doc.setFontSize(10);
  doc.text(`Cliente: ${cliente}`, 14, 23);
  doc.text(`Fecha: ${fecha}`, 14, 28);

  doc.autoTable({
    startY: 32,
    head: [["#", "Producto", "Cantidad", "Costo", "Venta", "Total", "Ganancia"]],
    body: filas,
    styles: { fontSize: 9 },
    headStyles: { fillColor: [0, 123, 255] },
  });

  const totalVenta = document.getElementById("totalVenta").value;
  const totalGanancia = document.getElementById("totalGanancia").value;

  let finalY = doc.lastAutoTable.finalY + 10;
  doc.text(`Total Venta: S/ ${totalVenta}`, 14, finalY);
  doc.text(`Total Ganancia: S/ ${totalGanancia}`, 14, finalY + 6);

  doc.save("registro_venta.pdf");
}

agregarBtn.addEventListener('click', crearProducto);
crearProducto();

document.getElementById("fecha").textContent =
  "📅 Fecha: " + new Date().toLocaleString();
