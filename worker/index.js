addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

function titleCase(str) {
  return str.trim().split(/\s+/).map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ')
}

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', ...CORS },
  })
}

function getMondayOf(isoDate) {
  const d = new Date(isoDate + 'T00:00:00Z')
  const dow = d.getUTCDay()
  const offset = dow === 0 ? -6 : 1 - dow
  d.setUTCDate(d.getUTCDate() + offset)
  return d.toISOString().slice(0, 10)
}

async function handleRequest(request) {
  const { pathname } = new URL(request.url)
  const method = request.method

  if (method === 'OPTIONS') {
    return new Response(null, { headers: CORS })
  }

  if (pathname === '/api/users' && method === 'GET') {
    const { results } = await DB.prepare('SELECT DISTINCT name FROM scores ORDER BY name').all()
    return json(results.map(r => r.name))
  }

  if (pathname === '/api/score' && method === 'POST') {
    let body
    try { body = await request.json() } catch { return json({ error: 'Invalid JSON' }, 400) }
    const { name, score } = body
    if (!name || !score) return json({ error: 'name and score required' }, 400)
    if (!['1', '2', '3', '4', '5', 'FAILURE'].includes(String(score))) {
      return json({ error: 'invalid score' }, 400)
    }
    const normalName = titleCase(name)
    const today = new Date().toISOString().slice(0, 10)
    await DB.prepare('INSERT OR REPLACE INTO scores (name, score, date) VALUES (?, ?, ?)')
      .bind(normalName, String(score), today).run()
    return json({ ok: true })
  }

  if (pathname === '/api/score' && method === 'DELETE') {
    let body
    try { body = await request.json() } catch { return json({ error: 'Invalid JSON' }, 400) }
    const { name } = body
    if (!name) return json({ error: 'name required' }, 400)
    const normalName = titleCase(name)
    const today = new Date().toISOString().slice(0, 10)
    await DB.prepare('DELETE FROM scores WHERE name=? AND date=?').bind(normalName, today).run()
    return json({ ok: true })
  }

  if (pathname === '/api/scores/week' && method === 'GET') {
    const today = new Date().toISOString().slice(0, 10)
    const monday = getMondayOf(today)
    const fri = new Date(monday + 'T00:00:00Z')
    fri.setUTCDate(fri.getUTCDate() + 4)
    const friday = fri.toISOString().slice(0, 10)
    const { results } = await DB.prepare(
      'SELECT * FROM scores WHERE date >= ? AND date <= ? ORDER BY name, date'
    ).bind(monday, friday).all()
    return json(results)
  }

  if (pathname === '/api/scores/all' && method === 'GET') {
    const { results } = await DB.prepare('SELECT * FROM scores ORDER BY date, name').all()
    return json(results)
  }

  return json({ error: 'Not found' }, 404)
}
