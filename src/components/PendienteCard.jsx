import dayjs from 'dayjs'
import 'dayjs/locale/es'
import { Check, X, Calendar, BookOpen } from 'lucide-react'
import { TIPOS } from '@/utils/constants'

dayjs.locale('es')

/**
 * Card de evento pendiente en el panel de admin.
 * Muestra botones de Aprobar / Rechazar.
 */
export default function PendienteCard({ evento, onAprobar, onRechazar }) {
  const tipo  = TIPOS[evento.tipo] ?? TIPOS.aviso
  const fecha = evento.fecha ? dayjs(evento.fecha) : null

  return (
    <div
      style={{
        background:   '#fff',
        borderRadius: 'var(--radius-card)',
        boxShadow:    'var(--shadow)',
        borderLeft:   `4px solid ${tipo.color}`,
        padding:      '16px 20px',
        display:      'flex',
        flexDirection:'column',
        gap:          '10px',
      }}
    >
      {/* Top row */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '10px' }}>
        <div style={{ flex: 1 }}>
          <span
            className={`badge badge-${evento.tipo}`}
            style={{ marginBottom: '6px' }}
          >
            {tipo.label}
          </span>
          <h3
            style={{
              fontFamily: 'var(--font-title)',
              fontSize:   '1rem',
              color:      'var(--navy)',
              lineHeight: 1.3,
            }}
          >
            {evento.titulo}
          </h3>
        </div>
      </div>

      {/* Meta */}
      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
        {fecha && (
          <MetaBit icon={<Calendar size={13} />}>
            {fecha.format('D MMM YYYY')}
          </MetaBit>
        )}
        {evento.materia && (
          <MetaBit icon={<BookOpen size={13} />}>
            {evento.materia}
          </MetaBit>
        )}
        {evento.origen === 'email' && (
          <MetaBit>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--blue)' }}>
              📧 email
            </span>
          </MetaBit>
        )}
      </div>

      {evento.descripcion && (
        <p style={{ fontSize: '0.85rem', color: 'var(--gray)', lineHeight: 1.5 }}>
          {evento.descripcion.length > 120
            ? evento.descripcion.slice(0, 120) + '…'
            : evento.descripcion}
        </p>
      )}

      {/* Actions */}
      <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
        <button
          className="btn btn-success"
          onClick={() => onAprobar(evento.id)}
          style={{ fontSize: '0.82rem', padding: '6px 16px' }}
        >
          <Check size={14} /> Aprobar
        </button>
        <button
          className="btn btn-danger"
          onClick={() => onRechazar(evento.id)}
          style={{ fontSize: '0.82rem', padding: '6px 16px' }}
        >
          <X size={14} /> Rechazar
        </button>
      </div>
    </div>
  )
}

function MetaBit({ icon, children }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', color: 'var(--gray)' }}>
      {icon}
      {children}
    </div>
  )
}
