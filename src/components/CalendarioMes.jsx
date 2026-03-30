import dayjs from 'dayjs'
import 'dayjs/locale/es'
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import EventoPill from './EventoPill'
import { DIAS_SEMANA } from '@/utils/constants'

dayjs.locale('es')
dayjs.extend(isSameOrBefore)

/**
 * Grilla mensual. Semana inicia el lunes (estándar chileno).
 */
export default function CalendarioMes({ eventos, mes, onCambiarMes, onDiaClick, onEventoClick }) {
  const inicio    = mes.startOf('month')
  const fin       = mes.endOf('month')

  // Primer lunes antes/en el inicio del mes
  const primerDia = inicio.day() === 0
    ? inicio.subtract(6, 'day')
    : inicio.subtract(inicio.day() - 1, 'day')

  // Construir celdas (6 semanas máx)
  const celdas = []
  let cursor = primerDia
  while (cursor.isSameOrBefore(fin, 'day') || celdas.length % 7 !== 0 || celdas.length < 35) {
    celdas.push(cursor)
    cursor = cursor.add(1, 'day')
    if (celdas.length >= 42) break
  }

  const hoy = dayjs()

  function eventosDelDia(dia) {
    return eventos.filter((ev) => ev.fecha && dayjs(ev.fecha).isSame(dia, 'day'))
  }

  return (
    <div>
      {/* Navegación de mes */}
      <div
        style={{
          display:        'flex',
          alignItems:     'center',
          justifyContent: 'space-between',
          marginBottom:   '20px',
        }}
      >
        <button
          className="btn btn-ghost"
          onClick={() => onCambiarMes(-1)}
          style={{ padding: '6px 12px' }}
        >
          <ChevronLeft size={18} />
        </button>

        <h2
          style={{
            fontFamily:    'var(--font-title)',
            fontSize:      '1.4rem',
            color:         'var(--navy)',
            textTransform: 'capitalize',
          }}
        >
          {mes.format('MMMM YYYY')}
        </h2>

        <button
          className="btn btn-ghost"
          onClick={() => onCambiarMes(1)}
          style={{ padding: '6px 12px' }}
        >
          <ChevronRight size={18} />
        </button>
      </div>

      {/* Cabecera de días */}
      <div
        style={{
          display:             'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          gap:                 '4px',
          marginBottom:        '4px',
        }}
      >
        {DIAS_SEMANA.map((d) => (
          <div
            key={d}
            style={{
              textAlign:     'center',
              fontFamily:    'var(--font-mono)',
              fontSize:      '0.7rem',
              fontWeight:    600,
              color:         'var(--gray)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              padding:       '4px 0',
            }}
          >
            {d}
          </div>
        ))}
      </div>

      {/* Grid de días */}
      <div
        style={{
          display:             'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          gap:                 '4px',
        }}
      >
        {celdas.map((dia, i) => {
          const esMesActual = dia.month() === mes.month()
          const esHoy       = dia.isSame(hoy, 'day')
          const evsDia      = eventosDelDia(dia)

          return (
            <div
              key={i}
              onClick={() => esMesActual && onDiaClick?.(dia)}
              style={{
                minHeight:      '90px',
                background:     esHoy ? '#fff' : '#fff',
                borderRadius:   '12px',
                padding:        '8px',
                cursor:         esMesActual ? 'pointer' : 'default',
                opacity:        esMesActual ? 1 : 0.3,
                border:         esHoy ? '2px solid var(--red)' : '1.5px solid var(--gray-light)',
                boxShadow:      esHoy
                  ? '0 4px 16px rgba(200, 16, 46, 0.15)'
                  : '0 2px 8px rgba(15, 28, 63, 0.06)',
                transition:     'all 0.18s cubic-bezier(0.4, 0, 0.2, 1)',
                position:       'relative',
                backgroundColor: esHoy ? 'rgba(200, 16, 46, 0.02)' : '#fff',
              }}
              onMouseEnter={(e) => {
                if (esMesActual) {
                  e.currentTarget.style.borderColor = 'var(--gold)'
                  e.currentTarget.style.boxShadow = '0 6px 20px rgba(201, 168, 76, 0.12)'
                  e.currentTarget.style.backgroundColor = 'rgba(201, 168, 76, 0.03)'
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = esHoy ? 'var(--red)' : 'var(--gray-light)'
                e.currentTarget.style.boxShadow = esHoy
                  ? '0 4px 16px rgba(200, 16, 46, 0.15)'
                  : '0 2px 8px rgba(15, 28, 63, 0.06)'
                e.currentTarget.style.backgroundColor = esHoy ? 'rgba(200, 16, 46, 0.02)' : '#fff'
              }}
            >
              {/* Número del día */}
              <div
                style={{
                  fontFamily:     'var(--font-mono)',
                  fontSize:       '0.78rem',
                  fontWeight:     esHoy ? 700 : 500,
                  marginBottom:   '6px',
                  width:          '28px',
                  height:         '28px',
                  display:        'flex',
                  alignItems:     'center',
                  justifyContent: 'center',
                  borderRadius:   '8px',
                  background:     esHoy ? 'linear-gradient(135deg, var(--red), #a6081f)' : 'transparent',
                  color:          esHoy ? '#fff' : (esMesActual ? 'var(--navy)' : 'var(--gray)'),
                  transition:     'all 0.18s',
                }}
              >
                {dia.date()}
              </div>

              {/* Pastillas de eventos */}
              {evsDia.slice(0, 3).map((ev) => (
                <EventoPill
                  key={ev.id}
                  evento={ev}
                  onClick={onEventoClick}
                />
              ))}
              {evsDia.length > 3 && (
                <div
                  style={{
                    fontSize:   '0.65rem',
                    color:      'var(--gray)',
                    fontFamily: 'var(--font-mono)',
                    padding:    '1px 4px',
                  }}
                >
                  +{evsDia.length - 3} más
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
