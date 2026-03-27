// 🔥 FIREBASE IMPORTS
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-firestore.js";

// 🔥 CONFIG
const firebaseConfig = {
  apiKey: "AIzaSyBDAOW-qrvxTcJVM4QNWPQvrmbz8wcAQLM",
  authDomain: "trujillo-digital-hub.firebaseapp.com",
  projectId: "trujillo-digital-hub"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// 🔥 TODO EL SISTEMA
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

    // AÑO
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
            } else {
                alert('Introduce un email válido');
            }
        });
    }

    // 🔥 SMOOTH SCROLL + CERRAR MENÚ
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            if (this.getAttribute('href').length > 1) {
                e.preventDefault();

                const destino = document.querySelector(this.getAttribute('href'));
                if(destino){
                    destino.scrollIntoView({ behavior: 'smooth' });
                }

                const nav = document.getElementById("navMenu");
                if(nav){
                    nav.classList.remove("active");
                }
            }
        });
    });

    // 🛒 CARRITO
    let cartItemCount = 0;
    const cartCountElement = document.querySelector('.cart-count');

    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', function() {
            const product = this.closest('.product-item, .accessory-item');

            if(product){
                const name = product.querySelector('h3').textContent;

                cartItemCount++;
                if(cartCountElement){
                    cartCountElement.textContent = cartItemCount;
                }

                alert(`"${name}" agregado al carrito`);
            }
        });
    });

    // 🖼️ LIGHTBOX
    const images = document.querySelectorAll('.gallery-grid img');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');

    if(images && lightbox && lightboxImg){
        images.forEach(img => {
            img.addEventListener('click', () => {
                lightbox.classList.add('active');
                lightboxImg.src = img.src;
            });
        });

        lightbox.addEventListener('click', () => {
            lightbox.classList.remove('active');
        });
    }

    // 🛍️ CARGAR PRODUCTOS
    cargarProductos();

});

// 🔥 MENÚ GLOBAL
function toggleMenu() {
    const nav = document.getElementById("navMenu");
    if (nav) {
        nav.classList.toggle("active");
    }
}

// 🔥 FIREBASE PRODUCTOS
async function cargarProductos(){

    let productos = document.getElementById("listaProductos");
    let accesorios = document.getElementById("listaAccesorios");

    if(!productos && !accesorios) return;

    const snap = await getDocs(collection(db,"productos"));

    snap.forEach(doc=>{
        let d = doc.data();

        let card = document.createElement("div");
        card.className="product-item";

        card.innerHTML = `
            <div class="product-image-wrapper">
                <img src="${d.imagen}">
            </div>
            <h3>${d.nombre}</h3>
            <p class="price">$${d.precio}</p>
            <a href="https://wa.link/ph7p5s" class="btn btn-whatsapp">
                <i class="fab fa-whatsapp"></i> Preguntar
            </a>
        `;

        if(d.categoria === "productos" && productos){
            productos.appendChild(card);
        } else if(accesorios){
            accesorios.appendChild(card);
        }
    });

}
// Busca esta parte al final de tu a.js y cámbiala por esto:
window.toggleMenu = function() {
    const nav = document.getElementById("navMenu");
    if (nav) {
        nav.classList.toggle("active");
        console.log("Menú activado:", nav.classList.contains("active"));
    } else {
        console.error("No se encontró el ID navMenu");
    }
};
