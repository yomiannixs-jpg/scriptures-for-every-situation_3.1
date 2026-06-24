const cacheHeaders = {
  "Cache-Control": "s-maxage=86400, stale-while-revalidate=604800",
};

const allowed = new Set(['kjv', 'asv', 'web', 'bbe', 'darby', 'ylt']);
const labels = { kjv: 'KJV', asv: 'ASV', web: 'WEB', bbe: 'BBE', darby: 'Darby', ylt: 'YLT' };

export default async function handler(req, res) {
  const ref = String(req.query.ref || "").trim();
  const requested = String(req.query.translation || 'kjv').toLowerCase().trim();
  const translation = allowed.has(requested) ? requested : 'kjv';
  if (!ref) return res.status(400).json({ error: "Missing Bible reference." });

  try {
    const url = `https://bible-api.com/${encodeURIComponent(ref)}?translation=${encodeURIComponent(translation)}`;
    const r = await fetch(url);
    const data = await r.json().catch(() => ({}));
    if (!r.ok || !data?.text) {
      return res.status(404).json({ error: data?.error || "Passage not found." });
    }
    return res.status(200).setHeader("Cache-Control", cacheHeaders["Cache-Control"]).json({
      ref: data.reference || ref,
      text: String(data.text).replace(/\n+/g, " ").replace(/\s+/g, " ").trim(),
      translation: labels[translation] || translation.toUpperCase(),
      source: "bible-api.com",
    });
  } catch (e) {
    return res.status(500).json({ error: e?.message || "Unable to fetch passage." });
  }
}
