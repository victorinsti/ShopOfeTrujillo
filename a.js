// 🔥 FIREBASE IMPORTS
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-app.js";
import { getFirestore, collection, getDocs, addDoc } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-firestore.js";

// 🔥 CONFIG
const firebaseConfig = {
  apiKey: "AIzaSyBDAOW-qrvxTcJVM4QNWPQvrmbz8wcAQLM",
  authDomain: "trujillo-digital-hub.firebaseapp.com",
  projectId: "trujillo-digital-hub"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// 🔥 TODO EL SISTEMA AL CARGAR EL DOM
document.addEventListener('DOMContentLoaded', function() {

    // HEADER SCROLL
    const header = document.querySelector('header');
    if(header){
        window.addEventListener('scroll', function() {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    // AÑO ACTUAL
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // NEWSLETTER
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const emailInput = newsletterForm.querySelector('input[type="email"]');
            if (emailInput.value) {
                alert(`¡Gracias por suscribirte, ${emailInput.value}!`);
                emailInput.value = '';
            }
        });
    }

    // 🔥 SMOOTH SCROLL + CERRAR MENÚ
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            if (this.getAttribute('href').length > 1) {
                const destino = document.querySelector(this.getAttribute('href'));
                if(destino){
                    e.preventDefault();
                    destino.scrollIntoView({ behavior: 'smooth' });
                    const nav = document.getElementById("navMenu");
                    if(nav) nav.classList.remove("active");
                }
            }
        });
    });

    // 🖼️ LIGHTBOX GALERÍA
    const images = document.querySelectorAll('.gallery-grid img');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');

    if(images && lightbox){
        images.forEach(img => {
            img.addEventListener('click', () => {
                lightbox.classList.add('active');
                lightboxImg.src = img.src;
            });
        });
        lightbox.addEventListener('click', () => lightbox.classList.remove('active'));
    }

    // 🛍️ INICIAR CARGA DE PRODUCTOS
    cargarProductos();
});

// 🔥 FUNCIÓN PARA CARGAR PRODUCTOS DESDE FIREBASE
async function cargarProductos(){
    let contenedorProductos = document.getElementById("listaProductos");
    let contenedorAccesorios = document.getElementById("listaAccesorios");

    if(!contenedorProductos && !contenedorAccesorios) return;

    try {
        const snap = await getDocs(collection(db, "productos"));
        
        // Limpiar contenedores antes de cargar (evita duplicados)
        if(contenedorProductos) contenedorProductos.innerHTML = "";
        if(contenedorAccesorios) contenedorAccesorios.innerHTML = "";

        snap.forEach(doc => {
            let d = doc.data();
            let card = document.createElement("div");
            card.className = "product-item";

            card.innerHTML = `
                <div class="product-image-wrapper">
                    <img src="${d.imagen}" alt="${d.nombre}">
                </div>
                <h3>${d.nombre}</h3>
                <p class="price">$${d.precio}</p>
                <a href="https://wa.me/5219221234567?text=Hola, me interesa el producto: ${d.nombre}" class="btn btn-whatsapp" target="_blank">
                    <i class="fab fa-whatsapp"></i> Preguntar
                </a>
            `;

            if(d.categoria === "productos" && contenedorProductos){
                contenedorProductos.appendChild(card);
            } else if(contenedorAccesorios) {
                contenedorAccesorios.appendChild(card);
            }
        });
    } catch (e) {
        console.error("Error cargando productos:", e);
    }
}

// 🔥 EXPORTAR FUNCIONES AL OBJETO WINDOW (Para que el HTML las vea)

window.toggleMenu = function() {
    const nav = document.getElementById("navMenu");
    if (nav) {
        nav.classList.toggle("active");
    } else {
        console.error("No se encontró el menú con ID navMenu");
    }
};

window.agregarProducto = async () => {
    const nombre = document.getElementById("nombreProducto").value;
    const precio = document.getElementById("precioProducto").value;
    const categoria = document.getElementById("categoriaProducto").value;
    const inputImagen = document.getElementById("imagenProducto");

    if (!nombre || !precio || !inputImagen.files[0]) {
        return alert("❌ Completa todos los campos correctamente.");
    }

    const empleado = JSON.parse(sessionStorage.getItem("empleado"));
    if (!empleado) return alert("❌ Debes iniciar sesión como empleado.");

    try {
        const reader = new FileReader();
        reader.onload = async function(e) {
            await addDoc(collection(db, "productos"), {
                nombre: nombre,
                precio: precio,
                categoria: categoria,
                imagen: e.target.result,
                creadoPor: empleado.nombre || empleado.user,
                fecha: new Date().toISOString()
            });

            alert("✅ ¡Producto subido correctamente!");
            location.reload();
        };
        reader.readAsDataURL(inputImagen.files[0]);
    } catch (error) {
        alert("❌ Error al subir a Firebase");
    }
};