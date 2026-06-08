import { Suspense } from "react";
import { Library } from "lucide-react";
import Link from "next/link";
import { LoginForm } from "@/components/auth/login-form";
import { ThemeToggle } from "@/components/layout/theme-toggle";

export default function LoginPage() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4">
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-amber-50 via-stone-100 to-emerald-50 dark:from-stone-950 dark:via-stone-900 dark:to-stone-950" />
      <div className="absolute right-0 top-0 -z-10 h-64 w-64 rounded-full bg-amber-300/20 blur-3xl dark:bg-amber-500/10" />

      <div className="absolute right-4 top-4 z-10">
        <ThemeToggle
          variant="secondary"
          className="border-stone-200/80 bg-white/95 shadow-md backdrop-blur-sm dark:border-stone-700 dark:bg-stone-900/95"
        />
      </div>

      <div className="w-full max-w-md rounded-2xl border border-stone-200/80 bg-white/90 p-6 shadow-2xl backdrop-blur dark:border-stone-800 dark:bg-stone-900/90 sm:p-8">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 to-amber-700 text-white shadow-lg">
            <Library className="h-7 w-7" />
          </div>
          <h1 className="font-display text-2xl font-semibold text-stone-900 dark:text-stone-50">
            Iniciar sesion
          </h1>
          <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">
            Accede al panel de gestion de biblioteca
          </p>
        </div>
        <Suspense fallback={<p className="text-center text-sm text-stone-500">Cargando...</p>}>
          <LoginForm />
        </Suspense>
        <p className="mt-6 text-center text-sm text-stone-500 dark:text-stone-400">
          ¿No tienes cuenta?{" "}
          <Link href="/registro" className="font-medium text-amber-700 hover:underline dark:text-amber-400">
            Crear cuenta
          </Link>
        </p>
        <p className="mt-2 text-center text-sm text-stone-500 dark:text-stone-400">
          <Link href="/" className="font-medium text-amber-700 hover:underline dark:text-amber-400">
            Volver al inicio
          </Link>
        </p>
      </div>
    </div>
  );
}
