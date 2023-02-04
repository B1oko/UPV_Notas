
// Seleccionamos la tabla
const tabla = document.getElementsByClassName("upv_listacolumnas")[0];
const thead = tabla.getElementsByTagName("thead")[0];
const tbody = tabla.getElementsByTagName("tbody")[0];
var filas = tbody.rows;
var estadisticas = { media: 0, aprobados: 0, suspendidos: 0 };
var listaSeguimiento = [""];

// Cargamos la lista de seguimiento
chrome.storage.sync.get(['listaSeguimiento'], function (result) {
	listaSeguimiento = result.listaSeguimiento;
	colorearListaSeguimiento();
});
// Creamos un listener para actualizar los cambios
chrome.storage.onChanged.addListener((changes, namespace) => {
	console.log("coloreando");
	listaSeguimiento = changes["listaSeguimiento"]["newValue"];
	colorearListaSeguimiento();
  });

// Ordenamos la tabla
thead.rows[0].insertCell(0).outerHTML = "<th></th>";
thead.rows[0].getElementsByTagName("th")[1].onclick = function () { ordenarTabla(1); };
thead.rows[0].getElementsByTagName("th")[2].onclick = function () { ordenarTabla(2); };

// Por defecto la tabla permanecerá ordenada por nota
ordenarTabla (2)

// Calculamos las estadísticas

let acumulador = 0;

for (i = 0; i < (filas.length); i++) {

	let nota = Number(filas[i].getElementsByTagName("TD")[2].innerHTML);
	acumulador += nota;
	if (nota >= 5) { estadisticas['aprobados']++ } else { estadisticas['suspendidos']++ } // Actualizamos las estadisticas
}

estadisticas['media'] = acumulador / filas.length;

// Mostramos las estadísticas

const container = document.getElementsByClassName('upv_containerwrap')[0];
var texto = 'Media: ' + estadisticas['media'].toFixed(3).toString() + '<br>Aprobados: ' + estadisticas['aprobados'].toString() + '<br>Suspensos: ' + estadisticas['suspendidos'].toString();
var parrafo = document.createElement("p");
parrafo.innerHTML = texto;
container.prepend(parrafo);



function ordenarTabla (n) {

	// Ordenamos la tabla

	let direccion = "desc";
	let ordenada = true;

	if (filas[0].getElementsByTagName("td").length == 2){
		for (let i = 0; i < filas.length; i++) {
			filas[i].insertCell(0).innerHTML = i+1;
			let columnas = filas[i].getElementsByTagName("td");
			columnas[2].innerHTML = Number(columnas[2].innerHTML.replace(',', '.'));
		}
	}

	for (let i = 0; i < filas.length; i++) {
		for (let j = 0; j < filas.length - i - 1; j++) {

			let x = filas[j].getElementsByTagName("TD")[n];
			let y = filas[j + 1].getElementsByTagName("TD")[n];

			//Ordenamos por nombre
			if (n == 1) {
				a = x.innerHTML.toLowerCase();
				b = y.innerHTML.toLowerCase();
			}

			// Ordenamos por nota
			else if (n == 2) {
				a = Number(x.innerHTML);
				b = Number(y.innerHTML);
			}

			
			if (direccion == "asc" && a > b) {

				filas[j].parentNode.insertBefore(filas[j + 1], filas[j]);
				ordenada = false;

			} else if (direccion == "desc" && a < b) {

				filas[j].parentNode.insertBefore(filas[j + 1], filas[j]);
				ordenada = false;

			} else if (ordenada && direccion == "desc" && i == 1 ){

				direccion = "asc";
				i = 0;
				ordenada = true;

			}
		}
	}

	// Añadimos la posicion y coloreamos corectamente

	for (i = 0; i < (filas.length); i++) {

		filas[i].getElementsByTagName("TD")[0].innerHTML = i+1;
		filas[i].style.backgroundColor = (i % 2) ? 'white' : '#F0F0F0';
		
	}

	// Coloreamos usuario en la lista de seguimiento
	
	colorearListaSeguimiento();

}

function colorearListaSeguimiento () {

	for (i = 1; i < (filas.length); i++){
		filas[i].style.backgroundColor = (i % 2) ? 'white' : '#F0F0F0';
		filas[i].style.color = '#818181';
		// Vemos si el nombre esta en la lista de seguimiento
		for (elemento of listaSeguimiento){
			if (filas[i].getElementsByTagName("TD")[1].innerHTML == elemento.nombre){
				filas[i].style.backgroundColor = elemento.color;
				filas[i].style.color = 'black';
				break;
			}
		}
	}
}