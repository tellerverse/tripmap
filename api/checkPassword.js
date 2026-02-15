export default function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { password } = req.body;
  if (!password) return res.status(400).json({ ok: false, error: "No password provided" });

  if (password === process.env.EDIT_PASSWORD) {
    return res.status(200).json({ ok: true });
  }

  return res.status(401).json({ ok: false });
}
