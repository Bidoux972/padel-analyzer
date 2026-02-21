export default async function handler(req, res) {
  const { url } = req.query;
  if (!url) {
    return res.status(400).json({ error: "Missing url parameter" });
  }

  // Only allow proxying from known image domains
  const allowed = [
    "padelful.com",
    "www.padelful.com",
    "usaplayspadel.com",
    "www.usaplayspadel.com",
  ];

  try {
    const parsed = new URL(url);
    if (!allowed.some(d => parsed.hostname === d || parsed.hostname.endsWith("." + d))) {
      return res.status(403).json({ error: "Domain not allowed" });
    }

    // Padelful uses Next.js image optimization — direct /images/ paths return 403
    // Transform to /_next/image?url=...&w=384&q=75 which serves the actual image
    let fetchUrl = url;
    if (parsed.hostname.includes("padelful.com") && parsed.pathname.startsWith("/images/")) {
      fetchUrl = `https://www.padelful.com/_next/image?url=${encodeURIComponent(parsed.pathname)}&w=384&q=75`;
    }

    const response = await fetch(fetchUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
        "Accept": "image/webp,image/apng,image/*,*/*;q=0.8",
        "Referer": "https://www.padelful.com/",
      },
    });

    if (!response.ok) {
      return res.status(response.status).json({ error: `Upstream ${response.status}` });
    }

    const contentType = response.headers.get("content-type") || "image/png";
    const buffer = Buffer.from(await response.arrayBuffer());

    // Cache for 7 days, stale-while-revalidate for 30 days
    res.setHeader("Cache-Control", "public, max-age=604800, s-maxage=604800, stale-while-revalidate=2592000");
    res.setHeader("Content-Type", contentType);
    res.setHeader("Content-Length", buffer.length);
    res.status(200).send(buffer);
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
