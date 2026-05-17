CREATE DATABASE shop_ofe;
USE shop_ofe;

CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100),
    email VARCHAR(120) UNIQUE,
    password VARCHAR(255),
    telefono VARCHAR(20),
    direccion TEXT,
    puntos INT DEFAULT 0,
    cliente_id VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE empleados (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario VARCHAR(50) UNIQUE,
    nombre VARCHAR(100),
    password VARCHAR(255),
    puesto VARCHAR(100),
    telefono VARCHAR(20),
    area VARCHAR(100),
    horario VARCHAR(100)
);

CREATE TABLE productos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(150),
    descripcion TEXT,
    precio DECIMAL(10,2),
    imagen TEXT,
    tipo VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE ventas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cliente VARCHAR(120),
    total DECIMAL(10,2),
    metodo_pago VARCHAR(50),
    empleado VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);