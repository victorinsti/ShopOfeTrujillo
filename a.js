<<<<<<< HEAD
document.addEventListener('DOMContentLoaded', function() {
    
    // NOTA: Se eliminó toda la lógica del Preloader.
    
    // 1. Sticky Header (Encabezado Fijo)
    const header = document.querySelector('header');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // 2. Contador de Año en Footer
    const currentYear = new Date().getFullYear();
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) {
        yearSpan.textContent = currentYear;
    }

    // Inicializar el contador del carrito
    let cartItemCount = 0;
    const cartCountElement = document.querySelector('.cart-count');
    if (cartCountElement) {
        cartCountElement.textContent = cartItemCount;
    }


    // 3. Manejo del Formulario de Suscripción (Lógica simple)
    const newsletterForm = document.querySelector('.newsletter-form');

    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(event) {
            event.preventDefault(); 
            const emailInput = newsletterForm.querySelector('input[type="email"]');
            const userEmail = emailInput.value;

            if (userEmail) {
                alert(`¡Gracias por suscribirte, ${userEmail}! Recibirás nuestras novedades pronto.`);
                emailInput.value = ''; 
                
                // Mostrar un mensaje de éxito
                let successMsg = newsletterForm.nextElementSibling;
                if (!successMsg || !successMsg.classList.contains('success-message')) {
                    successMsg = document.createElement('p');
                    successMsg.className = 'success-message';
                    successMsg.style.color = 'var(--secondary-color)';
                    successMsg.style.marginTop = '15px';
                    newsletterForm.parentNode.appendChild(successMsg);
                }
                successMsg.textContent = '¡Suscripción exitosa! Revisa tu bandeja de entrada.';

                setTimeout(() => {
                    if(successMsg.parentNode) {
                        successMsg.remove();
                    }
                }, 4000);

            } else {
                alert('Por favor, introduce un email válido.');
            }
        });
    }
    
    // 4. Desplazamiento Suave (Smooth Scrolling)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            // Excluimos el logo ('#') que no tiene un destino de sección
            if (this.getAttribute('href').length > 1) {
                e.preventDefault();
                document.querySelector(this.getAttribute('href')).scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // 5. Simulación de Interacción con Productos (Añadir al Carrito)
const addToCartButtons = document.querySelectorAll('.add-to-cart');

    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productName = this.closest('.product-item, .accessory-item').querySelector('h3').textContent;
            
            // 5a. Aumentar el contador del carrito
            cartItemCount++;
            if (cartCountElement) {
                cartCountElement.textContent = cartItemCount;
            }

            // 5b. Feedback visual (alerta)
            alert(`"${productName}" ha sido añadido a tu carrito. Tienes ${cartItemCount} artículos.`);
            
            // 5c. Feedback visual (icono)
            const cartIcon = document.querySelector('.fa-shopping-cart');
            cartIcon.style.transform = 'scale(1.2)';
            cartIcon.style.color = 'var(--secondary-color)';
            
            setTimeout(() => {
                cartIcon.style.transform = 'scale(1)';
                cartIcon.style.color = '';
            }, 300);
        });
    });

});


function toggleMenu() {
    document.querySelector("header nav").classList.toggle("active");
}
// cerrar menú al hacer click
document.querySelectorAll("header nav a").forEach(link => {
    link.addEventListener("click", () => {
        document.querySelector("header nav").classList.remove("active");
    });
=======
document.addEventListener('DOMContentLoaded', function() {
    
    // NOTA: Se eliminó toda la lógica del Preloader.
    
    // 1. Sticky Header (Encabezado Fijo)
    const header = document.querySelector('header');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // 2. Contador de Año en Footer
    const currentYear = new Date().getFullYear();
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) {
        yearSpan.textContent = currentYear;
    }

    // Inicializar el contador del carrito
    let cartItemCount = 0;
    const cartCountElement = document.querySelector('.cart-count');
    if (cartCountElement) {
        cartCountElement.textContent = cartItemCount;
    }


    // 3. Manejo del Formulario de Suscripción (Lógica simple)
    const newsletterForm = document.querySelector('.newsletter-form');

    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(event) {
            event.preventDefault(); 
            const emailInput = newsletterForm.querySelector('input[type="email"]');
            const userEmail = emailInput.value;

            if (userEmail) {
                alert(`¡Gracias por suscribirte, ${userEmail}! Recibirás nuestras novedades pronto.`);
                emailInput.value = ''; 
                
                // Mostrar un mensaje de éxito
                let successMsg = newsletterForm.nextElementSibling;
                if (!successMsg || !successMsg.classList.contains('success-message')) {
                    successMsg = document.createElement('p');
                    successMsg.className = 'success-message';
                    successMsg.style.color = 'var(--secondary-color)';
                    successMsg.style.marginTop = '15px';
                    newsletterForm.parentNode.appendChild(successMsg);
                }
                successMsg.textContent = '¡Suscripción exitosa! Revisa tu bandeja de entrada.';

                setTimeout(() => {
                    if(successMsg.parentNode) {
                        successMsg.remove();
                    }
                }, 4000);

            } else {
                alert('Por favor, introduce un email válido.');
            }
        });
    }
    
    // 4. Desplazamiento Suave (Smooth Scrolling)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            // Excluimos el logo ('#') que no tiene un destino de sección
            if (this.getAttribute('href').length > 1) {
                e.preventDefault();
                document.querySelector(this.getAttribute('href')).scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // 5. Simulación de Interacción con Productos (Añadir al Carrito)
    const addToCartButtons = document.querySelectorAll('.btn-secondary');

    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productName = this.closest('.product-item, .accessory-item').querySelector('h3').textContent;
            
            // 5a. Aumentar el contador del carrito
            cartItemCount++;
            if (cartCountElement) {
                cartCountElement.textContent = cartItemCount;
            }

            // 5b. Feedback visual (alerta)
            alert(`"${productName}" ha sido añadido a tu carrito. Tienes ${cartItemCount} artículos.`);
            
            // 5c. Feedback visual (icono)
            const cartIcon = document.querySelector('.fa-shopping-cart');
            cartIcon.style.transform = 'scale(1.2)';
            cartIcon.style.color = 'var(--secondary-color)';
            
            setTimeout(() => {
                cartIcon.style.transform = 'scale(1)';
                cartIcon.style.color = '';
            }, 300);
        });
    });

});


function toggleMenu() {
    document.querySelector("header nav").classList.toggle("active");
}
// cerrar menú al hacer click
document.querySelectorAll("header nav a").forEach(link => {
    link.addEventListener("click", () => {
        document.querySelector("header nav").classList.remove("active");
    });
>>>>>>> b719542a92c5486882494d729f58b171e56122d5
});