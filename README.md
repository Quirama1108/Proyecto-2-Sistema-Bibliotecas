# Sistema de Gestion de Biblioteca

Proyecto evaluativo de Ingenieria Web. El alcance actual implementa la base de datos y el backend; el frontend queda separado para integrarse contra la API.

## Estructura

- `Backend/`: Next.js API Routes, Prisma, PostgreSQL/Supabase y JWT.
- `Frontend/`: carpeta reservada para el equipo de frontend.
- `AGENTS.md`: guia de integracion para el agente que construya el frontend.

## Stack backend

- Next.js 16
- Prisma 7
- PostgreSQL/Supabase
- JWT con HMAC SHA-256
- Hash de passwords con PBKDF2

## Cuentas de prueba

- Admin: `admin@biblioteca.test` / `Admin12345`
- Usuario: `usuario@biblioteca.test` / `User12345`

Ver [Backend/README.md](Backend/README.md) para ejecutar migraciones, seed y servidor local.

## Verificacion backend

Con el backend corriendo:

```bash
npm run test
```

Los tests cubren login, listado/creacion de libros y movimientos de inventario.
