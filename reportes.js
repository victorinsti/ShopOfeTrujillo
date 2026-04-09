let acceso = sessionStorage.getItem("acceso");
let empleado = JSON.parse(sessionStorage.getItem("empleado"));

if(acceso !== "ok" || !empleado){
    window.location.href = "acceso.html";
}

const permitidos = ["ofe", "samm", "paty"];

if(!permitidos.includes(empleado.user)){
    alert("⛔ No tienes acceso");
    window.location.href = "panel.html";
}

import { db } from "./firebase.js";
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-firestore.js";

async function cargarReportes() {

    const cont = document.getElementById("reportes");
    cont.innerHTML = "";

    const hoy = new Date().toLocaleDateString();

    let efectivo = 0;
    let transferencia = 0;
    let tarjeta = 0;
    let totalGastos = 0;

    // 🔹 VENTAS
    const snapVentas = await getDocs(collection(db, "ventas"));

    snapVentas.forEach(doc => {
        let v = doc.data();

        if(v.dia === hoy){

            if(v.metodo === "Efectivo") efectivo += v.total;
            else if(v.metodo === "Transferencia") transferencia += v.total;
            else if(v.metodo === "Tarjeta") tarjeta += v.total;

            let div = document.createElement("div");
            div.className = "venta";

            div.innerHTML = `
                <span>${v.cliente || "General"}</span>
                <span>$${v.total}</span>
                <span>${v.metodo}</span>
            `;

            cont.appendChild(div);
        }
    });

    // 🔹 GASTOS
    const snapGastos = await getDocs(collection(db, "gastos"));

    snapGastos.forEach(doc => {
        let g = doc.data();

        if(g.dia === hoy){

            totalGastos += g.monto;

            let div = document.createElement("div");
            div.className = "venta";

            div.innerHTML = `
                <span>💸 ${g.descripcion}</span>
                <span>-$${g.monto}</span>
                <span>Gasto</span>
            `;

            cont.appendChild(div);
        }
    });

    // 🔥 TOTAL SOLO EFECTIVO
    let totalReal = efectivo - totalGastos;

    document.getElementById("totalDia").textContent = totalReal.toFixed(2);

    // 🔥 RESUMEN
    cont.innerHTML += `
        <hr>
        <h3>💰 Caja: $${totalReal.toFixed(2)}</h3>
        <h3>💵 Efectivo: $${efectivo.toFixed(2)}</h3>
        <h3>💸 Transferencias: $${transferencia.toFixed(2)}</h3>
        <h3>💳 Tarjeta: $${tarjeta.toFixed(2)}</h3>
        <h3>💸 Gastos: -$${totalGastos.toFixed(2)}</h3>
    `;
}

cargarReportes();

window.descargarPDF = async function() {

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    const hoy = new Date().toLocaleDateString();

    let y = 20;

    let efectivo = 0;
    let transferencia = 0;
    let tarjeta = 0;
    let totalGastos = 0;

    const rosa = [255, 77, 166];

    // 🎨 HEADER
    doc.setFillColor(...rosa);
    doc.rect(0, 0, 210, 30, "F");

    doc.setTextColor(255,255,255);
    doc.setFontSize(18);
    doc.text("SHOP OFE TRUJILLO", 105, 15, { align: "center" });

    doc.setFontSize(10);
    doc.text("Reporte Completo del Día", 105, 22, { align: "center" });

    y = 40;

    doc.setTextColor(0,0,0);
    doc.setFontSize(11);
    doc.text(`Fecha: ${hoy}`, 20, y);

    y += 10;

    // 🔹 TÍTULO VENTAS
    doc.setTextColor(...rosa);
    doc.setFontSize(13);
    doc.text("VENTAS", 20, y);

    y += 8;

    doc.setTextColor(0,0,0);
    doc.setFontSize(10);

    // 🔹 VENTAS
    const snapVentas = await getDocs(collection(db, "ventas"));

    snapVentas.forEach(d => {
        let v = d.data();

        if(v.dia === hoy){

            // SUMAR MÉTODOS
            if(v.metodo === "Efectivo") efectivo += v.total;
            if(v.metodo === "Transferencia") transferencia += v.total;
            if(v.metodo === "Tarjeta") tarjeta += v.total;

            doc.text(`${v.cliente || "General"} - ${v.metodo}`, 20, y);
            doc.text(`$${v.total.toFixed(2)}`, 160, y);

            y += 6;

            if (y > 270) {
                doc.addPage();
                y = 20;
            }
        }
    });

    y += 10;

    // 🔹 GASTOS
    doc.setTextColor(...rosa);
    doc.setFontSize(13);
    doc.text(" GASTOS", 20, y);

    y += 8;

    doc.setTextColor(0,0,0);
    doc.setFontSize(10);

    const snapGastos = await getDocs(collection(db, "gastos"));

    snapGastos.forEach(d => {
        let g = d.data();

        if(g.dia === hoy){

            totalGastos += g.monto;

            doc.text(`${g.descripcion}`, 20, y);
            doc.text(`-$${g.monto.toFixed(2)}`, 160, y);

            y += 6;

            if (y > 270) {
                doc.addPage();
                y = 20;
            }
        }
    });

    y += 10;

    // 🔥 TOTAL REAL
    let totalReal = efectivo - totalGastos;

    // 🔹 RESUMEN
    doc.setDrawColor(...rosa);
    doc.rect(15, y, 180, 50);

    y += 10;

    doc.setTextColor(...rosa);
    doc.setFontSize(13);
    doc.text("RESUMEN", 105, y, { align: "center" });

    y += 10;

    doc.setTextColor(0,0,0);
    doc.setFontSize(11);

    doc.text(`Efectivo: $${efectivo.toFixed(2)}`, 20, y);
    y += 7;

    doc.text(`Transferencias: $${transferencia.toFixed(2)}`, 20, y);
    y += 7;

    doc.text(`Tarjeta: $${tarjeta.toFixed(2)}`, 20, y);
    y += 7;

    doc.text(`Gastos: -$${totalGastos.toFixed(2)}`, 20, y);

    y += 10;

    // 💰 TOTAL GRANDE
    doc.setFillColor(255, 240, 245);
    doc.rect(15, y, 180, 25, "F");

    y += 15;

    doc.setTextColor(...rosa);
    doc.setFontSize(16);
    doc.text(`TOTAL EN CAJA: $${totalReal.toFixed(2)}`, 105, y, { align: "center" });

    // 📌 PIE
    doc.setFontSize(8);
    doc.setTextColor(100);
    doc.text("Reporte generado automáticamente 💖", 105, 285, { align: "center" });

    doc.save("reporte_completo.pdf");
};