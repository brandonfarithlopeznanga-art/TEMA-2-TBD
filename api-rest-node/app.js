const express = require('express');
const { PrismaClient } = require('@prisma/client');

const app = express();
const prisma = new PrismaClient();
const PORT = 3000;

app.use(express.json());

// ==========================================
// 1. GET: Consultar todos los productos
// ==========================================
app.get('/api/productos', async (req, res) => {
    try {
        const productos = await prisma.product.findMany();

        res.status(200).json(productos);
    } catch (error) {
        console.error('Error al consultar productos:', error);

        res.status(500).json({
            error: 'Error al consultar los productos'
        });
    }
});

// ==========================================
// 2. GET: Consultar un producto por su ID
// ==========================================
app.get('/api/productos/:id', async (req, res) => {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({
            error: 'El ID debe ser un número entero positivo'
        });
    }

    try {
        const producto = await prisma.product.findUnique({
            where: { id }
        });

        if (!producto) {
            return res.status(404).json({
                error: 'Producto no encontrado'
            });
        }

        res.status(200).json(producto);
    } catch (error) {
        console.error('Error al consultar el producto:', error);

        res.status(500).json({
            error: 'Error al consultar el producto'
        });
    }
});

// ==========================================
// 3. POST: Registrar un producto
// ==========================================
app.post('/api/productos', async (req, res) => {
    const { nombre, precio, stock } = req.body;

    if (
        typeof nombre !== 'string' ||
        nombre.trim() === '' ||
        typeof precio !== 'number' ||
        !Number.isFinite(precio) ||
        precio < 0 ||
        (
            stock !== undefined &&
            (!Number.isInteger(stock) || stock < 0)
        )
    ) {
        return res.status(400).json({
            error: 'Proporciona un nombre válido, un precio numérico no negativo y un stock entero no negativo'
        });
    }

    try {
        const nuevoProducto = await prisma.product.create({
            data: {
                nombre: nombre.trim(),
                precio,
                ...(stock !== undefined ? { stock } : {})
            }
        });

        res.status(201).json({
            mensaje: 'Producto registrado correctamente',
            producto: nuevoProducto
        });
    } catch (error) {
        console.error('Error al registrar el producto:', error);

        res.status(500).json({
            error: 'Error al registrar el producto'
        });
    }
});

// ==========================================
// 4. PUT: Actualizar un producto
// ==========================================
app.put('/api/productos/:id', async (req, res) => {
    const id = Number(req.params.id);
    const { nombre, precio, stock } = req.body;

    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({
            error: 'El ID debe ser un número entero positivo'
        });
    }

    const datos = {};

    if (nombre !== undefined) {
        if (
            typeof nombre !== 'string' ||
            nombre.trim() === ''
        ) {
            return res.status(400).json({
                error: 'El nombre debe ser un texto válido'
            });
        }

        datos.nombre = nombre.trim();
    }

    if (precio !== undefined) {
        if (
            typeof precio !== 'number' ||
            !Number.isFinite(precio) ||
            precio < 0
        ) {
            return res.status(400).json({
                error: 'El precio debe ser un número no negativo'
            });
        }

        datos.precio = precio;
    }

    if (stock !== undefined) {
        if (!Number.isInteger(stock) || stock < 0) {
            return res.status(400).json({
                error: 'El stock debe ser un entero no negativo'
            });
        }

        datos.stock = stock;
    }

    if (Object.keys(datos).length === 0) {
        return res.status(400).json({
            error: 'Debes proporcionar al menos un campo para actualizar'
        });
    }

    try {
        const productoActualizado = await prisma.product.update({
            where: { id },
            data: datos
        });

        res.status(200).json({
            mensaje: 'Producto actualizado correctamente',
            producto: productoActualizado
        });
    } catch (error) {
        if (error.code === 'P2025') {
            return res.status(404).json({
                error: 'Producto no encontrado'
            });
        }

        console.error('Error al actualizar el producto:', error);

        res.status(500).json({
            error: 'Error al actualizar el producto'
        });
    }
});

// ==========================================
// 5. DELETE: Eliminar un producto
// ==========================================
app.delete('/api/productos/:id', async (req, res) => {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({
            error: 'El ID debe ser un número entero positivo'
        });
    }

    try {
        const productoEliminado = await prisma.product.delete({
            where: { id }
        });

        res.status(200).json({
            mensaje: 'Producto eliminado correctamente',
            producto: productoEliminado
        });
    } catch (error) {
        if (error.code === 'P2025') {
            return res.status(404).json({
                error: 'Producto no encontrado'
            });
        }

        console.error('Error al eliminar el producto:', error);

        res.status(500).json({
            error: 'Error al eliminar el producto'
        });
    }
});

// ==========================================
// Iniciar el servidor
// ==========================================
app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
    console.log(`API disponible en http://localhost:${PORT}/api/productos`);
});