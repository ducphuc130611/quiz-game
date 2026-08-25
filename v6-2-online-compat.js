(() => {
  "use strict";
  const rewrite = new Map([
    ["/auth/register", "/api/auth/register"],
    ["/auth/login", "/api/auth/login"],
    ["/auth/logout", "/api/auth/logout"],
    ["/auth/me", "/api/auth/me"],
    ["/players/sync", "/api/players/sync"]
  ]);
  const originalFetch = window.fetch.bind(window);
  window.fetch = (input, init) => {
    try {
      const url = typeof input === "string" ? input : input.url;
      const match = [...rewrite.entries()].find(([from]) => url.endsWith(from));
      if (match) {
        const nextUrl = url.slice(0, -match[0].length) + match[1];
        if (typeof input === "string") return originalFetch(nextUrl, init);
        return originalFetch(new Request(nextUrl, input), init);
      }
    } catch {}
    return originalFetch(input, init);
  };
  window.QuizGameV620 = { version: "6.2.0", backendApiPrefix: "/api" };
})();
