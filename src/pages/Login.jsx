import { useState } from 'react'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { useNavigate } from 'react-router-dom'
import { auth } from '@/firebase'
import { Lock, Mail, LogIn } from 'lucide-react'

export default function Login() {
  const navigate   = useNavigate()
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      await signInWithEmailAndPassword(auth, email, password)
      navigate('/admin')
    } catch (err) {
      console.error('Firebase Auth Error:', err.code, err.message)
      const mensajes = {
        'auth/user-not-found':    'No existe un usuario con ese email.',
        'auth/wrong-password':    'Contraseña incorrecta.',
        'auth/invalid-credential':'Email o contraseña incorrectos.',
        'auth/invalid-email':     'Email inválido.',
        'auth/user-disabled':     'Esta cuenta está deshabilitada.',
        'auth/too-many-requests': 'Demasiados intentos. Espera un momento.',
      }
      setError(mensajes[err.code] || `Error: ${err.code} — ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      style={{
        minHeight:      '100vh',
        background:     'linear-gradient(135deg, var(--navy), var(--navy-mid))',
        display:        'flex',
        alignItems:     'center',
        justifyContent: 'center',
        padding:        '24px',
      }}
    >
      <div
        style={{
          background:   '#fff',
          borderRadius: '20px',
          boxShadow:    '0 24px 64px rgba(0,0,0,0.25)',
          padding:      '40px 36px',
          width:        '100%',
          maxWidth:     '380px',
        }}
      >
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div
            style={{
              width:          '56px',
              height:         '56px',
              background:     'linear-gradient(135deg, var(--navy), var(--navy-mid))',
              borderRadius:   '14px',
              display:        'flex',
              alignItems:     'center',
              justifyContent: 'center',
              margin:         '0 auto 14px',
              fontSize:       '24px',
            }}
          >
            📅
          </div>
          <h1
            style={{
              fontFamily: 'var(--font-title)',
              fontSize:   '1.4rem',
              color:      'var(--navy)',
            }}
          >
            Calendario 5°F
          </h1>
          <p
            style={{
              fontSize:   '0.82rem',
              color:      'var(--gray)',
              marginTop:  '4px',
              fontFamily: 'var(--font-mono)',
            }}
          >
            Panel de administración
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div className="form-group">
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <Mail size={13} /> Email
            </label>
            <input
              className="form-input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="morezzoli@craighouse.cl"
              required
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <Lock size={13} /> Contraseña
            </label>
            <input
              className="form-input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              autoComplete="current-password"
            />
          </div>

          {error && (
            <div
              style={{
                background:   '#fdecea',
                borderLeft:   '3px solid var(--red)',
                borderRadius: '8px',
                padding:      '10px 12px',
                fontSize:     '0.83rem',
                color:        'var(--red)',
              }}
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            style={{ justifyContent: 'center', padding: '12px 20px', marginTop: '4px' }}
          >
            <LogIn size={16} />
            {loading ? 'Iniciando sesión…' : 'Ingresar'}
          </button>
        </form>

        <div style={{ marginTop: '20px', textAlign: 'center' }}>
          <a
            href="/"
            style={{
              fontSize:   '0.8rem',
              color:      'var(--gray)',
              textDecoration: 'none',
            }}
          >
            ← Ver calendario público
          </a>
        </div>
      </div>

      <div
        style={{
          position:   'fixed',
          bottom:     '16px',
          fontFamily: 'var(--font-mono)',
          fontSize:   '0.7rem',
          color:      'rgba(255,255,255,0.35)',
        }}
      >
        powered by <strong style={{ color: 'var(--gold)' }}>REMO</strong>
      </div>
    </div>
  )
}
