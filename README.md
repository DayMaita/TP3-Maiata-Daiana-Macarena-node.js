# Trabajo práctico 03

## Descripción

API HTTP desarrollada con Node.js y Express para administrar temporalmente un catálogo de instrumentos musicales.

La aplicación carga cinco instrumentos desde `datos/instrumentos.json` antes de iniciar el servidor. Permite listar, filtrar, consultar por identificador y crear instrumentos temporalmente en memoria.

## Instalación

Requisitos: Node.js y npm.

```bash
npm install
```

## Ejecución

```bash
npm run check
npm start
```

El servidor queda disponible en:

`http://localhost:3000`

Para detenerlo:

```text
Ctrl + C
```

## Endpoints

### GET /

Devuelve la bienvenida de la API.

### GET /api/instrumentos

Devuelve todos los instrumentos.

### GET /api/instrumentos?familia=cuerda

Filtra por familia sin distinguir mayúsculas de minúsculas. Por ejemplo, `cuerda`, `Cuerda` y `CUERDA` producen el mismo filtro.

### GET /api/instrumentos/:id

Devuelve el instrumento cuyo identificador coincide con el parámetro de ruta.

Ejemplo:

`GET /api/instrumentos/1`

### POST /api/instrumentos

Crea un instrumento en memoria.

Encabezado:

`Content-Type: application/json`

Cuerpo de ejemplo:

```json
{
  "nombre": "Bandoneón",
  "familia": "Viento",
  "origen": "Alemania",
  "descripcion": "Instrumento de fuelle utilizado en el tango.",
  "disponible": true
}
```

El identificador se genera automáticamente a partir del último registro.

## Códigos de estado

- `200 OK`: lectura exitosa.
- `201 Created`: instrumento creado correctamente.
- `400 Bad Request`: falta algún campo obligatorio.
- `404 Not Found`: no existe el instrumento solicitado.

## Parámetro de ruta y consulta

El parámetro de ruta identifica un recurso concreto:

`/api/instrumentos/1`

El valor `1` llega mediante `req.params.id`.

La consulta agrega un filtro opcional:

`/api/instrumentos?familia=cuerda`

El valor llega mediante `req.query.familia`.

## express.json()

`app.use(express.json())` permite que Express interprete cuerpos enviados en formato JSON y los coloque en `req.body`.

## Persistencia de los datos

Los cinco instrumentos iniciales se cargan desde el archivo JSON al iniciar el servidor.

Los instrumentos creados mediante POST se agregan solamente al arreglo que está en memoria. No se modifica `instrumentos.json` y no se utiliza una base de datos.

Por eso, después de reiniciar el servidor, los instrumentos creados durante la ejecución desaparecen y vuelven a estar disponibles únicamente los cinco registros iniciales.

## Matriz de pruebas

| Caso | Solicitud | Estado esperado | Resultado |
|---|---|---:|---|
| Bienvenida | GET / | 200 | Exitoso |
| Listado | GET /api/instrumentos | 200 | Exitoso |
| Filtro con coincidencias | GET /api/instrumentos?familia=cuerda | 200 | Exitoso |
| Filtro sin coincidencias | GET /api/instrumentos?familia=inexistente | 200 | Exitoso, devuelve [] |
| Detalle existente | GET /api/instrumentos/1 | 200 | Exitoso |
| Detalle inexistente | GET /api/instrumentos/999 | 404 | Exitoso, devuelve error |
| Creación válida | POST /api/instrumentos | 201 | Exitoso |
| Creación sin nombre | POST /api/instrumentos | 400 | Exitoso, devuelve error |
| Creación con disponible false | POST /api/instrumentos | 201 | Exitoso |

## Prueba de memoria

1. Ejecutar `npm start`.
2. Crear un instrumento mediante POST.
3. Repetir `GET /api/instrumentos` y comprobar que aparece.
4. Detener el servidor con `Ctrl + C`.
5. Ejecutar nuevamente `npm start`.
6. Repetir `GET /api/instrumentos`.
7. Comprobar que el instrumento creado ya no aparece.

## Fuera de alcance

No se incorporan routers, controladores, vistas HTML, middleware personalizado, PUT, PATCH, DELETE, base de datos, persistencia después del reinicio, validaciones avanzadas ni autenticación, porque no forman parte de esta entrega.
