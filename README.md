# prueba_cafeteria_nanacao
Se modifca index.js para lograr el maximo % de test agregando:

1) Validación para ID en la ruta POST, para asegurar que se maneje cuando falta un ID.
2) Se usa fs para cargar y guardar datos en cafes.json para que las pruebas no modifiquen los datos en cafes.json.

Se agregan pruebas adicionales para conseguir el 100%, estan marcadas con  *PRUEBA ADICIONAL* seguido de la explicacion,
las pruebas agregadas para las rutas son: 

GET: 
- Verificando respuesta 404 cuando el id no existe.

DELETE:
- Verificando error 400 si no se entrega el encabezado de autorización.
- Verificando que se elimina un café que existe en forma correcta y responda con estado 200.

POST:
- Verificando el error al intentar agregar un café sin id.

PUT:
- Verificando el error al actualizar un café sin id en el payload.