#!/usr/bin/env node

/**
 * Script para agregar eventos de prueba al calendario
 * Úsalo después de desplegar las reglas de Firestore
 *
 * node add-test-events.js
 */

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, Timestamp } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCgrqhpkkLzkrSbyxRjhZY_qJG9hddDfh8",
  authDomain: "calendario-5f.firebaseapp.com",
  projectId: "calendario-5f",
  storageBucket: "calendario-5f.firebasestorage.app",
  messagingSenderId: "291263589729",
  appId: "1:291263589729:web:e8d3d74d57a55bd7fee920"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const eventos = [
  {
    titulo: "Prueba de Matematicas",
    tipo: "prueba",
    materia: "Matematicas",
    fecha: Timestamp.fromDate(new Date("2026-04-02T14:00:00")),
    descripcion: "Unidad de fracciones y decimales. Estudiar capitulos 5 y 6.",
    estado: "publicado",
    origen: "manual"
  },
  {
    titulo: "Entrega Trabajo de Historia",
    tipo: "tarea",
    materia: "Historia",
    fecha: Timestamp.fromDate(new Date("2026-04-07T12:00:00")),
    descripcion: "Trabajo grupal sobre pueblos originarios de Chile.",
    estado: "publicado",
    origen: "manual"
  },
  {
    titulo: "Dia del Libro",
    tipo: "evento",
    materia: "Lenguaje",
    fecha: Timestamp.fromDate(new Date("2026-04-23T09:00:00")),
    descripcion: "Celebracion del dia del libro. Traer libro favorito.",
    estado: "publicado",
    origen: "manual"
  },
  {
    titulo: "Prueba de Ciencias Naturales",
    tipo: "prueba",
    materia: "Ciencias",
    fecha: Timestamp.fromDate(new Date("2026-03-31T10:00:00")),
    descripcion: "Sistema solar y planetas. Revisar guia entregada.",
    estado: "publicado",
    origen: "manual"
  },
  {
    titulo: "Reunion de Apoderados",
    tipo: "evento",
    materia: "Administracion",
    fecha: Timestamp.fromDate(new Date("2026-04-15T18:30:00")),
    descripcion: "Reunion de apoderados 5°F. Asistencia obligatoria.",
    estado: "publicado",
    origen: "manual"
  }
];

async function addEvents() {
  console.log(`📝 Agregando ${eventos.length} eventos de prueba...`);

  try {
    for (const evento of eventos) {
      const docRef = await addDoc(collection(db, 'eventos'), evento);
      console.log(`✅ ${evento.titulo} (${evento.fecha.toDate().toLocaleDateString('es-CL')})`);
    }
    console.log(`\n✨ Todos los eventos se agregaron exitosamente!`);
    console.log(`🌐 Abre https://calendario-5f.vercel.app para verlos`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Error al agregar eventos:', error.message);
    process.exit(1);
  }
}

addEvents();
