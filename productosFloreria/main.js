import { ramos } from "./productos.js";
//variables DOM
const catalogo=document.getElementById("catalogo");
const listaCarrito=document.getElementById("listaCarrito");
const formPedido=document.getElementById("formPedido");
//guardar carrito 
let carrito = JSON.parse(localStorage.getItem("carritoRamos")) || [];
//funciones
const controlDeStock=(ramo)=>{ //Controla el stock del carrito ya antes guardado
    const ramoExistente=carrito.find(ramoEnCarrito=> ramoEnCarrito.id===ramo.id);
    let stockdisponible;
    if(ramoExistente){
        stockdisponible=ramo.stock-ramoExistente.cantidad;
    }else{
        stockdisponible=ramo.stock;
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
    } else {
        boton.disabled = false;
        boton.textContent = "Agregar ramo";
    }
}
const mostrarCarrito= ()=>{
    listaCarrito.innerHTML = ""
    carrito.forEach(ramo=>{
    const li = document.createElement("li")
    let precioCantidad= ramo.cantidad * ramo.precio;
    li.innerHTML = `${ramo.nombreRamo} -  cantidad= ${ramo.cantidad} -  precio= $${precioCantidad}`
    listaCarrito.appendChild(li)
})
}
const mostrarTotal=()=>{
    const total=carrito.reduce((acumulador,ramo)=>{
        return acumulador+ramo.precio*ramo.cantidad;
    },0)
    const elementoTotal=document.getElementById("totalCarrito");
    elementoTotal.textContent=`$${total}`;
}
const guardarCarrito= ()=>{
    localStorage.setItem("carritoRamos",JSON.stringify(carrito)) 
}

const agregarAlCarrito = (ramo)=>{
    const ramoExistente=carrito.find(ramoEnCarrito=> ramoEnCarrito.id===ramo.id);

    if(ramoExistente){
        ramoExistente.cantidad=ramoExistente.cantidad+1;
        
    }else{
        const nuevoRamo= {...ramo,cantidad:1};
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
        precio.textContent = `Precio:  ${ramo.precio}`;
        stock.textContent = `Stock: ${controlDeStock(ramo)}`;
        if (controlDeStock(ramo) <= 0) {
        boton.disabled = true;
        boton.textContent = "Sin stock";
        } else {
        boton.disabled = false;
        boton.textContent = "Agregar ramo";
        }
        boton.addEventListener("click", () => {
            agregarAlCarrito(ramo);
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
const validarDatos=()=>{
    const nombre=document.getElementById("nombre").value;
    const apellido=document.getElementById("apellido").value;
    const telefono=document.getElementById("telefono").value;
    const tipoDeEnvio=document.getElementById("tipoDeEnvio").value;
    if(nombre === "" || apellido === "" || telefono === "" || tipoDeEnvio === ""){
        return false
    }else{
        return true
    }
}
const borrarCarrito=()=>{
    localStorage.removeItem("carritoRamos");
    carrito=[];
}
const realizarPedido=(e)=>{
    e.preventDefault();
    const mensajeDeAgradecimiento=document.getElementById("mensajeDeAgradecimiento");
    mensajeDeAgradecimiento.classList.remove("aprobado", "rechazado");
    if(validarDatos()){
        mensajeDeAgradecimiento.textContent=`¡Pedido Realizado Nos pondremos en Contacto!`;
        mensajeDeAgradecimiento.classList.add("aprobado");
        borrarCarrito()
        mostrarCarrito()
        mostrarTotal()
        formPedido.reset()
    }else{
        mensajeDeAgradecimiento.textContent=`¡Por favor completa todos los campos!`;
        mensajeDeAgradecimiento.classList.add("rechazado");
    }
}
const filtrarPorCategoria = (categoria) => {
    if(categoria==="todos"){
        mostrarRamos();
    }else{
        const ramosFiltrados= ramos.filter(ramo=>ramo.categoria===categoria);
        mostrarRamos(ramosFiltrados);
    }
    

}
const inicializar = () => {
    mostrarRamos();
    guardarCarrito();
    mostrarCarrito();
    mostrarTotal();
}

inicializar();
//click en boton realiazar pedido 

const botonesFiltro = document.querySelectorAll(".btn-filtro");
botonesFiltro.forEach(boton => {
    boton.addEventListener("click", () => {
        const categoria = boton.getAttribute("data-categoria");
        filtrarPorCategoria(categoria);
    });
});
formPedido.addEventListener("submit", realizarPedido);


