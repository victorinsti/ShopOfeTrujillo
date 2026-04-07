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

window.corte = async function() {

    let totalVentas = 0;
    let totalGastos = 0;

    let efectivo = 0;
    let transferencia = 0;
    let tarjeta = 0;

    const hoy = new Date().toLocaleDateString();

    // 🔹 VENTAS
    const snapVentas = await getDocs(collection(db, "ventas"));

    snapVentas.forEach(doc => {
        let v = doc.data();

        if(v.dia === hoy){
            totalVentas += v.total;

            if(v.metodo === "Efectivo") efectivo += v.total;
            else if(v.metodo === "Transferencia") transferencia += v.total;
            else if(v.metodo === "Tarjeta") tarjeta += v.total;
        }
    });

    // 🔹 GASTOS
    const snapGastos = await getDocs(collection(db, "gastos"));

    snapGastos.forEach(doc => {
        let g = doc.data();

        if(g.dia === hoy){
            totalGastos += g.monto;
        }
    });

    let ganancia = totalVentas - totalGastos;

    document.getElementById("resultado").innerHTML = `
        <h3>Ventas: $${totalVentas.toFixed(2)}</h3>
        <h3>Gastos: $${totalGastos.toFixed(2)}</h3>
        <h2>Ganancia: $${ganancia.toFixed(2)}</h2>

        <hr>

        <p>💵 Efectivo: $${efectivo.toFixed(2)}</p>
        <p>🏦 Transferencia: $${transferencia.toFixed(2)}</p>
        <p>💳 Tarjeta: $${tarjeta.toFixed(2)}</p>
    `;
}