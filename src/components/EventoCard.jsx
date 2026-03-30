import dayjs from 'dayjs'
import 'dayjs/locale/es'
import { X, Calendar, BookOpen, Tag } from 'lucide-react'
import { TIPOS } from '@/utils/constants'

dayjs.locale('es')

/**
 * Modal/panel de detalle completo de un evento.
 * Se muestra al hacer clic en una pastilla o en un día.
 */
export default function EventoCard({ evento, onClose }) {
  if (!evento) return null

  const tipo    = TIPOS[evento.tipo] ?? TIPOS.aviso
  const fecha   = evento.fecha ? dayjs(evento.fecha) : null

  return (
    <div
      style={{
        position:   'fixed',
        inset:      0,
        background: 'rgba(15,28,63,0.45)',
        zIndex:     200,
        display:    'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding:    '16px',
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background:   '#fff',
          borderRadius: 'var(--radius-card)',
          boxShadow:    'var(--shadow-md)',
          width:        '100%',
          maxWidth:     '480px',
          overflow:     'hidden',
        }}
      >
        {/* Header con color de tipo */}
        <div
          style={{
            background:  tipo.color,
            padding:     '20px 24px 16px',
            position:    'relative',
          }}
        >
          <button
            onClick={onClose}
            style={{
              position:   'absolute',
              top:        '14px',
              right:      '14px',
              background: 'rgba(255,255,255,0.25)',
              border:     'none',
              borderRadius: '50%',
              width:      '30px',
              height:     '30px',
              cursor:     'pointer',
              display:    'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color:      '#fff',
            }}
          >
            <X size={16} />
          </button>

          <span
            style={{
              display:       'inline-block',
              background:    'rgba(255,255,255,0.22)',
              color:         '#fff',
              fontFamily:    'var(--font-mono)',
              fontSize:      '0.68rem',
              padding:       '2px 10px',
              borderRadius:  '100px',
              marginBottom:  '8px',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
            }}
          >
            {tipo.label}
          </span>

          <h2
            style={{
              fontFamily: 'var(--font-title)',
              color:      '#fff',
              fontSize:   '1.25rem',
              lineHeight: 1.3,
            }}
          >
            {evento.titulo}
          </h2>
        </div>

        {/* Body */}
        <div style={{ padding: '20px 24px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>

            {fecha && (
              <MetaRow icon={<Calendar size={16} />} label="Fecha">
                {fecha.format('dddd D [de] MMMM [de] YYYY')}
              </MetaRow>
            )}

            {evento.materia && (
              <MetaRow icon={<BookOpen size={16} />} label="Materia">
                {evento.materia}
              </MetaRow>
            )}

            {evento.tipo && (
              <MetaRow icon={<Tag size={16} />} label="Tipo">
                {tipo.label}
              </MetaRow>
            )}

            {evento.descripcion && (
              <>
                <div style={{ height: '1px', background: 'var(--gray-light)' }} />
                <p
                  style={{
                    fontSize:   '0.925rem',
                    color:      'var(--navy)',
                    lineHeight: 1.6,
                    whiteSpace: 'pre-wrap',
                  }}
                >
                  {evento.descripcion}
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function MetaRow({ icon, label, children }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
      <span style={{ color: 'var(--gray)', marginTop: '2px', flexShrink: 0 }}>{icon}</span>
      <div>
        <div style={{ fontSize: '0.7rem', fontFamily: 'var(--font-mono)', color: 'var(--gray)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          {label}
        </div>
        <div style={{ fontSize: '0.9rem', color: 'var(--navy)', fontWeight: 500, textTransform: 'capitalize' }}>
          {children}
        </div>
      </div>
    </div>
  )
}
