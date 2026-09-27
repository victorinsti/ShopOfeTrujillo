
import { db } from "./firebase.js";

import {
collection,
addDoc,
getDocs,
deleteDoc,
updateDoc,
doc,
serverTimestamp
}
from "https://www.gstatic.com/firebasejs/12.11.0/firebase-firestore.js";

const productosRef = collection(db,"productos");

let productos=[];

let productoEditando=null;

//============================
// INICIAR
//============================

window.addEventListener("DOMContentLoaded",()=>{

cargarProductos();

document.getElementById("btnNuevo").onclick=abrirModal;

document.getElementById("cancelar").onclick=cerrarModal;

document.getElementById("guardar").onclick=guardarProducto;

document.getElementById("buscar").addEventListener("input",buscarProductos);

});
async function cargarProductos(){

productos=[];

const snap=await getDocs(productosRef);

snap.forEach(documento=>{

productos.push({

id:documento.id,

...documento.data()

});

});

renderProductos();

actualizarEstadisticas();

}
function renderProductos(lista = productos){

const contenedor=document.getElementById("contenedorProductos");

contenedor.innerHTML="";

lista.forEach(producto=>{

const stockClase=
producto.stock<=producto.stockMinimo
?
"bajo"
:
"ok";

contenedor.innerHTML+=`

<div class="producto">

<img src="${
producto.imagen ||
'https://via.placeholder.com/300x250?text=Producto'
}">

<div class="info">

<h3>${producto.nombre}</h3>

<p class="codigo">

${producto.codigo}

</p>

<p class="precio">

$${producto.precioVenta}

</p>

<p class="stock ${stockClase}">

Existencias:
${producto.stock}

</p>

<div class="botones">

<button
class="editar"
onclick="editarProducto('${producto.id}')">

Editar

</button>

<button
class="entrada"
onclick="entradaProducto('${producto.id}')">

Entrada

</button>

<button
class="eliminar"
onclick="eliminarProducto('${producto.id}')">

Eliminar

</button>

</div>

</div>

</div>

`;

});

}
function actualizarEstadisticas(){

document.getElementById("totalProductos").innerText=
productos.length;

let existencias=0;

let valor=0;

let bajos=0;

productos.forEach(p=>{

existencias+=Number(p.stock);

valor+=Number(p.stock)*Number(p.precioCompra);

if(Number(p.stock)<=Number(p.stockMinimo))
bajos++;

});

document.getElementById("stockTotal").innerText=
existencias;

document.getElementById("valorInventario").innerText=
"$"+valor.toLocaleString();

document.getElementById("stockBajo").innerText=
bajos;

}
function abrirModal(){

productoEditando=null;

document.getElementById("modal").style.display="flex";

limpiarFormulario();

}
function cerrarModal(){

document.getElementById("modal").style.display="none";

}
function limpiarFormulario(){

document.getElementById("codigo").value="";
document.getElementById("nombre").value="";
document.getElementById("categoria").value="";
document.getElementById("proveedor").value="";
document.getElementById("precioCompra").value="";
document.getElementById("precioVenta").value="";
document.getElementById("stock").value="";
document.getElementById("stockMinimo").value="5";
document.getElementById("descripcion").value="";
document.getElementById("imagen").value="";

}
async function guardarProducto(){

const producto={

codigo:document.getElementById("codigo").value,

nombre:document.getElementById("nombre").value,

categoria:document.getElementById("categoria").value,

proveedor:document.getElementById("proveedor").value,

precioCompra:Number(document.getElementById("precioCompra").value),

precioVenta:Number(document.getElementById("precioVenta").value),

stock:Number(document.getElementById("stock").value),

stockMinimo:Number(document.getElementById("stockMinimo").value),

descripcion:document.getElementById("descripcion").value,

imagen:document.getElementById("imagen").value,

activo:true,

fecha:serverTimestamp()

};

if(productoEditando){

await updateDoc(

doc(db,"productos",productoEditando),

producto

);

}else{

await addDoc(

productosRef,

producto

);

}

cerrarModal();

cargarProductos();

}
function buscarProductos() {

    const texto = document
        .getElementById("buscar")
        .value
        .toLowerCase();

    const filtrados = productos.filter(p => {

        return (
            (p.nombre || "").toLowerCase().includes(texto) ||
            (p.codigo || "").toLowerCase().includes(texto) ||
            (p.categoria || "").toLowerCase().includes(texto)
        );

    });

    renderProductos(filtrados);

}
window.editarProducto = function(id){

    productoEditando = id;

    const producto = productos.find(p => p.id === id);

    if(!producto) return;

    codigo.value = producto.codigo || "";
    nombre.value = producto.nombre || "";
    categoria.value = producto.categoria || "";
    proveedor.value = producto.proveedor || "";
    precioCompra.value = producto.precioCompra || 0;
    precioVenta.value = producto.precioVenta || 0;
    stock.value = producto.stock || 0;
    stockMinimo.value = producto.stockMinimo || 5;
    descripcion.value = producto.descripcion || "";
    imagen.value = producto.imagen || "";

    modal.style.display = "flex";

}
window.eliminarProducto = async function(id){

    if(!confirm("¿Eliminar este producto?"))
        return;

    await deleteDoc(doc(db,"productos",id));

    cargarProductos();

}
window.entradaProducto = async function(id){

    const cantidad = prompt("Cantidad que ingresará:");

    if(cantidad === null)
        return;

    const numero = Number(cantidad);

    if(numero <= 0)
        return;

    const producto = productos.find(p => p.id === id);

    await updateDoc(

        doc(db,"productos",id),

        {

            stock: Number(producto.stock) + numero,

            fecha: serverTimestamp()

        }

    );

    await addDoc(

        collection(db,"movimientosInventario"),

        {

            productoId:id,

            nombre:producto.nombre,

            tipo:"entrada",

            cantidad:numero,

            fecha:serverTimestamp()

        }

    );

    cargarProductos();

}
window.onclick = function(e){

    if(e.target == modal){

        cerrarModal();

    }

}
codigo.value =
"SOT-" +
Date.now().toString().slice(-6);
