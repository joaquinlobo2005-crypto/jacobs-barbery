'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { supabase } from '../../lib/supabase'

export default function Reservar() {
  const [paso, setPaso] = useState(1)
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState('')
  const [horariosOcupados, setHorariosOcupados] = useState<string[]>([])
  const [form, setForm] = useState({
    nombre: '', telefono: '', servicio: '', fecha: '', hora: ''
  })

  const horarios = ['09:00', '10:00', '11:00', '12:00', '14:00', '15:00', '16:00', '17:00', '18:00']

  const cargarHorariosOcupados = async (fecha: string) => {
    if (!fecha) return
    const { data } = await supabase
      .from('turnos')
      .select('hora')
      .eq('fecha', fecha)
      .neq('estado', 'cancelado')
    setHorariosOcupados(data?.map((t: any) => t.hora) || [])
  }

  useEffect(() => {
    if (form.fecha) cargarHorariosOcupados(form.fecha)
  }, [form.fecha])

  const confirmarTurno = async () => {
    setCargando(true)
    setError('')
    const { error: err } = await supabase
      .from('turnos')
      .insert([{ ...form, estado: 'pendiente' }])
    if (err) {
      setError('Hubo un error al guardar. Intentá de nuevo.')
    } else {
      setPaso(4)
    }
    setCargando(false)
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <nav className="flex justify-between items-center px-8 py-5 border-b border-zinc-800">
        <Link href="/">
          <img src="/logo.png" alt="JacobsBarber" className="h-12 w-12 rounded-full object-cover" />
        </Link>
      </nav>

      <section className="max-w-md mx-auto px-6 py-16">
        <h2 className="text-3xl font-black uppercase mb-2">Reservar <span className="text-red-500">Turno</span></h2>
        <p className="text-zinc-400 mb-8">Completá los datos para agendar</p>

        {paso === 1 && (
          <div className="flex flex-col gap-4">
            <input
              placeholder="Tu nombre"
              className="bg-zinc-800 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-red-500"
              value={form.nombre}
              onChange={e => setForm({...form, nombre: e.target.value})}
            />
            <input
              placeholder="Tu teléfono (WhatsApp)"
              className="bg-zinc-800 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-red-500"
              value={form.telefono}
              onChange={e => setForm({...form, telefono: e.target.value})}
            />
            <button
              onClick={() => form.nombre && form.telefono && setPaso(2)}
              className="bg-red-500 text-white font-bold py-3 rounded-xl hover:bg-red-400 transition mt-2">
              Siguiente →
            </button>
          </div>
        )}

        {paso === 2 && (
          <div className="flex flex-col gap-4">
            {['Corte de cabello + Perfilado - $7.000', 'Corte a domicilio - $8.000'].map(s => (
              <button key={s}
                onClick={() => { setForm({...form, servicio: s}); setPaso(3) }}
                className="p-4 rounded-xl border border-zinc-700 bg-zinc-800 hover:border-red-500 text-left transition">
                {s}
              </button>
            ))}
            <button onClick={() => setPaso(1)} className="text-zinc-500 hover:text-white transition text-sm">← Volver</button>
          </div>
        )}

        {paso === 3 && (
          <div className="flex flex-col gap-4">
            <input
               type="date"
                min={new Date().toISOString().split('T')[0]}
                className="bg-zinc-800 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-red-500"
                value={form.fecha}
                onChange={e => {
        setForm({...form, fecha: e.target.value, hora: ''})
  }}
/>

            {form.fecha && (
              <div className="grid grid-cols-3 gap-2">
                {horarios.map(h => {
                  const ocupado = horariosOcupados.includes(h)
                  const seleccionado = form.hora === h
                  return (
                    <button key={h}
                      onClick={() => !ocupado && setForm({...form, hora: h})}
                      disabled={ocupado}
                      className={`py-2 rounded-xl border text-sm transition
                        ${ocupado ? 'border-zinc-700 bg-zinc-900 text-zinc-600 cursor-not-allowed line-through' : ''}
                        ${seleccionado ? 'border-red-500 bg-red-500 text-white' : ''}
                        ${!ocupado && !seleccionado ? 'border-zinc-700 bg-zinc-800 hover:border-red-500' : ''}
                      `}>
                      {ocupado ? `${h} ✗` : h}
                    </button>
                  )
                })}
              </div>
            )}

            {error && <p className="text-red-400 text-sm">{error}</p>}

            <button
              onClick={() => form.fecha && form.hora && confirmarTurno()}
              disabled={cargando || !form.hora}
              className="bg-red-500 text-white font-bold py-3 rounded-xl hover:bg-red-400 transition mt-2 disabled:opacity-50">
              {cargando ? 'Guardando...' : 'Confirmar →'}
            </button>
            <button onClick={() => setPaso(2)} className="text-zinc-500 hover:text-white transition text-sm">← Volver</button>
          </div>
        )}

        {paso === 4 && (
          <div className="bg-zinc-800 rounded-2xl p-6 flex flex-col gap-3">
            <h3 className="text-xl font-bold text-red-500">¡Turno confirmado! ✅</h3>
            <p><span className="text-zinc-400">Nombre:</span> {form.nombre}</p>
            <p><span className="text-zinc-400">Teléfono:</span> {form.telefono}</p>
            <p><span className="text-zinc-400">Servicio:</span> {form.servicio}</p>
            <p><span className="text-zinc-400">Fecha:</span> {form.fecha}</p>
            <p><span className="text-zinc-400">Hora:</span> {form.hora}</p>
            <Link href="/" className="bg-red-500 text-white font-bold py-3 rounded-xl text-center hover:bg-red-400 transition mt-2">
              Volver al inicio
            </Link>
          </div>
        )}
      </section>
    </main>
  )
}