# Frontend - Sistema de Gestión de Biblioteca

Interfaz de usuario construida con Next.js, React y TailwindCSS.

## Ejecución local

```bash
npm install
cp .env.example .env.local
npm run dev
```

La app corre en `http://localhost:3001` y consume el backend definido en:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

## Pantallas

- Landing pública con acceso a inicio de sesión.
- Login y registro.
- Panel autenticado con sidebar.
- Transacciones de inventario.
- Maestros / Libros.
- Usuarios, solo para `ADMIN`.

## Roles

- `ADMIN`: puede administrar libros, movimientos y usuarios.
- `USER`: puede consultar libros y crear movimientos.

## Cuentas de prueba

- `admin@biblioteca.test` / `Admin12345`
- `usuario@biblioteca.test` / `User12345`
