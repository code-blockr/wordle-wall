const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, DELETE, OPTIONS',
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

function getMondayOf(isoDate) {
  const d = new Date(isoDate + 'T00:00:00')
  const dow = d.getDay()
  const offset = dow === 0 ? -6 : 1 - dow
  d.setDate(d.getDate() + offset)
  return d.toISOString().slice(0, 10)
}

export async function onRequestOptions() {
  return new Response(null, { headers: CORS })
}

export async function onRequestPost({ request, env }) {
  let body
  try { body = await request.json() } catch { return json({ error: 'Invalid JSON' }, 400) }
  const { name, score, date } = body
  if (!name || !score) return json({ error: 'name and score required' }, 400)
  if (typeof name !== 'string' || name.trim().length > 20 || !/^[A-Za-z\s'-]+$/.test(name.trim())) {
    return json({ error: 'invalid name' }, 400)
  }
  if (!['1', '2', '3', '4', '5', '6', 'FAILURE'].includes(String(score))) {
    return json({ error: 'invalid score' }, 400)
  }
  const todayStr = new Date().toISOString().slice(0, 10)
  const targetDate = date || todayStr
  if (!/^\d{4}-\d{2}-\d{2}$/.test(targetDate) || targetDate < getMondayOf(todayStr) || targetDate > todayStr) {
    return json({ error: 'invalid date' }, 400)
  }
  const normalName = titleCase(name)
  await env.DB.prepare('INSERT OR REPLACE INTO scores (name, score, date) VALUES (?, ?, ?)')
    .bind(normalName, String(score), targetDate).run()
  return json({ ok: true })
}

export async function onRequestDelete({ request, env }) {
  let body
  try { body = await request.json() } catch { return json({ error: 'Invalid JSON' }, 400) }
  const { name, date } = body
  if (!name) return json({ error: 'name required' }, 400)
  if (typeof name !== 'string' || name.trim().length > 20 || !/^[A-Za-z\s'-]+$/.test(name.trim())) {
    return json({ error: 'invalid name' }, 400)
  }
  const todayStr = new Date().toISOString().slice(0, 10)
  const targetDate = date || todayStr
  if (!/^\d{4}-\d{2}-\d{2}$/.test(targetDate) || targetDate < getMondayOf(todayStr) || targetDate > todayStr) {
    return json({ error: 'invalid date' }, 400)
  }
  const normalName = titleCase(name)
  await env.DB.prepare('DELETE FROM scores WHERE name=? AND date=?').bind(normalName, targetDate).run()
  return json({ ok: true })
}
