const productosDiv = document.getElementById('productos');
const agregarBtn = document.getElementById('agregarProducto');
const totalVentaInput = document.getElementById('totalVenta');
const totalGananciaInput = document.getElementById('totalGanancia');

let contador = 0;

function crearProducto() {
  contador++;

  productosDiv.classList.add("productos-grid"); // solo una vez al inicio

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

  // Configuración de colores mejorada
  const colors = {
    primary: [41, 98, 255],      // Azul profesional
    secondary: [52, 73, 94],     // Gris azulado
    accent: [46, 204, 113],      // Verde para ganancias
    light: [248, 249, 250],      // Gris muy claro
    dark: [33, 37, 41],          // Negro suave
    border: [206, 212, 218]      // Gris para bordes
  };

  // Encabezado principal más elegante
  doc.setFillColor(...colors.primary);
  doc.rect(0, 0, 210, 30, 'F');
  
  // Título principal
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text("REGISTRO DE VENTA", 105, 15, { align: 'center' });
  
  // Subtítulo con nombre del negocio
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text("Sistema Erika", 105, 23, { align: 'center' });

  // Línea decorativa
  doc.setDrawColor(...colors.accent);
  doc.setLineWidth(1);
  doc.line(20, 35, 190, 35);

  // Información del encabezado en dos columnas
  doc.setTextColor(...colors.dark);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Fecha: ${fecha}`, 20, 43);
  doc.text(`Cliente: ${cliente || 'No especificado'}`, 105, 43);

  // Preparar datos de la tabla
  const filas = [];
  let totalVentaCalculado = 0;
  let totalGananciaCalculado = 0;

  productos.forEach((prod, index) => {
    const cantidad = parseFloat(prod.querySelector('.cantidad').value) || 0;
    const nombre = prod.querySelector('.nombreProducto').value || 'Sin nombre';
    const venta = parseFloat(prod.querySelector('.venta').value) || 0;
    const costo = parseFloat(prod.querySelector('.costo').value) || 0;
    const total = parseFloat(prod.querySelector('.ventaTotal').value) || 0;
    const ganancia = parseFloat(prod.querySelector('.ganancia').value) || 0;

    totalVentaCalculado += total;
    totalGananciaCalculado += ganancia;

    filas.push([
      (index + 1).toString(),
      cantidad.toString(),
      nombre,
      `S/ ${venta.toFixed(2)}`,
      `S/ ${costo.toFixed(2)}`,
      `S/ ${total.toFixed(2)}`,
      `S/ ${ganancia.toFixed(2)}`
    ]);
  });

  // Tabla principal con mejor diseño
  doc.autoTable({
    startY: 52,
    head: [["N°", "Cant.", "Producto", "P. Venta", "P. Costo", "Total por producto", "Ganancia"]],
    body: filas,
    styles: { 
      fontSize: 9,
      cellPadding: 4,
      lineColor: colors.border,
      lineWidth: 0.1,
      textColor: colors.dark,
      overflow: 'linebreak',
      cellWidth: 'wrap'
    },
    headStyles: { 
      fillColor: colors.secondary,
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 10,
      halign: 'center'
    },
    alternateRowStyles: {
      fillColor: colors.light
    },
    columnStyles: {
      0: { cellWidth: 12, halign: 'center' },  // N°
      1: { cellWidth: 16, halign: 'center' },  // Cantidad
      2: { cellWidth: 65, halign: 'left' },    // Producto (más ancho)
      3: { cellWidth: 22, halign: 'right' },   // Precio Venta
      4: { cellWidth: 22, halign: 'right' },   // Precio Costo
      5: { cellWidth: 25, halign: 'right' },   // Total
      6: { cellWidth: 25, halign: 'right' }    // Ganancia
    },
    margin: { top: 52, right: 15, bottom: 40, left: 15 },
    tableWidth: 'auto',
    showHead: 'everyPage'
  });

  // Obtener totales de los campos o usar los calculados
  const totalVenta = parseFloat(document.getElementById("totalVenta")?.value) || totalVentaCalculado;
  const totalGanancia = parseFloat(document.getElementById("totalGanancia")?.value) || totalGananciaCalculado;

  let finalY = doc.lastAutoTable.finalY + 10;

  // Verificar si necesitamos una nueva página
  if (finalY > 250) {
    doc.addPage();
    finalY = 30;
  }

  // Sección de totales más profesional
  const totalBoxHeight = 25;
  const totalBoxY = finalY;

  // Fondo del recuadro de totales
  doc.setFillColor(...colors.light);
  doc.rect(15, totalBoxY, 180, totalBoxHeight, 'F');
  
  // Borde del recuadro
  doc.setDrawColor(...colors.primary);
  doc.setLineWidth(0.8);
  doc.rect(15, totalBoxY, 180, totalBoxHeight, 'S');

  // Título de la sección de totales
  doc.setFillColor(...colors.secondary);
  doc.rect(15, totalBoxY, 180, 8, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text("RESUMEN FINANCIERO", 105, totalBoxY + 5.5, { align: 'center' });

  // Totales con mejor formato
  doc.setTextColor(...colors.dark);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  
  // Total de venta
  doc.text("Total Venta:", 25, totalBoxY + 15);
  doc.setFont('helvetica', 'bold');
  doc.text(`S/ ${totalVenta.toFixed(2)}`, 170, totalBoxY + 15, { align: 'right' });
  
  // Total de ganancia con color diferente
  doc.setFont('helvetica', 'normal');
  doc.text("Total Ganancia:", 25, totalBoxY + 21);
  doc.setTextColor(...colors.accent);
  doc.setFont('helvetica', 'bold');
  doc.text(`S/ ${totalGanancia.toFixed(2)}`, 170, totalBoxY + 21, { align: 'right' });

  // Pie de página mejorado
  const pageHeight = doc.internal.pageSize.height;
  const footerY = pageHeight - 20;
  
  // Línea decorativa superior
  doc.setDrawColor(...colors.border);
  doc.setLineWidth(0.5);
  doc.line(20, footerY, 190, footerY);
  
  // Información del pie
  doc.setTextColor(...colors.secondary);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text("Sistema de Registro de Ventas", 20, footerY + 8);
  
  // Número de página
  const pageNum = doc.internal.getNumberOfPages();
  doc.text(`Página ${doc.internal.getCurrentPageInfo().pageNumber} de ${pageNum}`, 190, footerY + 8, { align: 'right' });
  
  // Fecha de generación
  doc.setFontSize(8);
  doc.text(`Generado el ${new Date().toLocaleString()}`, 105, footerY + 12, { align: 'center' });

  // Guardar el PDF con nombre mejorado
  const fechaArchivo = new Date().toISOString().split('T')[0];
  const clienteArchivo = (cliente || 'Cliente').replace(/[^a-zA-Z0-9]/g, '_');
  const nombreArchivo = `Venta_${clienteArchivo}_${fechaArchivo}.pdf`;
  
  doc.save(nombreArchivo);
}

agregarBtn.addEventListener('click', crearProducto);
crearProducto();

document.getElementById("fecha").textContent =
  "📅 Fecha: " + new Date().toLocaleString();

  
