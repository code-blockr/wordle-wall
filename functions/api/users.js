const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}

export async function onRequestOptions() {
  return new Response(null, { headers: CORS })
}

export async function onRequestGet({ env }) {
  const { results } = await env.DB.prepare('SELECT DISTINCT name FROM scores ORDER BY name').all()
  return new Response(JSON.stringify(results.map(r => r.name)), {
    headers: { 'Content-Type': 'application/json', ...CORS }
  })
}
