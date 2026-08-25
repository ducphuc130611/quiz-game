const base = `http://127.0.0.1:${process.env.PORT || 3000}`;

async function request(path, options = {}) {
  const response = await fetch(`${base}${path}`, options);
  const body = await response.json().catch(() => ({}));
  return { response, body };
}

const health = await request("/health");
if (!health.response.ok || health.body.version !== "6.2.0") throw new Error("v6 health check failed");

const email = `smoke-${Date.now()}@example.com`;
const register = await request("/api/auth/register", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ username: `smoke_${Date.now().toString().slice(-8)}`, email, password: "SmokeTest!123" })
});
if (register.response.status !== 201 || !register.body.token) throw new Error("registration check failed");

const me = await request("/api/auth/me", {
  headers: { Authorization: `Bearer ${register.body.token}` }
});
if (!me.response.ok || me.body.account?.email) throw new Error("auth response leaked private email or failed");

const owner = await request("/api/owner/status", {
  headers: { Authorization: `Bearer ${register.body.token}` }
});
if (!owner.response.ok || owner.body.owner !== false) throw new Error("owner isolation check failed");

const forbidden = await request("/api/owner/dashboard", {
  headers: { Authorization: `Bearer ${register.body.token}` }
});
if (forbidden.response.status !== 403) throw new Error("owner endpoint is not protected");

console.log("Quiz Game v6.2 smoke test passed");
