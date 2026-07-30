export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/api/chat" && request.method === "POST") {
      return handleOpenAI(request, env);
    }

    return env.ASSETS.fetch(request);
  },
};

async function handleOpenAI(request, env) {
  if (!env.GEMINI_API_KEY) {
    return json({ error: "GEMINI_API_KEY ist auf dem Worker nicht gesetzt. Siehe README." }, 500);
  }

  let payload;
  try {
    payload = await request.json();
  } catch {
    return json({ error: "Ungültiger Request-Body." }, 400);
  }

  if (!payload || !Array.isArray(payload.messages)) {
    return json({ error: "Feld 'messages' fehlt oder ist ungültig." }, 400);
  }

  const geminiRes = await fetch("https://generativelanguage.googleapis.com/v1beta/openai/chat/completions", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${env.GEMINI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gemini-2.0-flash",
      max_tokens: payload.max_tokens || 1000,
      messages: payload.messages,
    }),
  });

  const text = await geminiRes.text();
  return new Response(text, {
    status: geminiRes.status,
    headers: { "content-type": "application/json" },
  });
}

function json(obj, status = 200) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { "content-type": "application/json" },
  });
}
