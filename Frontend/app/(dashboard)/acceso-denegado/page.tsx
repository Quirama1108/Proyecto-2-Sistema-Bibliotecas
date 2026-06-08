import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function AccesoDenegadoPage() {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center px-4 text-center sm:min-h-[60vh]">
      <h1 className="font-display text-2xl font-semibold text-stone-900 dark:text-stone-50">
        Acceso denegado
      </h1>
      <p className="mt-2 max-w-md text-sm text-stone-500 dark:text-stone-400">
        No tienes permisos para acceder a esta sección. Contacta a un administrador si
        necesitas acceso.
      </p>
      <Link href="/transacciones" className="mt-6">
        <Button>Volver a transacciones</Button>
      </Link>
    </div>
  );
}
