import { useState } from 'react'
import dayjs from 'dayjs'
import 'dayjs/locale/es'
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter'
import { Filter } from 'lucide-react'
import { useEventos } from '@/hooks/useEventos'
import CalendarioMes from '@/components/CalendarioMes'
import CalendarioDia from '@/components/CalendarioDia'
import EventoCard    from '@/components/EventoCard'
import { TIPOS, MATERIAS } from '@/utils/constants'

dayjs.locale('es')
dayjs.extend(isSameOrAfter)

export default function Calendario() {
  const { eventos, loading, error } = useEventos({ soloPublicados: true })

  const [mes,          setMes]          = useState(dayjs())
  const [diaSelec,     setDiaSelec]     = useState(null)
  const [eventoSelec,  setEventoSelec]  = useState(null)
  const [filtroTipo,   setFiltroTipo]   = useState('todos')
  const [filtroMateria,setFiltroMateria]= useState('Todas')
  const [showFiltros,  setShowFiltros]  = useState(false)

  function cambiarMes(delta) {
    setMes((m) => m.add(delta, 'month'))
  }

  const eventosFiltrados = eventos.filter((ev) => {
    if (filtroTipo    !== 'todos'  && ev.tipo    !== filtroTipo)    return false
    if (filtroMateria !== 'Todas' && ev.materia !== filtroMateria) return false
    return true
  })

  // Próximos eventos (hoy en adelante)
  const hoy = dayjs()
  const proximos = eventosFiltrados
    .filter((ev) => ev.fecha && dayjs(ev.fecha).isSameOrAfter(hoy, 'day'))
    .slice(0, 5)

  return (
    <div className="page-wrapper">
      {/* Header */}
      <header className="site-header">
        <a href="/" className="logo">
          📅 Calendario <span>5°F</span>
        </a>
        <div
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize:   '0.72rem',
            color:      'rgba(255,255,255,0.55)',
            textAlign:  'right',
          }}
        >
          Craighouse School<br />
          <span style={{ color: 'var(--gold)' }}>Santiago, Chile</span>
        </div>
      </header>

      <main className="main-content">
        {/* Barra de filtros */}
        <div
          style={{
            display:         'flex',
            alignItems:      'center',
            justifyContent:  'space-between',
            marginBottom:    '16px',
            flexWrap:        'wrap',
            gap:             '10px',
          }}
        >
          <button
            className="btn btn-ghost"
            onClick={() => setShowFiltros((f) => !f)}
            style={{ fontSize: '0.82rem' }}
          >
            <Filter size={15} /> Filtros
            {(filtroTipo !== 'todos' || filtroMateria !== 'Todas') && (
              <span
                style={{
                  background:   'var(--red)',
                  color:        '#fff',
                  borderRadius: '50%',
                  width:        '16px',
                  height:       '16px',
                  fontSize:     '0.65rem',
                  display:      'flex',
                  alignItems:   'center',
                  justifyContent: 'center',
                  fontFamily:   'var(--font-mono)',
                }}
              >
                !
              </span>
            )}
          </button>

          <button
            className="btn btn-ghost"
            onClick={() => setMes(dayjs())}
            style={{ fontSize: '0.82rem' }}
          >
            Hoy
          </button>
        </div>

        {/* Panel de filtros expandible */}
        {showFiltros && (
          <div
            className="card"
            style={{ marginBottom: '16px', display: 'flex', gap: '16px', flexWrap: 'wrap' }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', minWidth: '160px' }}>
              <label className="form-label">Tipo de evento</label>
              <select
                className="form-select"
                value={filtroTipo}
                onChange={(e) => setFiltroTipo(e.target.value)}
              >
                <option value="todos">Todos</option>
                {Object.entries(TIPOS).map(([key, { label }]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', minWidth: '160px' }}>
              <label className="form-label">Materia</label>
              <select
                className="form-select"
                value={filtroMateria}
                onChange={(e) => setFiltroMateria(e.target.value)}
              >
                <option value="Todas">Todas</option>
                {MATERIAS.map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-end' }}>
              <button
                className="btn btn-ghost"
                style={{ fontSize: '0.8rem' }}
                onClick={() => { setFiltroTipo('todos'); setFiltroMateria('Todas') }}
              >
                Limpiar filtros
              </button>
            </div>
          </div>
        )}

        {/* Estados de carga/error */}
        {loading && (
          <div className="empty-state">
            <p>Cargando calendario…</p>
          </div>
        )}

        {error && (
          <div
            className="card"
            style={{ borderLeft: '4px solid var(--red)', marginBottom: '16px', color: 'var(--red)' }}
          >
            Error al cargar eventos. Intenta recargar la página.
          </div>
        )}

        {!loading && !error && (
          <div
            style={{
              display:             'grid',
              gridTemplateColumns: '1fr',
              gap:                 '24px',
            }}
          >
            {/* Calendario mensual */}
            <div className="card">
              <CalendarioMes
                eventos={eventosFiltrados}
                mes={mes}
                onCambiarMes={cambiarMes}
                onDiaClick={(dia) => setDiaSelec(dia)}
                onEventoClick={(ev) => setEventoSelec(ev)}
              />
            </div>

            {/* Próximos eventos */}
            {proximos.length > 0 && (
              <div className="card">
                <h3
                  style={{
                    fontFamily:   'var(--font-title)',
                    color:        'var(--navy)',
                    marginBottom: '14px',
                    fontSize:     '1rem',
                  }}
                >
                  Próximos eventos
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {proximos.map((ev) => {
                    const tipo = TIPOS[ev.tipo] ?? TIPOS.aviso
                    return (
                      <button
                        key={ev.id}
                        onClick={() => setEventoSelec(ev)}
                        style={{
                          display:      'flex',
                          alignItems:   'center',
                          gap:          '12px',
                          background:   'none',
                          border:       'none',
                          borderRadius: '8px',
                          padding:      '8px 10px',
                          cursor:       'pointer',
                          textAlign:    'left',
                          width:        '100%',
                          transition:   'background 0.12s',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--bg)')}
                        onMouseLeave={(e) => (e.currentTarget.style.background = 'none')}
                      >
                        <div
                          style={{
                            width:        '40px',
                            height:       '40px',
                            borderRadius: '8px',
                            background:   tipo.bg,
                            display:      'flex',
                            alignItems:   'center',
                            justifyContent: 'center',
                            flexShrink:   0,
                            fontFamily:   'var(--font-mono)',
                            fontSize:     '0.7rem',
                            color:        tipo.color,
                            fontWeight:   600,
                          }}
                        >
                          {dayjs(ev.fecha).format('D\nMMM').split('\n').map((t, i) => (
                            <span key={i} style={{ display: 'block', lineHeight: 1.1, textAlign: 'center', textTransform: 'uppercase' }}>{t}</span>
                          ))}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--navy)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {ev.titulo}
                          </div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--gray)', fontFamily: 'var(--font-mono)' }}>
                            {ev.materia} · {tipo.label}
                          </div>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      <footer className="site-footer">
        powered by <strong>REMO</strong>
      </footer>

      {/* Modales */}
      {diaSelec && (
        <CalendarioDia
          dia={diaSelec}
          eventos={eventosFiltrados}
          onClose={() => setDiaSelec(null)}
          onEventoClick={(ev) => { setDiaSelec(null); setEventoSelec(ev) }}
        />
      )}

      {eventoSelec && (
        <EventoCard
          evento={eventoSelec}
          onClose={() => setEventoSelec(null)}
        />
      )}
    </div>
  )
}
