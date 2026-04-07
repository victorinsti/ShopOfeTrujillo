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


if(acceso !== "ok"){
    window.location.href = "acceso.html";
}

import { db } from "./firebase.js";
import { collection, addDoc, getDocs } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-firestore.js";

let carrito = [];
let total = 0;

// 🔥 CARGAR PRODUCTOS DESDE FIREBASE
async function cargarProductos() {
    const cont = document.getElementById("productos");
    cont.innerHTML = "";

    const snap = await getDocs(collection(db, "productos"));

    snap.forEach(doc => {
        let p = doc.data();

        let div = document.createElement("div");
        div.className = "producto";
        div.innerHTML = `
            <h3>${p.nombre}</h3>
            <p>$${p.precio}</p>
        `;

        div.onclick = () => agregar(p);

        cont.appendChild(div);
    });
}

// 🛒 AGREGAR (🔥 FIX IMPORTANTE)
function agregar(p) {

    let precio = Number(p.precio); // 🔥 convertir a número

    carrito.push({
        ...p,
        precio: precio
    });

    total += precio;

    render();
}

// 🔄 ACTUALIZAR UI
function render() {
    const lista = document.getElementById("listaCarrito");
    const totalSpan = document.getElementById("total");

    lista.innerHTML = "";

    carrito.forEach(p => {
        let li = document.createElement("li");
        li.textContent = `${p.nombre} - $${p.precio}`;
        lista.appendChild(li);
    });

    totalSpan.textContent = total.toFixed(2); // 🔥 FIX
}

// 💳 COBRAR
window.cobrar = async function() {

    const metodo = document.getElementById("metodoPago").value;
    const cliente = document.getElementById("cliente").value || "General";
    const extra = Number(document.getElementById("extra").value) || 0;

    // 🔥 permitir venta solo con dinero extra
    if (carrito.length === 0 && extra <= 0) {
        alert("Agrega productos o dinero");
        return;
    }

    let totalFinal = total + extra;

    let venta = {
        productos: carrito,
        total: totalFinal,
        subtotal: total,
        extra: extra,
        cliente: cliente,
        metodo: metodo,
        fecha: new Date(),
        dia: new Date().toLocaleDateString()
    };

    await addDoc(collection(db, "ventas"), venta);

    alert("Venta guardada 💖");

    carrito = [];
    total = 0;

    document.getElementById("cliente").value = "";
    document.getElementById("extra").value = "";

    render();
}


// 💵 CALCULAR CAMBIO
window.calcularCambio = function() {
    let pago = parseFloat(document.getElementById("pago").value);

    if (isNaN(pago)) {
        alert("Ingresa el pago");
        return;
    }

    let cambio = pago - total;

    document.getElementById("cambio").textContent = cambio.toFixed(2);
}


// 💾 GUARDAR VENTA (OPCIONAL)
window.guardarVenta = async function() {

    const metodo = document.getElementById("metodoPago").value;
    const cliente = document.getElementById("cliente").value || "General";
    const extra = Number(document.getElementById("extra").value) || 0;

    if (carrito.length === 0 && extra <= 0) {
        alert("Agrega productos o dinero");
        return;
    }

    let totalFinal = total + extra;

    await addDoc(collection(db, "ventas"), {
        productos: carrito,
        total: totalFinal,
        subtotal: total,
        extra: extra,
        cliente: cliente,
        metodo: metodo,
        fecha: new Date(),
        dia: new Date().toLocaleDateString()
    });

    alert("Venta guardada manualmente ✅");
}

// 🔙 REGRESAR AL PANEL
window.irPanel = function() {
    window.location.href = "panel.html";
}


// 🚀 INICIAR
cargarProductos();

window.registrarGasto = async function() {

    let descripcion = document.getElementById("descGasto").value;
    let monto = Number(document.getElementById("montoGasto").value);

    if (!descripcion || monto <= 0) {
        alert("Completa los datos del gasto");
        return;
    }

    await addDoc(collection(db, "gastos"), {
        descripcion: descripcion,
        monto: monto,
        fecha: new Date(),
        dia: new Date().toLocaleDateString()
    });

    alert("Gasto registrado 💸");

    document.getElementById("descGasto").value = "";
    document.getElementById("montoGasto").value = "";
}