// Cloudflare Worker — Static Assets Fallback Router
// Serves HTML files for clean URLs and falls back gracefully.
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    let pathname = url.pathname;

    // 1) Try the assets handler directly first
    let response = await env.ASSETS.fetch(request);
    if (response.status !== 404) return response;

    // 2) If the path has no extension, try with .html
    if (!pathname.includes('.') && pathname !== '/') {
      const cleanPath = pathname.replace(/\/$/, '');
      const htmlUrl = new URL(cleanPath + '.html', url.origin);
      response = await env.ASSETS.fetch(new Request(htmlUrl, request));
      if (response.status !== 404) return response;
    }

    // 3) Otherwise return original 404
    return response;
  }
};
