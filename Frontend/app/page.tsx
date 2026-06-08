import { BookOpen, Library, LogIn, Shield, Sparkles } from "lucide-react";
import Link from "next/link";
import { LandingThemeToggle } from "@/components/layout/landing-theme-toggle";
import { Button } from "@/components/ui/button";

const steps = [
  {
    number: "01",
    title: "Inicia sesion",
    description: "Accede con tu rol de administrador o usuario del sistema."
  },
  {
    number: "02",
    title: "Gestiona libros",
    description: "Consulta el catalogo, saldos y responsables de cada maestro."
  },
  {
    number: "03",
    title: "Registra movimientos",
    description: "Controla entradas, salidas y la evolucion diaria del inventario."
  }
];

export default function LandingPage() {
  return (
    <div className="min-h-screen overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-amber-50 via-stone-100 to-emerald-50 dark:from-stone-950 dark:via-stone-900 dark:to-stone-950" />
      <div className="absolute -right-20 top-20 -z-10 h-72 w-72 rounded-full bg-amber-300/20 blur-3xl dark:bg-amber-500/10" />
      <div className="absolute -left-16 bottom-10 -z-10 h-64 w-64 rounded-full bg-emerald-300/20 blur-3xl dark:bg-emerald-500/10" />

      <header className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-4 sm:px-6 sm:py-6">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 animate-float items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 to-amber-700 text-white shadow-lg shadow-amber-900/20">
            <Library className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <p className="truncate font-display text-base font-semibold text-stone-900 dark:text-stone-50">
              Biblioteca Central
            </p>
            <p className="text-xs text-stone-500 dark:text-stone-400">Sistema de gestion</p>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <LandingThemeToggle />
          <Link href="/login">
            <Button size="sm" className="sm:h-10 sm:px-4 sm:text-sm">
              <LogIn className="h-4 w-4" />
              Iniciar sesion
            </Button>
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 pb-16 pt-4 sm:px-6 sm:pt-8">
        <section className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div className="animate-fade-up">
            <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-medium text-amber-900 dark:border-amber-900 dark:bg-amber-950/50 dark:text-amber-200">
              <Sparkles className="h-3.5 w-3.5" />
              Proyecto Ingenieria Web
            </p>
            <h1 className="font-display text-4xl font-bold leading-tight tracking-tight text-stone-900 dark:text-stone-50 sm:text-5xl">
              Tu biblioteca, organizada con elegancia
            </h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-stone-600 dark:text-stone-300">
              Controla prestamos, devoluciones y saldos de ejemplares. Administra libros y
              usuarios desde un panel claro, moderno y pensado para cada rol.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/login">
                <Button size="lg">
                  <LogIn className="h-4 w-4" />
                  Entrar al sistema
                </Button>
              </Link>
              <Link href="/registro">
                <Button size="lg" variant="secondary">
                  Crear cuenta
                </Button>
              </Link>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <FeatureCard
              icon={<BookOpen className="h-5 w-5" />}
              title="Maestros"
              description="Consulta libros, saldos y responsables de cada registro."
              delay="100ms"
            />
            <FeatureCard
              icon={<Library className="h-5 w-5" />}
              title="Transacciones"
              description="Registra entradas y salidas con seguimiento diario del saldo."
              delay="200ms"
            />
            <FeatureCard
              icon={<Shield className="h-5 w-5" />}
              title="Roles"
              description="Acceso diferenciado para administradores y usuarios."
              className="sm:col-span-2"
              delay="300ms"
            />
          </div>
        </section>

        <section className="mt-20">
          <h2 className="font-display text-2xl font-semibold text-stone-900 dark:text-stone-50 sm:text-3xl">
            Como funciona
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-stone-600 dark:text-stone-400">
            Tres pasos para llevar el inventario de tu biblioteca sin complicaciones.
          </p>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {steps.map((step) => (
              <div
                key={step.number}
                className="rounded-2xl border border-stone-200/80 bg-white/80 p-5 shadow-sm backdrop-blur transition duration-300 hover:-translate-y-1 hover:shadow-md dark:border-stone-800 dark:bg-stone-900/80"
              >
                <p className="font-display text-3xl font-bold text-amber-700/40 dark:text-amber-400/40">
                  {step.number}
                </p>
                <h3 className="mt-2 font-display text-lg font-semibold text-stone-900 dark:text-stone-50">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm text-stone-600 dark:text-stone-400">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
  className,
  delay = "0ms"
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  className?: string;
  delay?: string;
}) {
  return (
    <div
      style={{ animationDelay: delay }}
      className={`animate-fade-up rounded-2xl border border-white/70 bg-white/80 p-5 shadow-sm backdrop-blur transition duration-300 hover:-translate-y-1 hover:shadow-lg dark:border-stone-800 dark:bg-stone-900/80 ${className || ""}`}
    >
      <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-amber-100 to-amber-200 text-amber-800 dark:from-amber-950 dark:to-amber-900 dark:text-amber-300">
        {icon}
      </div>
      <h2 className="font-display text-lg font-semibold text-stone-900 dark:text-stone-50">
        {title}
      </h2>
      <p className="mt-1 text-sm text-stone-600 dark:text-stone-400">{description}</p>
    </div>
  );
}
