'use client'
import { useEffect, useState } from 'react'
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

export default function Admin() {
  const [turnos, setTurnos] = useState<Turno[]>([])
  const [cargando, setCargando] = useState(true)
  const [filtroFecha, setFiltroFecha] = useState('')

  const cargarTurnos = async () => {
    setCargando(true)
    let query = supabase.from('turnos').select('*').order('fecha').order('hora')
    if (filtroFecha) query = query.eq('fecha', filtroFecha)
    const { data } = await query
    setTurnos(data || [])
    setCargando(false)
  }

  useEffect(() => { cargarTurnos() }, [filtroFecha])

  const cambiarEstado = async (id: number, estado: string) => {
    await supabase.from('turnos').update({ estado }).eq('id', id)
    cargarTurnos()
  }

  const eliminar = async (id: number) => {
    await supabase.from('turnos').delete().eq('id', id)
    cargarTurnos()
  }

  const estadoColor = (estado: string) => {
    if (estado === 'confirmado') return 'text-green-400'
    if (estado === 'cancelado') return 'text-red-400'
    return 'text-yellow-400'
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-black uppercase mb-2">Panel <span className="text-red-500">Admin</span></h1>
        <p className="text-zinc-400 mb-8">Gestión de turnos — JacobsBarber</p>

        <div className="flex gap-4 mb-8 items-center">
          <input
            type="date"
            className="bg-zinc-800 rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-red-500"
            value={filtroFecha}
            onChange={e => setFiltroFecha(e.target.value)}
          />
          <button onClick={() => setFiltroFecha('')} className="text-zinc-400 hover:text-white text-sm transition">
            Ver todos
          </button>
          <span className="text-zinc-500 text-sm">{turnos.length} turno(s)</span>
        </div>

        {cargando ? (
          <p className="text-zinc-400">Cargando...</p>
        ) : turnos.length === 0 ? (
          <p className="text-zinc-400">No hay turnos.</p>
        ) : (
          <div className="flex flex-col gap-4">
            {turnos.map((t) => (
              <div key={t.id} className="bg-zinc-800 rounded-2xl p-5 border border-zinc-700 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex flex-col gap-1">
                  <p className="font-bold text-lg">{t.nombre}</p>
                  <p className="text-zinc-400 text-sm">📱 {t.telefono}</p>
                  <p className="text-zinc-400 text-sm">✂️ {t.servicio}</p>
                  <p className="text-zinc-400 text-sm">📅 {t.fecha} — 🕐 {t.hora}</p>
                  <p className={`text-sm font-semibold ${estadoColor(t.estado)}`}>● {t.estado}</p>
                </div>
                <div className="flex gap-2 flex-wrap">
                  <button onClick={() => cambiarEstado(t.id, 'confirmado')}
                    className="bg-green-600 hover:bg-green-500 text-white text-sm px-3 py-2 rounded-xl transition">
                    ✅ Confirmar
                  </button>
                  <button onClick={() => cambiarEstado(t.id, 'cancelado')}
                    className="bg-zinc-600 hover:bg-zinc-500 text-white text-sm px-3 py-2 rounded-xl transition">
                    ❌ Cancelar
                  </button>
                  <button onClick={() => eliminar(t.id)}
                    className="bg-red-700 hover:bg-red-600 text-white text-sm px-3 py-2 rounded-xl transition">
                    🗑️ Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}