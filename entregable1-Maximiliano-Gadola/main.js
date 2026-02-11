
//PROGRAMA DONDE SE INGRESAN productos : RAMOS DE FLORES 

// ingresar datos de los ramos de flores
let ingresar=0;
let ramos = [];
do{
    let nombre = prompt("Ingrese el nombre del ramo:");
    let precio = Number(prompt("Ingrese el precio:"));
    let descripcion = prompt("Ingrese la descripción:");
    let categoria = prompt("Ingrese la categoria:");
    let ramo = crearRamo(nombre, precio, descripcion, categoria);
    validarRamoExistente(ramo);
    ingresar = Number(prompt("¿Querés agregar otro ramo? Ingresá 0 para SÍ o 1 para NO"));
}while(ingresar===0);
mostrarRamos(ramos);

//FUNCIONES 
function crearRamo(nombre, precio, descripcion, categoria) {
    return {
        nombre,
        precio,
        descripcion,
        categoria
    };
}

function guardarRamos(ramo) {
    ramos.push(ramo);
}
//
function validarRamoExistente(ramoNuevo) {
    let nombreValido = false;
    while (!nombreValido) {
        nombreValido = true;

        for (let i = 0; i < ramos.length; i++) {
            if (ramos[i].nombre === ramoNuevo.nombre) {
                alert("Este nombre ya está en uso, intente otro");
                ramoNuevo.nombre = prompt("Ingrese un nuevo nombre");
                nombreValido = false;
                break;
            }
        }
    }

    guardarRamos(ramoNuevo);
}

function mostrarRamos(ramos) {
    let salida = document.getElementById("listaDeRamos");

    for (let i = 0; i < ramos.length; i++) {
        salida.textContent += 
            "Nombre: " + ramos[i].nombre + "\n " +
            "Precio: $" + ramos[i].precio + "\n" +
            "Descripción: " + ramos[i].descripcion + "\n" +
            "Categoría: " + ramos[i].categoria + "\n\n";
    }
}