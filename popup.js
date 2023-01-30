// CARGAMOS EL TEXTO
try {
  chrome.storage.sync.get(['text'], function(result) {
    document.getElementById('textarea').value = result.text.join('/\n'); // Separamos los elementos del array con /
  });

}
catch(err) {
  console.log(err.message);
}


// COGEMOS EL TEXTO

try {
  var btn = document.getElementById("button");
  btn.addEventListener("click", function getText() {
    var array;
    var textarea = document.getElementById('textarea');
    var array = textarea.value.replace(/\s+/g, ' ').split('/').filter((e) => e.length > 0).map(s => s.trim()); // Con el map hacemos el trim de los valores
  
    // GUARDAMOS EL TEXTO
    chrome.storage.sync.set({text: array});
  
    document.getElementById('guardado').innerHTML = 'Guardado'
  });
}
catch(err) {
  console.log(err.message);
}



