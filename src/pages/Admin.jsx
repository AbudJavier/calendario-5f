import { useState } from 'react'
import { signOut } from 'firebase/auth'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { LogOut, Clock, CheckCircle, PlusCircle, Edit2, Trash2, X } from 'lucide-react'
import { auth } from '@/firebase'
import { useEventos } from '@/hooks/useEventos'
import PendienteCard from '@/components/PendienteCard'
import EventoForm    from '@/components/EventoForm'
import { TIPOS }     from '@/utils/constants'
import dayjs from 'dayjs'
import 'dayjs/locale/es'

dayjs.locale('es')

const TABS = [
  { id: 'pendientes', label: 'Pendientes', icon: <Clock size={15} /> },
  { id: 'publicados', label: 'Publicados',  icon: <CheckCircle size={15} /> },
  { id: 'nuevo',      label: 'Nuevo evento',icon: <PlusCircle size={15} /> },
]

export default function Admin() {
  const navigate  = useNavigate()
  const { eventos, loading, crearEvento, actualizarEvento, eliminarEvento, aprobarEvento, rechazarEvento } =
    useEventos({ soloPublicados: false })

  const [tab,         setTab]         = useState('pendientes')
  const [saving,      setSaving]      = useState(false)
  const [editEvento,  setEditEvento]  = useState(null)   // evento en edición
  const [confirmDel,  setConfirmDel]  = useState(null)   // id a eliminar

  const pendientes = eventos.filter((e) => e.estado === 'pendiente')
  const publicados = eventos.filter((e) => e.estado === 'publicado')

  async function handleLogout() {
    await signOut(auth)
    navigate('/login')
  }

  async function handleAprobar(id) {
    try {
      await aprobarEvento(id)
      toast.success('Evento aprobado ✓')
    } catch {
      toast.error('Error al aprobar')
    }
  }

  async function handleRechazar(id) {
    try {
      await rechazarEvento(id)
      toast.success('Evento rechazado')
    } catch {
      toast.error('Error al rechazar')
    }
  }

  async function handleCrear(datos) {
    setSaving(true)
    try {
      await crearEvento(datos)
      toast.success('Evento creado y publicado ✓')
      setTab('publicados')
    } catch {
      toast.error('Error al guardar')
    } finally {
      setSaving(false)
    }
  }

  async function handleEditar(datos) {
    if (!editEvento) return
    setSaving(true)
    try {
      await actualizarEvento(editEvento.id, datos)
      toast.success('Evento actualizado ✓')
      setEditEvento(null)
    } catch {
      toast.error('Error al actualizar')
    } finally {
      setSaving(false)
    }
  }

  async function handleEliminar(id) {
    try {
      await eliminarEvento(id)
      toast.success('Evento eliminado')
      setConfirmDel(null)
    } catch {
      toast.error('Error al eliminar')
    }
  }

  return (
    <div className="page-wrapper">
      {/* Header admin */}
      <header className="site-header">
        <a href="/" className="logo">
          📅 Calendario <span>5°F</span>
          <span
            style={{
              background:   'rgba(201,168,76,0.2)',
              color:        'var(--gold)',
              fontFamily:   'var(--font-mono)',
              fontSize:     '0.65rem',
              padding:      '2px 8px',
              borderRadius: '100px',
              marginLeft:   '6px',
            }}
          >
            ADMIN
          </span>
        </a>

        <button
          className="btn btn-ghost"
          onClick={handleLogout}
          style={{ color: '#fff', borderColor: 'rgba(255,255,255,0.25)', fontSize: '0.82rem' }}
        >
          <LogOut size={14} /> Salir
        </button>
      </header>

      <main className="main-content">
        {/* Tabs */}
        <div
          style={{
            display:       'flex',
            gap:           '6px',
            marginBottom:  '20px',
            background:    '#fff',
            borderRadius:  'var(--radius-card)',
            padding:       '6px',
            boxShadow:     'var(--shadow)',
          }}
        >
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              style={{
                flex:         1,
                display:      'flex',
                alignItems:   'center',
                justifyContent: 'center',
                gap:          '6px',
                padding:      '9px 12px',
                borderRadius: '10px',
                border:       'none',
                cursor:       'pointer',
                fontFamily:   'var(--font-body)',
                fontWeight:   500,
                fontSize:     '0.85rem',
                transition:   'all 0.15s',
                background:   tab === t.id ? 'var(--navy)' : 'transparent',
                color:        tab === t.id ? '#fff' : 'var(--gray)',
              }}
            >
              {t.icon}
              <span>{t.label}</span>
              {t.id === 'pendientes' && pendientes.length > 0 && (
                <span
                  style={{
                    background:   'var(--red)',
                    color:        '#fff',
                    borderRadius: '100px',
                    minWidth:     '18px',
                    height:       '18px',
                    fontSize:     '0.65rem',
                    fontFamily:   'var(--font-mono)',
                    display:      'flex',
                    alignItems:   'center',
                    justifyContent: 'center',
                    padding:      '0 5px',
                  }}
                >
                  {pendientes.length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* ── TAB: PENDIENTES ── */}
        {tab === 'pendientes' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {loading && <div className="empty-state"><p>Cargando…</p></div>}
            {!loading && pendientes.length === 0 && (
              <div className="empty-state card">
                <Clock size={40} />
                <p>No hay eventos pendientes de aprobación</p>
              </div>
            )}
            {pendientes.map((ev) => (
              <PendienteCard
                key={ev.id}
                evento={ev}
                onAprobar={handleAprobar}
                onRechazar={handleRechazar}
              />
            ))}
          </div>
        )}

        {/* ── TAB: PUBLICADOS ── */}
        {tab === 'publicados' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {loading && <div className="empty-state"><p>Cargando…</p></div>}
            {!loading && publicados.length === 0 && (
              <div className="empty-state card">
                <CheckCircle size={40} />
                <p>No hay eventos publicados aún</p>
              </div>
            )}
            {publicados.map((ev) => {
              const tipo  = TIPOS[ev.tipo] ?? TIPOS.aviso
              const fecha = ev.fecha ? dayjs(ev.fecha) : null
              return (
                <div
                  key={ev.id}
                  style={{
                    background:   '#fff',
                    borderRadius: 'var(--radius-card)',
                    borderLeft:   `4px solid ${tipo.color}`,
                    boxShadow:    'var(--shadow)',
                    padding:      '14px 16px',
                    display:      'flex',
                    alignItems:   'center',
                    gap:          '12px',
                  }}
                >
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '3px' }}>
                      <span className={`badge badge-${ev.tipo}`}>{tipo.label}</span>
                      {fecha && (
                        <span style={{ fontSize: '0.75rem', color: 'var(--gray)', fontFamily: 'var(--font-mono)' }}>
                          {fecha.format('D MMM YYYY')}
                        </span>
                      )}
                    </div>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--navy)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {ev.titulo}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--gray)', fontFamily: 'var(--font-mono)' }}>
                      {ev.materia}
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
                    <button
                      className="btn btn-ghost"
                      style={{ padding: '6px 10px' }}
                      onClick={() => setEditEvento(ev)}
                      title="Editar"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      className="btn btn-danger"
                      style={{ padding: '6px 10px' }}
                      onClick={() => setConfirmDel(ev.id)}
                      title="Eliminar"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* ── TAB: NUEVO EVENTO ── */}
        {tab === 'nuevo' && (
          <div className="card">
            <h3 style={{ fontFamily: 'var(--font-title)', marginBottom: '20px', color: 'var(--navy)' }}>
              Crear nuevo evento
            </h3>
            <EventoForm
              onSubmit={handleCrear}
              loading={saving}
            />
          </div>
        )}
      </main>

      <footer className="site-footer">
        powered by <strong>REMO</strong>
      </footer>

      {/* Modal editar evento */}
      {editEvento && (
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
          onClick={() => setEditEvento(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background:   '#fff',
              borderRadius: 'var(--radius-card)',
              boxShadow:    'var(--shadow-md)',
              width:        '100%',
              maxWidth:     '500px',
              padding:      '28px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h3 style={{ fontFamily: 'var(--font-title)', color: 'var(--navy)' }}>Editar evento</h3>
              <button
                onClick={() => setEditEvento(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--gray)' }}
              >
                <X size={18} />
              </button>
            </div>
            <EventoForm
              inicial={editEvento}
              onSubmit={handleEditar}
              onCancel={() => setEditEvento(null)}
              loading={saving}
            />
          </div>
        </div>
      )}

      {/* Modal confirmar eliminación */}
      {confirmDel && (
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
          onClick={() => setConfirmDel(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background:   '#fff',
              borderRadius: 'var(--radius-card)',
              boxShadow:    'var(--shadow-md)',
              padding:      '28px',
              maxWidth:     '380px',
              width:        '100%',
              textAlign:    'center',
            }}
          >
            <div style={{ fontSize: '2rem', marginBottom: '12px' }}>🗑️</div>
            <h3 style={{ fontFamily: 'var(--font-title)', color: 'var(--navy)', marginBottom: '8px' }}>
              ¿Eliminar evento?
            </h3>
            <p style={{ color: 'var(--gray)', fontSize: '0.875rem', marginBottom: '20px' }}>
              Esta acción no se puede deshacer.
            </p>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
              <button className="btn btn-ghost" onClick={() => setConfirmDel(null)}>
                Cancelar
              </button>
              <button className="btn btn-danger" onClick={() => handleEliminar(confirmDel)}>
                <Trash2 size={14} /> Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
