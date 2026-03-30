import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { onAuthStateChanged } from 'firebase/auth'
import { Toaster } from 'react-hot-toast'
import { auth } from '@/firebase'
import Calendario from '@/pages/Calendario'
import Login      from '@/pages/Login'
import Admin      from '@/pages/Admin'
import '@/styles/global.css'

/**
 * Ruta protegida: redirige a /login si no hay usuario autenticado.
 */
function RutaProtegida({ children }) {
  const [user,    setUser]    = useState(undefined)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u)
      setLoading(false)
    })
    return () => unsub()
  }, [])

  if (loading) {
    return (
      <div
        style={{
          minHeight:      '100vh',
          display:        'flex',
          alignItems:     'center',
          justifyContent: 'center',
          background:     'var(--bg)',
          fontFamily:     'var(--font-mono)',
          color:          'var(--gray)',
          fontSize:       '0.85rem',
        }}
      >
        Cargando…
      </div>
    )
  }

  return user ? children : <Navigate to="/login" replace />
}

export default function App() {
  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            fontFamily:   'var(--font-body)',
            fontSize:     '0.875rem',
            borderRadius: '10px',
            boxShadow:    'var(--shadow-md)',
          },
          success: { iconTheme: { primary: '#2ecc71', secondary: '#fff' } },
          error:   { iconTheme: { primary: '#c8102e', secondary: '#fff' } },
        }}
      />

      <Routes>
        <Route path="/"       element={<Calendario />} />
        <Route path="/login"  element={<Login />} />
        {/* TEMPORAL: sin login para pruebas */}
        <Route path="/admin" element={<Admin />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
