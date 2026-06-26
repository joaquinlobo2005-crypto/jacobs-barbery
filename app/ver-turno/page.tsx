'use client'
import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { supabase } from '../../lib/supabase'

interface Turno {
  id: number
  nombre: string
  telefono: string
  servicio: string
  fecha: string
  hora: string
  estado: string
}

export default function VerTurno() {
  const [telefono, setTelefono] = useState('')
  const [turnos, setTurnos] = useState<Turno[]>([])
  const [buscado, setBuscado] = useState(false)
  const [cargando, setCargando] = useState(false)

  const buscar = async () => {
    setCargando(true)
    const { data } = await supabase
      .from('turnos')
      .select('*')
      .eq('telefono', telefono)
      .order('fecha')
      .order('hora')
    setTurnos(data || [])
    setBuscado(true)
    setCargando(false)
  }

  const cancelar = async (id: number) => {
    await supabase.from('turnos').update({ estado: 'cancelado' }).eq('id', id)
    buscar()
  }

  const estadoColor = (estado: string) => {
    if (estado === 'confirmado') return 'text-green-400'
    if (estado === 'cancelado') return 'text-red-400'
    return 'text-yellow-400'
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <nav className="flex justify-between items-center px-8 py-5 border-b border-zinc-800">
        <Link href="/">
          <Image src="/logo.png" alt="JacobsBarber" width={48} height={48} className="h-12 w-12 rounded-full object-cover" />
        </Link>
      </nav>

      <section className="max-w-md mx-auto px-6 py-16">
        <h2 className="text-3xl font-black uppercase mb-2">Ver <span className="text-red-500">Turno</span></h2>
        <p className="text-zinc-400 mb-8">Ingresá tu número para ver tus turnos</p>

        <div className="flex gap-3 mb-8">
          <input
            placeholder="Tu teléfono (WhatsApp)"
            className="bg-zinc-800 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-red-500 flex-1"
            value={telefono}
            onChange={e => setTelefono(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && buscar()}
          />
          <button
            onClick={buscar}
            disabled={cargando || !telefono}
            className="bg-red-500 text-white font-bold px-5 rounded-xl hover:bg-red-400 transition disabled:opacity-50">
            {cargando ? '...' : 'Buscar'}
          </button>
        </div>

        {buscado && turnos.length === 0 && (
          <p className="text-zinc-400">No se encontraron turnos para ese número.</p>
        )}

        {turnos.length > 0 && (
          <div className="flex flex-col gap-4">
            {turnos.map(t => (
              <div key={t.id} className="bg-zinc-800 rounded-2xl p-5 border border-zinc-700 flex flex-col gap-3">
                <div className="flex flex-col gap-1">
                  <p className="font-bold text-lg">{t.nombre}</p>
                  <p className="text-zinc-400 text-sm">✂️ {t.servicio}</p>
                  <p className="text-zinc-400 text-sm">📅 {t.fecha} — 🕐 {t.hora}</p>
                  <p className={`text-sm font-semibold ${estadoColor(t.estado)}`}>● {t.estado}</p>
                </div>
                {t.estado === 'pendiente' && (
                  <button
                    onClick={() => cancelar(t.id)}
                    className="bg-zinc-700 hover:bg-zinc-600 text-white text-sm px-4 py-2 rounded-xl transition w-fit">
                    Cancelar turno
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        <Link href="/reservar" className="block text-center mt-10 text-zinc-500 hover:text-white transition text-sm">
          + Reservar nuevo turno
        </Link>
      </section>
    </main>
  )
}