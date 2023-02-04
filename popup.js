const lista = document.querySelector("#lista");
const addElementoInput = document.querySelector("#adder-input-text");
const addElementoBtn = document.querySelector("#adder-btn");
const addElementoInputColor = document.querySelector("#adder-input-color");
const addElementoInputColorWrapper = document.querySelector("#adder-input-color-wrapper");

var listaSeguimiento = [];

// Cargamos la lista de seguimiento
chrome.storage.sync.get(['listaSeguimiento'], function (result) {

	listaSeguimiento = result.listaSeguimiento;

	for (elemento of listaSeguimiento) {
		nuevoElemento(elemento.nombre, elemento.color);
	}

});

// Añadimos esto para cambiar el color de wrapper con el del selector
// Unicamente sirve para que el selector sea más estetico
addElementoInputColor.onchange = function () {
	addElementoInputColorWrapper.style.backgroundColor = addElementoInputColor.value;
	addElementoInputColorWrapper.style.boxShadow = "1px 1px 2px " + oscurecerColor(addElementoInputColor.value, 40);

}
addElementoInputColorWrapper.style.backgroundColor = addElementoInputColor.value = "#8BC34A";
addElementoInputColorWrapper.style.boxShadow = "1px 1px 2px #6F9E3E";

// Creamos el EventListener para el boton de añadir usuarios
addElementoBtn.addEventListener("click", function () {

	const nombre = addElementoInput.value;
	addElementoInput.value = "";
	const color =addElementoInputColor.value;
	nuevoElemento(nombre,color);

});

// Funcion que creará los nuevos elementos de las listas
function nuevoElemento(nombre, color) {

	// Creamos la lista
	const elementoLista = document.createElement("div");
	elementoLista.classList.add("elemento-lista");

	// Creamos el div izquierda
	const izquierda = document.createElement("div");
	izquierda.classList.add("izquierda");

	// Creamos el selector de color
	const inputColorWrapper = document.createElement("div");
	inputColorWrapper.classList.add("input-color-wrapper");
	const inputColor = document.createElement("input");
	inputColor.classList.add("input-color");
	inputColor.type = "color";
	inputColor.onchange = function () {
		inputColorWrapper.style.backgroundColor = inputColor.value;
		inputColorWrapper.style.boxShadow = "1px 1px 2px " + oscurecerColor(addElementoInputColor.value, 40);
		guardarElementos();
	}
	inputColorWrapper.style.backgroundColor = inputColor.value = color;

	// Creamos el div para el texto
	const texto = document.createElement("div");
	texto.classList.add("texto");
	texto.textContent = nombre;

	// Creamos el div que almacenara los botones ocultos
	const botonesOcultos = document.createElement("div");
	botonesOcultos.classList.add("botones-ocultos");

	// Creamos el boton para editar
	const editButton = document.createElement("button");
	editButton.classList.add("edit-button");
	const editIcon = document.createElement("i");
	editIcon.classList.add("fas", "fa-edit");
	editButton.appendChild(editIcon);

	// Creamos el boton para eliminar los elementos
	const removeButton = document.createElement("button");
	removeButton.classList.add("remove-button");
	const removeIcon = document.createElement("i");
	removeIcon.classList.add("fas", "fa-trash-alt");
	removeButton.appendChild(removeIcon);

	
	// Juntamos todo para crear el nuevo elemento
	inputColorWrapper.appendChild(inputColor);

	izquierda.appendChild(inputColorWrapper);
	izquierda.appendChild(texto);

	botonesOcultos.appendChild(editButton);
	botonesOcultos.appendChild(removeButton);

	elementoLista.appendChild(izquierda);
	elementoLista.appendChild(botonesOcultos);

	lista.appendChild(elementoLista);

	// Evento para eliminar el elemento
	removeButton.addEventListener("click", function () {
		elementoLista.parentNode.removeChild(elementoLista);
		guardarElementos();
	});

	// Evento para editar el elemento
	editButton.addEventListener("click", function () {
		const inputField = document.createElement("input");
		inputField.value = texto.textContent;
		izquierda.replaceChild(inputField, texto);

		inputField.addEventListener("blur", function () {
			texto.textContent = inputField.value;
			izquierda.replaceChild(texto, inputField);
			guardarElementos();
		});

		inputField.focus();
	});

	// Guardamos el nuevo elemento
	guardarElementos();
}

function guardarElementos (){

	listaSeguimiento = [];

	for (elemento of lista.getElementsByClassName("elemento-lista")){
		let color = elemento.getElementsByClassName("input-color")[0].value;
		let nombre = elemento.getElementsByClassName("texto")[0].innerHTML;
		listaSeguimiento.push({"nombre":nombre.trim(), "color":color});
	}
	
	chrome.storage.sync.set({ "listaSeguimiento": listaSeguimiento });
}


// Esta función sirve para oscurrecer un color en cierto porcentaje. Se usa para las sombras.
function oscurecerColor(color, percentage) {
	let colorArray = [
		parseInt(color.substring(1, 3), 16),
		parseInt(color.substring(3, 5), 16),
		parseInt(color.substring(5, 7), 16)
	];

	colorArray = colorArray.map(function (c) {
		return Math.round(c * (100 - percentage) / 100);
	});

	return (
		"#" + colorArray.map(function (c) {
			let hex = c.toString(16);
			return hex.length == 1 ? "0" + hex : hex;
		}).join("")
	);
}



