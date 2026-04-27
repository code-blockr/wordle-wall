const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}

function getMondayOf(isoDate) {
  const d = new Date(isoDate + 'T00:00:00Z')
  const dow = d.getUTCDay()
  const offset = dow === 0 ? -6 : 1 - dow
  d.setUTCDate(d.getUTCDate() + offset)
  return d.toISOString().slice(0, 10)
}

export async function onRequestOptions() {
  return new Response(null, { headers: CORS })
}

export async function onRequestGet({ env }) {
  const today = new Date().toISOString().slice(0, 10)
  const monday = getMondayOf(today)
  const fri = new Date(monday + 'T00:00:00Z')
  fri.setUTCDate(fri.getUTCDate() + 4)
  const friday = fri.toISOString().slice(0, 10)
  const { results } = await env.DB.prepare(
    'SELECT * FROM scores WHERE date >= ? AND date <= ? ORDER BY name, date'
  ).bind(monday, friday).all()
  return new Response(JSON.stringify(results), {
    headers: { 'Content-Type': 'application/json', ...CORS }
  })
}
