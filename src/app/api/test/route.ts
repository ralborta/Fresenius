import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ ok: true, msg: "Funciona la API de prueba" });
} 