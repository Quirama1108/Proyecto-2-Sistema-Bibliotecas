# Sistema de Gestión de Biblioteca

Proyecto evaluativo de Ingeniería Web para administrar libros, movimientos de inventario y usuarios con roles diferenciados.

## Integrantes

- Castaneda
- Losada

## Alcance

La aplicación implementa un sistema de gestión de biblioteca:

- Los usuarios pueden iniciar sesión y consultar libros.
- Los roles `ADMIN` y `USER` pueden registrar movimientos de entrada y salida.
- El rol `ADMIN` puede crear libros maestros y administrar usuarios.
- El sistema muestra historial de movimientos y gráfica de evolución del saldo.

## Estructura

- `Backend/`: API REST en Next.js, Prisma, PostgreSQL/Supabase y JWT.
- `Frontend/`: interfaz en Next.js, React y TailwindCSS.
- `AGENTS.md`: guía de integración técnica para agentes o compañeros del frontend.

## Usuarios de prueba

| Rol | Correo | Contraseña |
| --- | --- | --- |
| ADMIN | `admin@biblioteca.test` | `Admin12345` |
| USER | `usuario@biblioteca.test` | `User12345` |

## Ejecución local

Instalar dependencias del backend:

```bash
cd Backend
npm install
cp .env.example .env
npm run prisma:generate
npm run prisma:migrate
npm run db:seed
npm run dev
```

El backend queda en `http://localhost:3000`.

Instalar dependencias del frontend:

```bash
cd Frontend
npm install
cp .env.example .env.local
npm run dev
```

El frontend queda en `http://localhost:3001`.

## Variables de entorno

Backend:

- `DATABASE_URL`: URL del transaction pooler de Supabase.
- `DIRECT_URL`: URL del session pooler de Supabase para migraciones.
- `JWT_SECRET`: secreto para firmar tokens JWT.
- `JWT_EXPIRES_IN`: duración del token, por ejemplo `7d`.
- `FRONTEND_URL`: URL pública o local del frontend.

Frontend:

- `NEXT_PUBLIC_API_URL`: URL base del backend.

## Verificación

Con el backend corriendo:

```bash
cd Backend
npm run test
```

También se verificó compilación con:

```bash
npm run build
```

## Despliegue

Para Vercel:

- Backend: configurar el proyecto con root directory `Backend` y las variables de entorno del backend.
- Frontend: configurar el proyecto con root directory `Frontend` y `NEXT_PUBLIC_API_URL` apuntando al backend desplegado.

URL de Vercel: pendiente de configurar.
