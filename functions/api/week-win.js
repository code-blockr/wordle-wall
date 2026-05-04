const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', ...CORS }
  })
}

function titleCase(str) {
  return str.trim().split(/\s+/).map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ')
}

export async function onRequestOptions() {
  return new Response(null, { headers: CORS })
}

export async function onRequestPost({ request, env }) {
  let body
  try { body = await request.json() } catch { return json({ error: 'Invalid JSON' }, 400) }
  const { name, week_start } = body
  if (!name || !week_start) return json({ error: 'name and week_start required' }, 400)
  if (!/^\d{4}-\d{2}-\d{2}$/.test(week_start)) return json({ error: 'invalid week_start' }, 400)
  const normalName = titleCase(name)
  await env.DB.prepare('INSERT OR IGNORE INTO week_wins (name, week_start) VALUES (?, ?)')
    .bind(normalName, week_start).run()
  return json({ ok: true })
}
