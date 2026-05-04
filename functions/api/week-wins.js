const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}

export async function onRequestOptions() {
  return new Response(null, { headers: CORS })
}

export async function onRequestGet({ env }) {
  const { results } = await env.DB.prepare(
    'SELECT name, COUNT(*) as wins FROM week_wins GROUP BY name ORDER BY wins DESC'
  ).all()
  return new Response(JSON.stringify(results), {
    headers: { 'Content-Type': 'application/json', ...CORS }
  })
}
