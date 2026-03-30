import { TIPOS } from '@/utils/constants'

/**
 * Pastilla de evento que aparece dentro de una celda del calendario mensual.
 */
export default function EventoPill({ evento, onClick }) {
  const tipo   = TIPOS[evento.tipo] ?? TIPOS.aviso
  const titulo = evento.titulo?.length > 22
    ? evento.titulo.slice(0, 22) + '…'
    : evento.titulo

  return (
    <button
      onClick={(e) => { e.stopPropagation(); onClick?.(evento) }}
      title={evento.titulo}
      style={{
        display:         'block',
        width:           '100%',
        textAlign:       'left',
        padding:         '2px 6px',
        marginBottom:    '2px',
        borderRadius:    '4px',
        background:      tipo.bg,
        borderLeft:      `3px solid ${tipo.color}`,
        color:           tipo.color,
        fontSize:        '0.7rem',
        fontFamily:      'var(--font-mono)',
        fontWeight:      500,
        cursor:          'pointer',
        border:          'none',
        whiteSpace:      'nowrap',
        overflow:        'hidden',
        textOverflow:    'ellipsis',
        lineHeight:      1.4,
        transition:      'opacity 0.12s',
      }}
      onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.8')}
      onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
    >
      {titulo}
    </button>
  )
}
