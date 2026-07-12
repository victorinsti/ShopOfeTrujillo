// Conectar con QZ Tray
async function conectar() {
    if (!qz.websocket.isActive()) {
        await qz.websocket.connect();
    }
}

// Buscar la impresora predeterminada
async function obtenerImpresora() {
    await conectar();
    return await qz.printers.getDefault();
}

// Conectar con QZ Tray
async function conectar() {
    if (!qz.websocket.isActive()) {
        await qz.websocket.connect();
    }
}

// Obtener impresora predeterminada
async function obtenerImpresora() {
    await conectar();
    return await qz.printers.getDefault();
}

// Imprimir ticket y abrir cajón
window.imprimirTicket = async function(ticket) {

    try {

        const impresora = await obtenerImpresora();

        const config = qz.configs.create(impresora);

        // Imprimir ticket
        await qz.print(config, [{
            type: "raw",
            format: "plain",
            data: ticket
        }]);

        // Abrir cajón
        await qz.print(config, [{
            type: "raw",
            format: "command",
            data: "\x1B\x70\x00\x19\xFA"
        }]);

        console.log("Ticket impreso y cajón abierto");

    } catch (error) {

        console.error(error);
        alert("Error al imprimir");

    }

}