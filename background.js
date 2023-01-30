	
var table, rows, switching, i, x, y, shouldSwitch;
table = document.getElementsByClassName("upv_listacolumnas");
table = table[0] //Seleccionamos la unica tabla que hay
switching = true;
while (switching) {
	switching = false;
	rows = table.rows;
	for (i = 1; i < (rows.length - 1); i++) {
		shouldSwitch = false;
		x = rows[i].getElementsByTagName("TD")[1];
		y = rows[i + 1].getElementsByTagName("TD")[1];
		if (Number(x.innerHTML.replace(',','.')) < Number(y.innerHTML.replace(',','.'))) {
			shouldSwitch = true;
			break;
		}
	}
	if (shouldSwitch) {
		rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
		switching = true;
	}
}

// La tabla ya esta ordenada, ahora le aplicamos el formato deseado
var stats = {aprobados:0,suspendidos:0,media:0};
try{
	chrome.storage.sync.get(['text'], function(result) {
		listaSeguimiento = result.text;
		if (typeof listaSeguimiento === 'undefined'){listaSeguimiento = ['']}
		colorear();
		estadisticas();
	});
}
catch(err) {
	var listaSeguimiento = [''];
	colorear();
	estadisticas();
}

// ---------------------------------------
// FUNCIONES
// ---------------------------------------

function colorear() {
	table = document.getElementsByClassName("upv_listacolumnas")[0];
	var contador = 0;
	var acumulador = 0;
	rows[0].insertCell(0).outerHTML = "<th></th>"; // Añadimos el titulo, lo añado de esta forma para mantener el formato
	for (i = 1; i < (rows.length); i++){
		let fila = rows[i].getElementsByTagName("TD"); //usar esta vatriable
		contador++;
		let nota = fila[1].innerHTML = Number(fila[1].innerHTML.replace(',','.'));
		fila[1].innerHTML = nota; // Modificamos el valor de la tabla para que sea un numero
		acumulador += nota;
		if (nota >= 5){stats['aprobados']++}else{stats['suspendidos']++} // Actualizamos las estadisticas
		rows[i].insertCell(0).innerHTML = contador; // Añadimos la columna con el valor de la posicion
		rows[i].style.backgroundColor = (contador%2)? 'white' : '#F0F0F0';
		
		// Vemos si el nombre esta en la lista de seguimiento
		for (nombre of listaSeguimiento){
			if (rows[i].getElementsByTagName("TD")[1].innerHTML == nombre.trim()){ // trim -> eliminamos espacios al inicio y final
				rows[i].style.backgroundColor = '#8BC34A';
				rows[i].style.color = 'black';
				break;
			}
		}
		
	}
	stats['media'] = acumulador/contador;
}

function estadisticas() {
	//Cogemos el container
	var container = document.getElementsByClassName('upv_containerwrap')[0];
	var texto = 'Media: '+stats['media'].toFixed(3).toString() + '<br>Aprobados: '+stats['aprobados'].toString() + '<br>Suspensos: '+stats['suspendidos'].toString();
	var parrafo = document.createElement("p");
	parrafo.innerHTML = texto;
	container.prepend(parrafo);
}