export default async function handler(req, res) {
  console.log("KEY vorhanden:", !!process.env.OPENAI_API_KEY);
  console.log("KEY 2 vorhanden:", !!process.env.tripmapapikey);
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { countryName } = req.body;
  if (!countryName) return res.status(400).json({ error: "countryName fehlt" });

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`
      },
      body: JSON.stringify({
        model: "deepseek/deepseek-chat",
        messages: [{ role: "user", content: `Schreibe einen kurzen, sachlichen Text über ${countryName} (max. 120 Wörter).` }],
        temperature: 0.7,
        max_tokens: 200
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("OpenRouter error:", data);
      return res.status(500).json({ error: "OpenRouter API Fehler", details: data });
    }

    res.status(200).json({ text: data.choices[0]?.message?.content || "Keine Antwort erhalten" });

  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({ error: "Server error" });
  }
}

