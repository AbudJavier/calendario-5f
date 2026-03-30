import { useState } from 'react'
import { Timestamp } from 'firebase/firestore'
import { Save, X } from 'lucide-react'
import { TIPOS, MATERIAS } from '@/utils/constants'

const EMPTY = {
  titulo:      '',
  tipo:        'aviso',
  materia:     'General',
  fecha:       '',
  descripcion: '',
}

/**
 * Formulario para crear o editar un evento.
 * onSubmit recibe el objeto evento listo para Firestore.
 */
export default function EventoForm({ inicial = EMPTY, onSubmit, onCancel, loading }) {
  const [form, setForm] = useState({
    ...EMPTY,
    ...inicial,
    // Si viene un Date, lo convierte a string "YYYY-MM-DD"
    fecha: inicial.fecha
      ? (inicial.fecha instanceof Date
          ? inicial.fecha.toISOString().split('T')[0]
          : inicial.fecha)
      : '',
  })

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }))

  function handleSubmit(e) {
    e.preventDefault()
    if (!form.titulo.trim() || !form.fecha) return

    onSubmit({
      titulo:      form.titulo.trim(),
      tipo:        form.tipo,
      materia:     form.materia,
      fecha:       Timestamp.fromDate(new Date(form.fecha + 'T12:00:00')),
      descripcion: form.descripcion.trim(),
    })
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

      <div className="form-group">
        <label className="form-label">Título *</label>
        <input
          className="form-input"
          value={form.titulo}
          onChange={set('titulo')}
          placeholder="Ej: Prueba de Matemáticas — Fracciones"
          required
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        <div className="form-group">
          <label className="form-label">Tipo *</label>
          <select className="form-select" value={form.tipo} onChange={set('tipo')}>
            {Object.entries(TIPOS).map(([key, { label }]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Materia *</label>
          <select className="form-select" value={form.materia} onChange={set('materia')}>
            {MATERIAS.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Fecha *</label>
        <input
          className="form-input"
          type="date"
          value={form.fecha}
          onChange={set('fecha')}
          required
        />
      </div>

      <div className="form-group">
        <label className="form-label">Descripción</label>
        <textarea
          className="form-textarea"
          value={form.descripcion}
          onChange={set('descripcion')}
          placeholder="Detalles adicionales, temas a estudiar, material necesario…"
          rows={3}
        />
      </div>

      <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
        {onCancel && (
          <button type="button" className="btn btn-ghost" onClick={onCancel}>
            <X size={15} /> Cancelar
          </button>
        )}
        <button
          type="submit"
          className="btn btn-primary"
          disabled={loading || !form.titulo.trim() || !form.fecha}
        >
          <Save size={15} /> {loading ? 'Guardando…' : 'Guardar evento'}
        </button>
      </div>
    </form>
  )
}
