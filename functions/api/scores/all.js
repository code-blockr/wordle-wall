const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}

export async function onRequestOptions() {
  return new Response(null, { headers: CORS })
}

export async function onRequestGet({ env }) {
  const { results } = await env.DB.prepare('SELECT * FROM scores ORDER BY date, name').all()
  return new Response(JSON.stringify(results), {
    headers: { 'Content-Type': 'application/json', ...CORS }
  })
}
