import dayjs from 'dayjs'
import 'dayjs/locale/es'
import { X } from 'lucide-react'
import { TIPOS } from '@/utils/constants'

dayjs.locale('es')

/**
 * Panel lateral / modal con los eventos de un día seleccionado.
 */
export default function CalendarioDia({ dia, eventos, onClose, onEventoClick }) {
  if (!dia) return null

  const evsDia = eventos.filter((ev) => ev.fecha && dayjs(ev.fecha).isSame(dia, 'day'))

  return (
    <div
      style={{
        position:   'fixed',
        inset:      0,
        background: 'rgba(15,28,63,0.40)',
        zIndex:     150,
        display:    'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background:      '#fff',
          borderRadius:    '20px 20px 0 0',
          width:           '100%',
          maxWidth:        '520px',
          maxHeight:       '70vh',
          overflowY:       'auto',
          padding:         '24px',
          boxShadow:       '0 -8px 40px rgba(0,0,0,0.15)',
        }}
      >
        {/* Handle */}
        <div
          style={{
            width:        '40px',
            height:       '4px',
            background:   'var(--gray-light)',
            borderRadius: '2px',
            margin:       '0 auto 20px',
          }}
        />

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <h3
            style={{
              fontFamily:    'var(--font-title)',
              fontSize:      '1.15rem',
              color:         'var(--navy)',
              textTransform: 'capitalize',
            }}
          >
            {dia.format('dddd D [de] MMMM')}
          </h3>
          <button
            onClick={onClose}
            style={{
              background:    'var(--gray-light)',
              border:        'none',
              borderRadius:  '50%',
              width:         '30px',
              height:        '30px',
              cursor:        'pointer',
              display:       'flex',
              alignItems:    'center',
              justifyContent:'center',
              color:         'var(--gray)',
            }}
          >
            <X size={15} />
          </button>
        </div>

        {evsDia.length === 0 ? (
          <div className="empty-state" style={{ padding: '32px 0' }}>
            <p>No hay eventos para este día</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {evsDia.map((ev) => {
              const tipo = TIPOS[ev.tipo] ?? TIPOS.aviso
              return (
                <button
                  key={ev.id}
                  onClick={() => { onClose(); onEventoClick?.(ev) }}
                  style={{
                    display:      'block',
                    textAlign:    'left',
                    width:        '100%',
                    background:   '#fff',
                    border:       'none',
                    borderRadius: '10px',
                    borderLeft:   `4px solid ${tipo.color}`,
                    padding:      '12px 14px',
                    cursor:       'pointer',
                    boxShadow:    'var(--shadow)',
                    transition:   'box-shadow 0.15s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.boxShadow = 'var(--shadow-md)')}
                  onMouseLeave={(e) => (e.currentTarget.style.boxShadow = 'var(--shadow)')}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <span className={`badge badge-${ev.tipo}`}>{tipo.label}</span>
                    {ev.materia && ev.materia !== 'General' && (
                      <span
                        style={{
                          fontSize:   '0.72rem',
                          color:      'var(--gray)',
                          fontFamily: 'var(--font-mono)',
                        }}
                      >
                        {ev.materia}
                      </span>
                    )}
                  </div>
                  <div
                    style={{
                      fontWeight:  600,
                      color:       'var(--navy)',
                      fontSize:    '0.925rem',
                    }}
                  >
                    {ev.titulo}
                  </div>
                  {ev.descripcion && (
                    <div
                      style={{
                        fontSize:   '0.82rem',
                        color:      'var(--gray)',
                        marginTop:  '4px',
                        lineHeight: 1.4,
                      }}
                    >
                      {ev.descripcion.length > 80
                        ? ev.descripcion.slice(0, 80) + '…'
                        : ev.descripcion}
                    </div>
                  )}
                </button>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
