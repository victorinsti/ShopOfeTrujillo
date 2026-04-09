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

    const cont = document.getElementById("resultado");
    cont.innerHTML = "⏳ Generando corte...";

    let efectivo = 0;
    let transferencia = 0;
    let tarjeta = 0;
    let totalGastos = 0;

    const hoy = new Date().toLocaleDateString();

    try {

        // 🔹 VENTAS
        const snapVentas = await getDocs(collection(db, "ventas"));

        snapVentas.forEach(doc => {
            let v = doc.data();

            if(v.dia === hoy){

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

        // 🔥 TU LÓGICA REAL
        let totalReal = efectivo - totalGastos;

        // 🎨 UI PRO
        cont.innerHTML = `
            <div style="text-align:center">

                <h2 style="color:#ff4da6;">💰 CORTE DE CAJA</h2>

                <div style="
                    background:#fff0f5;
                    padding:20px;
                    border-radius:15px;
                    margin:15px 0;
                    box-shadow:0 5px 15px rgba(0,0,0,0.1);
                ">
                    <h1 style="color:#ff4da6;">
                        $${totalReal.toFixed(2)}
                    </h1>
                    <p>Total en caja (efectivo)</p>
                </div>

                <div style="text-align:left">

                    <h3>📊 Resumen</h3>

                    <p>💵 Efectivo: <b>$${efectivo.toFixed(2)}</b></p>
                    <p>💸 Transferencias: <b>$${transferencia.toFixed(2)}</b></p>
                    <p>💳 Tarjeta: <b>$${tarjeta.toFixed(2)}</b></p>

                    <hr>

                    <p style="color:red;">
                        💸 Gastos: -$${totalGastos.toFixed(2)}
                    </p>

                </div>

            </div>
        `;

    } catch (error) {

        console.error(error);

        cont.innerHTML = `
            <p style="color:red;">
                ❌ Error al generar corte
            </p>
        `;
    }
};