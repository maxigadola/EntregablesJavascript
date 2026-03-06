//variables DOM
const catalogo = document.getElementById("catalogo");
const listaCarrito = document.getElementById("listaCarrito");
const formPedido = document.getElementById("formPedido");
let ramos = [];
//guardar carrito 
let carrito = JSON.parse(localStorage.getItem("carritoRamos")) || [];

//funciones
const cargarRamos = async () => {
    const respuesta = await fetch("./productos.json");
    ramos = await respuesta.json();
    inicializar();
}

const controlDeStock = (ramo) => { //Controla el stock del carrito ya antes guardado
    const ramoExistente = carrito.find(ramoEnCarrito => ramoEnCarrito.id === ramo.id);
    let stockdisponible;
    if (ramoExistente) {
        stockdisponible = ramo.stock - ramoExistente.cantidad;
    } else {
        stockdisponible = ramo.stock;
    }
    return stockdisponible;
}

const actualizarCard = (ramoId) => { //actualiza el stock y el boton agregar ramo 
    const card = document.querySelector(`[data-id="${ramoId}"]`);
    const ramo = ramos.find(r => r.id === ramoId);
    const stockElement = card.querySelector("p:nth-child(3)");
    const boton = card.querySelector("button");

    stockElement.textContent = `Stock: ${controlDeStock(ramo)}`;

    if (controlDeStock(ramo) <= 0) {
        boton.disabled = true;
        boton.textContent = "Sin stock";
        Swal.fire({
            toast: true,
            position: "top-end",
            icon: "error",
            title: "¡Sin stock disponible!",
            showConfirmButton: false,
            timer: 3000,
        });
    } else {
        boton.disabled = false;
        boton.textContent = "Agregar ramo";
        Swal.fire({
            toast: true,
            position: "top-end",
            icon: "success",
            title: "¡Se agregó el ramo correctamente!",
            showConfirmButton: false,
            timer: 3000,
        });
    }
}

const eliminarDelCarrito = (id) => {
    const ramo = carrito.find(r => r.id === id)
    if (ramo.cantidad > 1) {
        ramo.cantidad -= 1
    } else {
        carrito = carrito.filter(r => r.id !== id)
    }
    mostrarCarrito()
    mostrarTotal()
    guardarCarrito()
    actualizarCard(id) // actualiza la card al eliminar
}

const mostrarCarrito = () => {
    listaCarrito.innerHTML = ""
    carrito.forEach(ramo => {
        const li = document.createElement("li")
        let precioCantidad = ramo.cantidad * ramo.precio
        const texto = document.createTextNode(`${ramo.nombreRamo} - cantidad= ${ramo.cantidad} - precio= $${precioCantidad}`)
        li.appendChild(texto)
        const btnEliminar = document.createElement("button")
        btnEliminar.innerHTML = '<img src="./img/delete.ico" alt="eliminar ramo" width="20">'
        btnEliminar.classList.add("btn-Eliminar")
        btnEliminar.addEventListener("click", () => {
            Swal.fire({
                title: "¿Estas seguro de quitar del carrito?",
                text: "❌",
                icon: "warning",
                showCancelButton: true,
                cancelButtonText: "Cancelar",
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Si, quiero quitarlo"
            }).then((result) => {
                if (result.isConfirmed) {
                    eliminarDelCarrito(ramo.id);
                    Swal.fire({
                        title: "¡Ramo eliminado!",
                        text: "Se ha quitado del carrito correctamente",
                        icon: "success"
                    });
                }
            });
        })
        li.appendChild(btnEliminar)
        listaCarrito.appendChild(li)
    })
}

const mostrarTotal = () => {
    const total = carrito.reduce((acumulador, ramo) => {
        return acumulador + ramo.precio * ramo.cantidad;
    }, 0)
    const elementoTotal = document.getElementById("totalCarrito");
    elementoTotal.textContent = `$${total}`;
}

const guardarCarrito = () => {
    localStorage.setItem("carritoRamos", JSON.stringify(carrito))
}

const agregarAlCarrito = (ramoId) => {
    const ramo = ramos.find(r => r.id === ramoId); // busca siempre del array original
    const ramoExistente = carrito.find(r => r.id === ramoId);

    if (ramoExistente) {
        ramoExistente.cantidad += 1;
    } else {
        const nuevoRamo = { ...ramo, cantidad: 1 };
        carrito.push(nuevoRamo);
    }
    mostrarCarrito()
    mostrarTotal()
    guardarCarrito()
}

//mostrar productos
function mostrarRamos(arrayRamos = ramos) {
    catalogo.innerHTML = "";
    arrayRamos.forEach(ramo => {
        //crear
        const card = document.createElement("div");
        const titulo = document.createElement("h3");
        const precio = document.createElement("p");
        const stock = document.createElement("p");
        const boton = document.createElement("button");
        card.classList.add("card");
        card.setAttribute("data-id", ramo.id);
        titulo.textContent = ramo.nombreRamo;
        precio.textContent = `Precio: $${ramo.precio}`;
        stock.textContent = `Stock: ${controlDeStock(ramo)}`;
        if (controlDeStock(ramo) <= 0) {
            boton.disabled = true;
            boton.textContent = "Sin stock";
        } else {
            boton.disabled = false;
            boton.textContent = "Agregar ramo";
        }
        boton.addEventListener("click", () => {
            agregarAlCarrito(ramo.id); // pasa el id en lugar del objeto
            actualizarCard(ramo.id);
        });
        //agregar al DOM
        card.appendChild(titulo);
        card.appendChild(precio);
        card.appendChild(stock);
        card.appendChild(boton);
        catalogo.appendChild(card);
    });
}

const validarDatos = () => {
    const nombre = document.getElementById("nombre").value;
    const apellido = document.getElementById("apellido").value;
    const telefono = document.getElementById("telefono").value;
    const tipoDeEnvio = document.getElementById("tipoDeEnvio").value;
    if (nombre === "" || apellido === "" || telefono === "" || tipoDeEnvio === "") {
        return false
    } else {
        return true
    }
}

const borrarCarrito = () => {
    localStorage.removeItem("carritoRamos");
    carrito = [];
}

const realizarPedido = (e) => {
    e.preventDefault();
    if (validarDatos()) {
        Swal.fire({
            title: "¡Pedido Realizado!",
            text: `Gracias por elegirnos`,
            icon: "success",
            draggable: true
        });
        borrarCarrito()
        mostrarCarrito()
        mostrarTotal()
        formPedido.reset()
    } else {
        mensajeDeAgradecimiento.textContent = `¡Por favor completa todos los campos!`;
        mensajeDeAgradecimiento.classList.add("rechazado");
    }
}

const filtrarPorCategoria = (categoria) => {
    if (categoria === "todos") {
        mostrarRamos();
    } else {
        const ramosFiltrados = ramos.filter(ramo => ramo.categoria === categoria);
        mostrarRamos(ramosFiltrados);
    }
}

const inicializar = () => {
    mostrarRamos();
    guardarCarrito();
    mostrarCarrito();
    mostrarTotal();
}

//click en botones de filtro
const botonesFiltro = document.querySelectorAll(".btn-filtro");
botonesFiltro.forEach(boton => {
    boton.addEventListener("click", () => {
        const categoria = boton.getAttribute("data-categoria");
        filtrarPorCategoria(categoria);
    });
});

formPedido.addEventListener("submit", realizarPedido);

// Inicio Programa
cargarRamos();