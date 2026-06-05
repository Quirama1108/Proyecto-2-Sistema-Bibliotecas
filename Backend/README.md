# Sistema Biblioteca Backend

Backend REST para el proyecto evaluativo de Ingenieria Web. Implementa autenticacion con JWT, roles `ADMIN` y `USER`, maestros de biblioteca y movimientos de inventario.

## Requisitos

- Node.js 20+
- PostgreSQL en Supabase
- Una variable `DATABASE_URL` con el transaction pooler de Supabase
- Una variable `DIRECT_URL` con el session pooler de Supabase para migraciones
- Una variable `JWT_SECRET` de minimo 24 caracteres

## Instalacion

```bash
yarn install
cp .env.example .env
yarn prisma:generate
yarn prisma:migrate
yarn db:seed
yarn dev
```

El backend queda disponible en `http://localhost:3000`.

## Usuarios de prueba

| Rol | Correo | Password |
| --- | --- | --- |
| ADMIN | `admin@biblioteca.test` | `Admin12345` |
| USER | `usuario@biblioteca.test` | `User12345` |

## Endpoints principales

- `POST /api/auth/login`: inicia sesion y retorna `{ token, user }`.
- `POST /api/auth/register`: crea un usuario `USER`.
- `GET /api/auth/me`: retorna el usuario autenticado.
- `GET /api/books`: lista maestros/libros. Requiere JWT.
- `POST /api/books`: crea maestro/libro. Solo `ADMIN`.
- `GET /api/books/:id`: detalle de maestro/libro. Requiere JWT.
- `PATCH /api/books/:id`: edita maestro/libro. Solo `ADMIN`.
- `DELETE /api/books/:id`: desactiva maestro/libro. Solo `ADMIN`.
- `GET /api/movements?bookId=ID`: lista movimientos de un libro. Requiere JWT.
- `POST /api/movements`: crea movimiento `ENTRADA` o `SALIDA`. Requiere JWT.
- `GET /api/movements/summary?bookId=ID`: puntos diarios para grafica. Requiere JWT.
- `GET /api/users`: lista usuarios. Solo `ADMIN`.
- `PATCH /api/users/:id`: cambia rol o estado de usuario. Solo `ADMIN`.

Todas las rutas protegidas reciben el token asi:

```http
Authorization: Bearer TOKEN
```

## Paginacion

Las rutas de listas aceptan `page` y `pageSize`:

- `GET /api/books?page=1&pageSize=10`
- `GET /api/movements?bookId=ID&page=1&pageSize=10`
- `GET /api/users?page=1&pageSize=10`

La respuesta incluye:

```json
{
  "data": {
    "pagination": {
      "total": 20,
      "page": 1,
      "pageSize": 10,
      "totalPages": 2
    }
  }
}
```

## Tests

Con el servidor corriendo en `http://localhost:3000`:

```bash
npm run test
```

Los tests hacen login con el admin del seed, crean libros temporales y validan movimientos.
