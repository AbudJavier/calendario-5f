import { useState, useEffect } from 'react'
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
} from 'firebase/firestore'
import { db } from '@/firebase'

/**
 * Hook universal para eventos de Firestore.
 * - Para vista pública: filtra estado === "publicado"
 * - Para admin: devuelve todos los estados
 */
export function useEventos({ soloPublicados = true } = {}) {
  const [eventos,  setEventos]  = useState([])
  const [loading,  setLoading]  = useState(true)
  const [error,    setError]    = useState(null)

  useEffect(() => {
    try {
      const ref = collection(db, 'eventos')

      // Construir query sin índice compuesto (mejor compatibilidad)
      let q
      if (soloPublicados) {
        q = query(ref, where('estado', '==', 'publicado'))
      } else {
        q = query(ref)
      }

      const unsub = onSnapshot(
        q,
        (snap) => {
          console.log('📊 Firestore snapshot recibido:', snap.docs.length, 'documentos')
          const eventosData = snap.docs.map((d) => {
            const data = d.data()
            console.log('📄 Documento:', d.id, data)
            return {
              id: d.id,
              ...data,
              // Convertir Timestamp → Date JS para comodidad
              fecha: data.fecha?.toDate?.() ?? null,
            }
          })

          console.log('✅ Eventos procesados:', eventosData.length)

          // Ordenar en memoria (evita necesidad de índice compuesto)
          eventosData.sort((a, b) => {
            const fechaA = a.fecha ? new Date(a.fecha).getTime() : 0
            const fechaB = b.fecha ? new Date(b.fecha).getTime() : 0
            return fechaA - fechaB
          })

          setEventos(eventosData)
          setLoading(false)
        },
        (err) => {
          console.error('❌ Firestore error:', err)
          console.error('Detalles:', err.code, err.message)
          setError(err.message)
          setLoading(false)
        }
      )

      return () => unsub()
    } catch (e) {
      console.error('❌ Error en useEventos:', e)
      setError(e.message)
      setLoading(false)
    }
  }, [soloPublicados])

  // ── CRUD ───────────────────────────────────────────────────────────

  async function crearEvento(datos) {
    await addDoc(collection(db, 'eventos'), {
      ...datos,
      estado:    datos.estado    ?? 'publicado',
      origen:    datos.origen    ?? 'manual',
      createdAt: serverTimestamp(),
    })
  }

  async function actualizarEvento(id, cambios) {
    await updateDoc(doc(db, 'eventos', id), cambios)
  }

  async function eliminarEvento(id) {
    await deleteDoc(doc(db, 'eventos', id))
  }

  async function aprobarEvento(id) {
    await updateDoc(doc(db, 'eventos', id), { estado: 'publicado' })
  }

  async function rechazarEvento(id) {
    await updateDoc(doc(db, 'eventos', id), { estado: 'rechazado' })
  }

  return {
    eventos,
    loading,
    error,
    crearEvento,
    actualizarEvento,
    eliminarEvento,
    aprobarEvento,
    rechazarEvento,
  }
}
