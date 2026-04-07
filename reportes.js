let acceso = sessionStorage.getItem("acceso");
let empleado = JSON.parse(sessionStorage.getItem("empleado"));

if(acceso !== "ok" || !empleado){
    window.location.href = "acceso.html";
}

// 🔥 SOLO ESTOS USUARIOS
const permitidos = ["ofe", "samm", "paty"];

if(!permitidos.includes(empleado.user)){
    alert("⛔ No tienes acceso a esta sección");
    window.location.href = "panel.html";
}


import { db } from "./firebase.js";
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-firestore.js";

async function cargarReportes() {

    const cont = document.getElementById("reportes");
    cont.innerHTML = "";

    let totalDia = 0;

    const hoy = new Date().toLocaleDateString();

    const snap = await getDocs(collection(db, "ventas"));

    snap.forEach(doc => {
        let v = doc.data();

        if(v.dia === hoy){
            totalDia += v.total;

            let div = document.createElement("div");
            div.className = "venta";

div.className = "venta";

div.innerHTML = `
    <span>${v.cliente || "General"}</span>
    <span>$${v.total}</span>
    <span>${v.metodo}</span>
`;
            cont.appendChild(div);
        }
    });

    // 🔥 GASTOS
const snapGastos = await getDocs(collection(db, "gastos"));

snapGastos.forEach(doc => {
    let g = doc.data();

    if(g.dia === hoy){

        let div = document.createElement("div");
        div.className = "venta";

        div.innerHTML = `
            <span>💸 ${g.descripcion}</span>
            <span>-$${g.monto}</span>
            <span>Gasto</span>
        `;

        cont.appendChild(div);

        totalDia -= g.monto; // 🔥 RESTAR AL TOTAL
    }
});

    document.getElementById("totalDia").textContent = totalDia.toFixed(2);
}

cargarReportes();

window.descargarPDF = async function() {

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    const hoy = new Date().toLocaleDateString();

    let y = 20;
    let total = 0;
    let totalGastos = 0;

    let efectivo = 0;
    let transferencia = 0;
    let tarjeta = 0;

    // 🏪 ENCABEZADO
    doc.setFontSize(18);
    doc.text("SHOP OFE TRUJILLO", 105, y, { align: "center" });

    y += 8;

    doc.setFontSize(12);
    doc.text("Reporte de Ventas del Día", 105, y, { align: "center" });

    y += 8;

    doc.setFontSize(10);
    doc.text(`Fecha: ${hoy}`, 105, y, { align: "center" });

    y += 15;

    // 🔹 ENCABEZADO TABLA
    doc.setFontSize(11);
    doc.text("Concepto", 20, y);
    doc.text("Método", 90, y);
    doc.text("Monto", 160, y);

    y += 5;
    doc.line(20, y, 190, y);
    y += 5;

    // 🔹 VENTAS
    const snapVentas = await getDocs(collection(db, "ventas"));

    snapVentas.forEach(d => {
        let v = d.data();

        if(v.dia === hoy){

            total += v.total;

            if(v.metodo === "Efectivo") efectivo += v.total;
            if(v.metodo === "Transferencia") transferencia += v.total;
            if(v.metodo === "Tarjeta") tarjeta += v.total;

            doc.setFontSize(10);

            doc.text(v.cliente || "Venta", 20, y);
            doc.text(v.metodo, 90, y);
            doc.text(`$${v.total.toFixed(2)}`, 160, y);

            y += 7;

            if (y > 270) {
                doc.addPage();
                y = 20;
            }
        }
    });

    // 🔥 GASTOS
    const snapGastos = await getDocs(collection(db, "gastos"));

    snapGastos.forEach(d => {
        let g = d.data();

        if(g.dia === hoy){

            totalGastos += g.monto;

            doc.setFontSize(10);

            doc.text(`Gasto: ${g.descripcion}`, 20, y);
            doc.text("-", 90, y);
            doc.text(`-$${g.monto.toFixed(2)}`, 160, y);

            y += 7;

            if (y > 270) {
                doc.addPage();
                y = 20;
            }
        }
    });

    y += 10;
    doc.line(20, y, 190, y);
    y += 10;

    let ganancia = total - totalGastos;

    // 💰 TOTALES
    doc.setFontSize(12);
    doc.text(`Ventas: $${total.toFixed(2)}`, 20, y);

    y += 7;
    doc.text(`Gastos: $${totalGastos.toFixed(2)}`, 20, y);

    y += 7;
    doc.text(`Total: $${ganancia.toFixed(2)}`, 20, y);

    y += 10;

    // 💳 MÉTODOS
    doc.setFontSize(10);
    doc.text(`Efectivo: $${efectivo.toFixed(2)}`, 20, y);
    doc.text(`Transferencia: $${transferencia.toFixed(2)}`, 20, y + 7);
    doc.text(`Tarjeta: $${tarjeta.toFixed(2)}`, 20, y + 14);

    // 📌 PIE
    doc.setFontSize(8);
    doc.text("Reporte generado automáticamente", 105, 285, { align: "center" });

    doc.save("reporte_completo.pdf");
}