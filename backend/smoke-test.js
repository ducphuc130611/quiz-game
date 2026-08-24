import process from "node:process";

const base = `http://127.0.0.1:${process.env.PORT || 3000}`;
const response = await fetch(`${base}/health`);
if (!response.ok) throw new Error(`Health check failed: HTTP ${response.status}`);
const body = await response.json();
if (body.ok !== true) throw new Error("Health endpoint did not report ok=true");
if (body.version !== "5.7.0") throw new Error(`Unexpected backend version: ${body.version}`);
console.log(`Smoke test passed: ${body.service} ${body.version}`);
