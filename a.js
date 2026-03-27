import { getStorage, ref, uploadBytes, getDownloadURL } 
from "https://www.gstatic.com/firebasejs/12.11.0/firebase-storage.js";


document.addEventListener('DOMContentLoaded', function() {

    // HEADER SCROLL
    const header = document.querySelector('header');

    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // AÑO FOOTER
    const currentYear = new Date().getFullYear();
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) {
        yearSpan.textContent = currentYear;
    }

    // CONTADOR CARRITO
    let cartItemCount = 0;
    const cartCountElement = document.querySelector('.cart-count');
    if (cartCountElement) {
        cartCountElement.textContent = cartItemCount;
    }

    // NEWSLETTER
    const newsletterForm = document.querySelector('.newsletter-form');

    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(event) {
            event.preventDefault();

            const emailInput = newsletterForm.querySelector('input[type="email"]');
            const userEmail = emailInput.value;

            if (userEmail) {
                alert(`¡Gracias por suscribirte, ${userEmail}!`);
                emailInput.value = '';
            } else {
                alert('Introduce un email válido');
            }
        });
    }

    // SMOOTH SCROLL
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            if (this.getAttribute('href').length > 1) {
                e.preventDefault();

                document.querySelector(this.getAttribute('href')).scrollIntoView({
                    behavior: 'smooth'
                });

                // 🔥 CERRAR MENÚ AL HACER CLICK (AQUÍ VA)
                document.querySelector("header nav").classList.remove("active");
            }
        });
    });

    // CARRITO (solo si usas add-to-cart)
    const addToCartButtons = document.querySelectorAll('.add-to-cart');

    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productName = this.closest('.product-item, .accessory-item').querySelector('h3').textContent;

            cartItemCount++;
            if (cartCountElement) {
                cartCountElement.textContent = cartItemCount;
            }

            alert(`"${productName}" agregado al carrito`);
        });
    });

});

// 🔥 FUNCIÓN MENÚ (FUERA, PERO CORRECTA)
function toggleMenu() {
    document.querySelector("header nav").classList.toggle("active");
}

const images = document.querySelectorAll('.gallery-grid img');
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');

images.forEach(img => {
    img.addEventListener('click', () => {
        lightbox.classList.add('active');
        lightboxImg.src = img.src;
    });
});

lightbox.addEventListener('click', () => {
    lightbox.classList.remove('active');
});

<script type="module">

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBDAOW-qrvxTcJVM4QNWPQvrmbz8wcAQLM",
  authDomain: "trujillo-digital-hub.firebaseapp.com",
  projectId: "trujillo-digital-hub"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function cargarProductos(){

let productos = document.getElementById("listaProductos");
let accesorios = document.getElementById("listaAccesorios");

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

    if(d.categoria === "productos"){
        productos.appendChild(card);
    } else {
        accesorios.appendChild(card);
    }

});

}

cargarProductos();

</script>