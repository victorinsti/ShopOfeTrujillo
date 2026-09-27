// chatbot.js
// SHOP OFE TRUJILLO — ASISTENTE VIRTUAL
// Versión compacta: sin <br>, sin saltos excesivos y sin espacios innecesarios.

document.addEventListener("DOMContentLoaded", function () {

    if (document.getElementById("shopOfeChatbot")) return;

    const SHOP_OFE = {
        nombre: "Shop Ofe Trujillo",
        ubicacion: "Minatitlán, Veracruz, México",
        direccion: "Calle Jose Arenas 9, frente a la Picadita Jarocha del centro, Minatitlán, Veracruz.",
        envio: {
            costo: "$260 MXN",
            tiempo: "3 a 5 días hábiles",
            cobertura: "República Mexicana",
            fueraDeMexico: "No realizamos envíos fuera de México."
        },
        horarios: {
            lunes: "10:00 AM a 3:00 PM",
            martesViernes: "10:00 AM a 7:00 PM",
            sabado: "10:00 AM a 6:00 PM",
            domingo: "Cerrado"
        },
        categorias: [
            "Cosméticos",
            "Accesorios",
            "Novedades",
            "Vestidos",
            "Blusas",
            "Lencería",
            "Bolsas",
            "Carteras",
            "Joyería"
        ],
        puntosEntrega: [
            "Coatzacoalcos",
            "Cosoleacaque",
            "Naranjito",
            "Acayucan",
            "Nanchital",
            "Ixhuatlan",
            "Mundo Nuevo",
            "Jaltipan",
            "Puebla"
        ],
        redes: {
            facebook: "https://www.facebook.com/Ofetrujillo32",
            instagram: "https://www.instagram.com/shop_ofetrujillo",
            whatsapp: "https://wa.link/ph7p5s"
        },
        paginas: {
            productos: "productos.html",
            galeria: "galeria.html",
            politicas: "politicas.html",
            login: "login.html",
            registro: "registro.html"
        },
        comunidad: "Más de 30,000 seguidoras.",
        descripcion: "Shop Ofe Trujillo es una tienda de cosméticos, accesorios y novedades."
    };

    const WHATSAPP = SHOP_OFE.redes.whatsapp;

    const chatbot = document.createElement("div");

    chatbot.id = "shopOfeChatbot";

    chatbot.innerHTML = `
        <div class="so-chat-window" id="soChatWindow">
            <div class="so-chat-header">
                <div class="so-chat-brand">
                    <div class="so-chat-avatar">💖</div>
                    <div>
                        <div class="so-chat-title">Asistente Shop Ofe</div>
                        <div class="so-chat-status"><span></span> En línea</div>
                    </div>
                </div>
                <button class="so-chat-close" id="soChatClose" type="button">×</button>
            </div>

            <div class="so-chat-messages" id="soChatMessages">
                <div class="so-message bot">
                    <div class="so-bubble">
                        ¡Hola! 💖 Soy el asistente virtual de <strong>Shop Ofe Trujillo</strong>. 🛍️<br>
                        Puedo ayudarte con productos, precios, envíos, horarios, ubicación, puntos de entrega, compras, promociones y WhatsApp. ✨
                    </div>
                </div>

                <div class="so-quick-options">
                    <button class="so-quick-option" data-question="¿Qué productos tienen?">🛍️ Productos</button>
                    <button class="so-quick-option" data-question="¿Cuánto cuesta el envío?">🚚 Envíos</button>
                    <button class="so-quick-option" data-question="¿Cuál es su horario?">🕐 Horarios</button>
                    <button class="so-quick-option" data-question="¿Dónde están ubicados?">📍 Ubicación</button>
                    <button class="so-quick-option" data-question="¿Cómo puedo comprar?">🛍️ Cómo comprar</button>
                    <button class="so-quick-option" data-question="¿Cuáles son sus puntos de entrega?">📦 Puntos de entrega</button>
                    <button class="so-quick-option" data-question="¿Qué promociones tienen?">🔥 Promociones</button>
                    <button class="so-quick-option" data-question="Quiero hablar con una persona">📱 Hablar con Shop Ofe</button>
                </div>

                <div class="so-typing" id="soTyping">
                    <span></span><span></span><span></span>
                </div>
            </div>

            <div class="so-chat-input-area">
                <div class="so-chat-input-row">
                    <input type="text" id="soChatInput" class="so-chat-input" placeholder="Escribe tu pregunta..." autocomplete="off">
                    <button id="soChatSend" class="so-chat-send" type="button">➤</button>
                </div>
                <button id="soChatWhatsapp" class="so-chat-whatsapp" type="button">💬 Hablar por WhatsApp</button>
            </div>
        </div>

        <button id="soChatButton" class="so-chat-button" type="button" aria-label="Abrir asistente">
            💬
            <span class="so-chat-notification"></span>
        </button>
    `;

    document.body.appendChild(chatbot);

    const chatButton = document.getElementById("soChatButton");
    const chatWindow = document.getElementById("soChatWindow");
    const chatClose = document.getElementById("soChatClose");
    const chatMessages = document.getElementById("soChatMessages");
    const chatInput = document.getElementById("soChatInput");
    const chatSend = document.getElementById("soChatSend");
    const typing = document.getElementById("soTyping");
    const whatsapp = document.getElementById("soChatWhatsapp");

    function scrollChat() {
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function normalizar(texto) {
        return texto.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
    }

    function contiene(texto, palabras) {
        return palabras.some(palabra => texto.includes(normalizar(palabra)));
    }

    function escapeHTML(texto) {
        const div = document.createElement("div");
        div.textContent = texto;
        return div.innerHTML;
    }

    function link(url, texto) {
        return `<a href="${url}" target="_blank" rel="noopener noreferrer" style="color:#ff2f92;font-weight:800;text-decoration:none;">${texto}</a>`;
    }

    function agregarMensaje(texto, tipo) {
        const message = document.createElement("div");
        message.className = "so-message " + tipo;

        const bubble = document.createElement("div");
        bubble.className = "so-bubble";
        bubble.innerHTML = texto;

        message.appendChild(bubble);
        chatMessages.insertBefore(message, typing);
        scrollChat();
    }

    function abrirWhatsApp() {
        window.open(WHATSAPP, "_blank", "noopener,noreferrer");
    }

    function responder(texto) {

        const pregunta = normalizar(texto);
        let respuesta = "";

        if (contiene(pregunta, ["hola", "buenas", "buenos dias", "buenas tardes", "buenas noches", "hey", "holi"])) {
            respuesta = `¡Hola! 💖 Soy el asistente virtual de <strong>Shop Ofe Trujillo</strong>. 🛍️ ¿En qué puedo ayudarte?`;
        }

        else if (contiene(pregunta, ["quienes son", "quien es shop ofe", "que es shop ofe", "sobre shop ofe", "informacion de la tienda"])) {
            respuesta = `💖 <strong>${SHOP_OFE.nombre}</strong><br>${SHOP_OFE.descripcion}<br>📍 Estamos en <strong>${SHOP_OFE.ubicacion}</strong><br>👑 Contamos con ${SHOP_OFE.comunidad}<br>📱 Tenemos presencia en redes sociales y realizamos lives.`;
        }

        else if (contiene(pregunta, ["producto", "productos", "catalogo", "catalog", "que venden", "que tienen", "que puedo comprar"])) {
            respuesta = `🛍️ <strong>Tenemos:</strong><br>${SHOP_OFE.categorias.map(x => "• " + x).join("<br>")}<br>${link(SHOP_OFE.paginas.productos, "🛍️ Ver productos")}`;
        }

        else if (contiene(pregunta, ["categoria", "categorias", "tipos de productos"])) {
            respuesta = `🛍️ <strong>Categorías:</strong><br>${SHOP_OFE.categorias.map(x => "💖 " + x).join("<br>")}<br>${link(SHOP_OFE.paginas.productos, "🛍️ Ver catálogo")}`;
        }

        else if (contiene(pregunta, ["precio", "precios", "cuanto cuesta", "cuesta", "cuanto valen", "valor"])) {
            respuesta = `💰 Los precios dependen de cada producto. Puedes consultar los precios disponibles en nuestro catálogo.<br>${link(SHOP_OFE.paginas.productos, "🛍️ Consultar productos")}<br>💬 Si buscas un producto específico, también puedes enviarnos el nombre o una foto por WhatsApp.`;
        }

        else if (contiene(pregunta, ["estados unidos", "usa", "united states", "canada", "europa", "francia", "paris", "espana", "argentina", "colombia", "chile", "peru", "guatemala", "extranjero", "otro pais", "fuera de mexico"])) {
            respuesta = `❌ <strong>No realizamos envíos fuera de México.</strong><br>🇲🇽 Nuestros envíos son únicamente dentro de la República Mexicana.<br>${link(WHATSAPP, "💬 Consultar por WhatsApp")}`;
        }

        else if (contiene(pregunta, ["envio", "envios", "mandan", "envian", "entrega a domicilio", "envio a domicilio", "republica mexicana"])) {
            respuesta = `🚚 <strong>Envíos Shop Ofe</strong><br>🇲🇽 Enviamos únicamente dentro de México.<br>💰 Costo: <strong>${SHOP_OFE.envio.costo}</strong><br>⏱️ Tiempo: <strong>${SHOP_OFE.envio.tiempo}</strong><br>❌ No realizamos envíos fuera de México.`;
        }

        else if (contiene(pregunta, ["punto de entrega", "puntos de entrega", "donde entregan", "entrega personal", "entrega local"])) {
            respuesta = `📦 <strong>Puntos de entrega:</strong><br>${SHOP_OFE.puntosEntrega.map(x => "📍 " + x).join("<br>")}<br>💖 Para confirmar disponibilidad, escríbenos por WhatsApp.`;
        }

        else if (contiene(pregunta, ["ubicacion", "direccion", "donde estan", "donde estan ubicados", "donde se encuentran", "tienda fisica", "local", "minatitlan"])) {
            respuesta = `📍 <strong>Shop Ofe Trujillo</strong><br>${SHOP_OFE.direccion}<br>${SHOP_OFE.ubicacion}`;
        }

        else if (contiene(pregunta, ["horario", "horarios", "hora", "horas", "abren", "abierto", "cierran", "cerrado"])) {
            respuesta = `🕐 <strong>Horario de atención</strong><br>Lunes: ${SHOP_OFE.horarios.lunes}<br>Martes a viernes: ${SHOP_OFE.horarios.martesViernes}<br>Sábado: ${SHOP_OFE.horarios.sabado}<br>Domingo: ${SHOP_OFE.horarios.domingo}`;
        }

        else if (contiene(pregunta, ["como comprar", "como compro", "quiero comprar", "hacer compra", "hacer pedido", "realizar pedido", "pedido", "comprar"])) {
            respuesta = `🛍️ <strong>¿Cómo comprar?</strong><br>1️⃣ Consulta el catálogo.<br>2️⃣ Elige los productos.<br>3️⃣ Confirma disponibilidad.<br>4️⃣ Realiza tu pedido con Shop Ofe.<br>${link(SHOP_OFE.paginas.productos, "🛍️ Ver productos")}<br>${link(WHATSAPP, "💬 Comprar por WhatsApp")}`;
        }

        else if (contiene(pregunta, ["whatsapp", "contactar", "contacto", "asesor", "asesora", "persona", "humano", "hablar con alguien"])) {
            respuesta = `💖 Puedes comunicarte directamente con Shop Ofe Trujillo por WhatsApp.<br>${link(WHATSAPP, "💬 Abrir WhatsApp")}`;
        }

        else if (contiene(pregunta, ["facebook", "face"])) {
            respuesta = `📘 ${link(SHOP_OFE.redes.facebook, "Facebook de Shop Ofe Trujillo")}`;
        }

        else if (contiene(pregunta, ["instagram", "insta"])) {
            respuesta = `📸 ${link(SHOP_OFE.redes.instagram, "Instagram de Shop Ofe Trujillo")}`;
        }

        else if (contiene(pregunta, ["redes sociales", "redes", "donde los sigo", "donde seguirlos"])) {
            respuesta = `📱 <strong>Redes sociales</strong><br>📘 ${link(SHOP_OFE.redes.facebook, "Facebook")}<br>📸 ${link(SHOP_OFE.redes.instagram, "Instagram")}<br>🎵 También tenemos presencia en TikTok.`;
        }

        else if (contiene(pregunta, ["promocion", "promociones", "oferta", "ofertas", "descuento", "descuentos", "rebaja", "rebajas"])) {
            respuesta = `🔥 <strong>Promociones Shop Ofe</strong><br>Tenemos promociones y novedades que pueden cambiar constantemente.<br>${link(SHOP_OFE.paginas.galeria, "📸 Ver galería y anuncios")}<br>${link(WHATSAPP, "💬 Preguntar por promociones")}`;
        }

        else if (contiene(pregunta, ["galeria", "fotos", "imagenes", "fotografias"])) {
            respuesta = `📸 Conoce más de Shop Ofe Trujillo en nuestra galería.<br>${link(SHOP_OFE.paginas.galeria, "📸 Ver galería")}`;
        }

        else if (contiene(pregunta, ["politica", "politicas", "devolucion", "devoluciones", "cambio", "cambios", "terminos"])) {
            respuesta = `📋 Consulta las políticas de Shop Ofe Trujillo aquí:<br>${link(SHOP_OFE.paginas.politicas, "📋 Ver políticas")}`;
        }

        else if (contiene(pregunta, ["cuenta", "registrarme", "registro", "registrar", "iniciar sesion", "login", "mi cuenta"])) {
            respuesta = `👤 Puedes acceder a tu cuenta desde nuestro sitio web.<br>${link(SHOP_OFE.paginas.login, "🔐 Iniciar sesión")}<br>${link(SHOP_OFE.paginas.registro, "✨ Crear cuenta")}`;
        }

        else if (contiene(pregunta, ["seguimiento", "rastrear", "rastreo", "donde esta mi pedido", "pedido enviado"])) {
            respuesta = `📦 Para consultar información específica sobre tu pedido, comunícate con Shop Ofe por WhatsApp.<br>${link(WHATSAPP, "💬 Contactar por WhatsApp")}`;
        }

        else if (contiene(pregunta, ["pago", "pagos", "forma de pago", "formas de pago", "tarjeta", "transferencia", "deposito"])) {
            respuesta = `💳 Para conocer las formas de pago disponibles, confirma directamente con Shop Ofe.<br>${link(WHATSAPP, "💬 Consultar formas de pago")}`;
        }

        else if (contiene(pregunta, ["gracias", "muchas gracias"])) {
            respuesta = `💖 ¡Con mucho gusto! Gracias por confiar en <strong>Shop Ofe Trujillo</strong>. 🛍️✨`;
        }

        else if (contiene(pregunta, ["adios", "bye", "hasta luego"])) {
            respuesta = `💖 ¡Hasta pronto! Gracias por visitar <strong>Shop Ofe Trujillo</strong>. 🛍️✨`;
        }

        else {
            respuesta = `💖 Puedo ayudarte con:<br>🛍️ Productos<br>💰 Precios<br>🚚 Envíos dentro de México<br>📦 Puntos de entrega<br>📍 Ubicación<br>🕐 Horarios<br>🛒 Cómo comprar<br>🔥 Promociones<br>📱 WhatsApp<br>📸 Redes sociales<br>📋 Políticas`;
        }

        typing.classList.add("active");
        scrollChat();

        setTimeout(function () {
            typing.classList.remove("active");
            agregarMensaje(respuesta, "bot");
        }, 500);
    }

    function enviarMensaje() {
        const texto = chatInput.value.trim();
        if (!texto) return;

        agregarMensaje(escapeHTML(texto), "user");
        chatInput.value = "";
        responder(texto);
    }

    chatButton.addEventListener("click", function () {
        chatWindow.classList.toggle("active");

        if (chatWindow.classList.contains("active")) {
            const notification = document.querySelector(".so-chat-notification");
            if (notification) notification.remove();

            setTimeout(function () {
                chatInput.focus();
                scrollChat();
            }, 150);
        }
    });

    chatClose.addEventListener("click", function () {
        chatWindow.classList.remove("active");
    });

    chatSend.addEventListener("click", enviarMensaje);

    chatInput.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            event.preventDefault();
            enviarMensaje();
        }
    });

    document.querySelectorAll(".so-quick-option").forEach(function (button) {
        button.addEventListener("click", function () {
            const pregunta = this.dataset.question;
            agregarMensaje(escapeHTML(pregunta), "user");
            responder(pregunta);
        });
    });

    whatsapp.addEventListener("click", abrirWhatsApp);

});