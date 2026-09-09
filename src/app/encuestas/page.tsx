import { redirect } from 'next/navigation';

/** Redirige automáticamente al primer barrio activo */
export default function EncuestasIndexPage() {
  redirect('/encuestas/arroz-barato');
}
