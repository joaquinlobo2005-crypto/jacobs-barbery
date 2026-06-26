import Image from 'next/image'
import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen bg-zinc-950 text-white">

      {/* NAVBAR */}
      <nav className="flex justify-between items-center px-8 py-5 border-b border-zinc-800">
        <Image src="/logo.png" alt="JacobsBarber" width={48} height={48} className="h-12 w-12 rounded-full object-cover" />
        <div className="flex gap-6 text-sm text-zinc-400">
          <Link href="/reservar" className="hover:text-red-500 transition">Reservar</Link>
          <Link href="/ver-turno" className="hover:text-red-500 transition">Ver turno</Link>
        </div>
      </nav>

      {/* HERO */}
      <section className="flex flex-col items-center justify-center text-center px-6 py-32 gap-6">
        <span className="text-red-500 text-sm uppercase tracking-widest">Aguilares, Tucumán</span>
        <h2 className="text-6xl font-black uppercase leading-tight">
  Tu mejor <br />
  <span className="text-red-500">corte</span> en Aguilares
</h2>
        <p className="text-zinc-400 text-lg max-w-md">
          Reservá tu turno online en segundos. Sin llamadas, sin esperas.
        </p>
        <Link href="/reservar"
          className="bg-red-500 text-black font-bold px-8 py-4 rounded-full text-lg hover:bg-yellow-300 transition mt-4">
          Agendar Turno →
        </Link>
      </section>

      {/* SERVICIOS */}
      <section className="px-8 py-16 bg-zinc-900">
        <h3 className="text-center text-2xl font-bold uppercase tracking-widest mb-10 text-red-500">Servicios</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {[
  { nombre: "Corte de cabello + Perfilado", precio: "$7.000" },
  { nombre: "Corte a domicilio", precio: "$8.000" },
].map((s) => (
  <div key={s.nombre} className="bg-zinc-800 rounded-2xl p-6 text-center border border-zinc-700 hover:border-red-500 transition">
    <p className="text-lg font-semibold">{s.nombre}</p>
    <p className="text-red-500 text-2xl font-bold mt-2">{s.precio}</p>
  </div>
))}
        </div>
      </section>

      {/* CONTACTO */}
      <section className="px-8 py-16 text-center">
        <h3 className="text-2xl font-bold uppercase tracking-widest mb-8 text-red-500">Contacto</h3>
        <div className="flex flex-col gap-3 text-zinc-400 text-lg">
          <p>📍 9 de Julio, Aguilares, Tucumán</p>
<p>📱 <a href="https://wa.me/543865391656" className="hover:text-red-500 transition">+54 9 3865 391656</a></p>
<p>📸 <a href="https://instagram.com/JacobsBarbery" className="hover:text-red-500 transition">@JacobsBarbery</a></p>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="text-center py-6 text-zinc-600 text-sm border-t border-zinc-800">
        © 2026 Mi Barbería. Todos los derechos reservados.
      </footer>

    </main>
  )
}