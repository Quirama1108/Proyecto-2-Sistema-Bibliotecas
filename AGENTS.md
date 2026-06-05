# Guia para el agente del frontend

Este proyecto separa responsabilidades:

- `Backend/`: API REST en Next.js con Prisma, Supabase/PostgreSQL y JWT.
- `Frontend/`: espacio para construir la interfaz en Next.js, React y TailwindCSS.

El frontend debe consumir el backend, no duplicar reglas de negocio.

## Contexto funcional

Tema elegido: Sistema de Gestion de Biblioteca.

Equivalencias del enunciado:

- Maestros = libros.
- Saldo = cantidad disponible de ejemplares.
- Movimiento de entrada = ingreso/devolucion de ejemplares.
- Movimiento de salida = prestamo/retiro de ejemplares.
- Responsable = usuario autenticado que crea el movimiento.

Roles:

- `ADMIN`: ve transacciones, maestros y usuarios. Puede crear/editar libros y editar roles de usuarios.
- `USER`: ve transacciones y maestros. Puede crear movimientos, pero no crear libros ni administrar usuarios.

## Autenticacion

Base URL local recomendada:

```txt
http://localhost:3000
```

Login:

```http
POST /api/auth/login
Content-Type: application/json
```

Body:

```json
{
  "email": "admin@biblioteca.test",
  "password": "Admin12345"
}
```

Respuesta exitosa:

```json
{
  "data": {
    "token": "jwt",
    "user": {
      "id": "string",
      "name": "Administrador Biblioteca",
      "email": "admin@biblioteca.test",
      "image": null,
      "role": "ADMIN"
    }
  }
}
```

Guardar el token y enviarlo en rutas protegidas:

```http
Authorization: Bearer TOKEN
```

## Pantallas requeridas

Landing:

- Primera pantalla publica.
- Boton para iniciar sesion.

Layout autenticado:

- Sidebar fijo a la izquierda.
- Mostrar nombre e imagen del usuario.
- Link a Transacciones visible para `ADMIN` y `USER`.
- Link a Maestros visible para `ADMIN` y `USER`.
- Link a Usuarios visible solo para `ADMIN`.

Transacciones:

- Dropdown de libros desde `GET /api/books`.
- Tabla de movimientos desde `GET /api/movements?bookId=ID`.
- Columnas minimas: id, fecha, tipo, cantidad, saldo resultante, responsable.
- Boton "Agregar movimiento" visible para `ADMIN` y `USER`.
- Dialogo con tipo `ENTRADA`/`SALIDA`, cantidad y nota opcional.
- Crear con `POST /api/movements`.
- Mostrar loading, exito o error; al crear, cerrar dialogo y refrescar tabla.
- Grafica con `GET /api/movements/summary?bookId=ID`.

Maestros:

- Tabla desde `GET /api/books`.
- Usar paginacion con `page` y `pageSize` cuando la tabla lo permita.
- Columnas minimas: id, nombre, autor, ISBN, saldo, creador.
- Boton "Agregar" visible solo para `ADMIN`.
- Crear con `POST /api/books`.

Usuarios:

- Ruta visible y accesible solo para `ADMIN`.
- Tabla desde `GET /api/users`.
- Usar paginacion con `page` y `pageSize` cuando la tabla lo permita.
- Columnas minimas: id, fecha de creacion, correo, nombre, rol, estado.
- Dialogo "Editar usuario" con dropdown `ADMIN`/`USER`.
- Actualizar con `PATCH /api/users/:id`.

## Contratos de API

Crear libro:

```http
POST /api/books
Authorization: Bearer TOKEN
Content-Type: application/json
```

Paginacion en listas:

```http
GET /api/books?page=1&pageSize=10
GET /api/movements?bookId=ID&page=1&pageSize=10
GET /api/users?page=1&pageSize=10
```

La API retorna metadatos de paginacion:

```json
{
  "pagination": {
    "total": 20,
    "page": 1,
    "pageSize": 10,
    "totalPages": 2
  }
}
```

```json
{
  "name": "Cien anos de soledad",
  "author": "Gabriel Garcia Marquez",
  "isbn": "9780307474728",
  "description": "Novela latinoamericana",
  "initialStock": 8
}
```

Crear movimiento:

```http
POST /api/movements
Authorization: Bearer TOKEN
Content-Type: application/json
```

```json
{
  "bookId": "id-del-libro",
  "type": "SALIDA",
  "quantity": 1,
  "note": "Prestamo a usuario"
}
```

Editar rol:

```http
PATCH /api/users/id-del-usuario
Authorization: Bearer TOKEN
Content-Type: application/json
```

```json
{
  "role": "USER"
}
```

Errores:

```json
{
  "error": "Mensaje legible"
}
```

Validaciones:

- Si el token falta o expiro, redirigir a login.
- Si la API responde `403`, mostrar pantalla de acceso denegado o redirigir al dashboard.
- Si una salida supera el saldo disponible, la API responde `409`.

## Recomendaciones de UI

- Usar componentes tipo tabla, dialogo, select, botones con estado loading y toasts.
- Mantener textos en espanol y sin errores de ortografia.
- La app debe ser responsive.
- No mostrar el boton de crear maestro a usuarios `USER`.
- No mostrar la seccion usuarios a usuarios `USER`.
