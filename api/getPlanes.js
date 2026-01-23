export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { countryName } = req.body;
  if (!countryName) {
    return res.status(400).json({ error: "countryName fehlt" });
  }

  // Key aus Environment Variables
  const API_KEY = process.env.AVIATIONSTACK_API_KEY;
  if (!API_KEY) {
    return res.status(500).json({ error: "API Key nicht gesetzt" });
  }

  try {
    // Ländercode oder Name zu ISO2-Code, falls du das brauchst
    // Optional: hier kannst du mapping einfügen
    // z.B.: Germany -> DE
    const countryQuery = encodeURIComponent(countryName);

    // AviationStack Endpoint für live flights
    const url = `http://api.aviationstack.com/v1/flights?access_key=${API_KEY}&arr_icao=${countryQuery}&dep_icao=${countryQuery}`;

    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok) {
      console.error("AviationStack error:", data);
      return res.status(500).json({ error: "AviationStack API Fehler", details: data });
    }

    // Optional: Filtere nur Flugzeuge mit Lat/Lon
    const planes = data.data.filter(f => f.latitude && f.longitude).map(f => ({
      icao24: f.flight.iata || f.flight.icao,
      callsign: f.flight.iata || f.flight.icao,
      lat: f.latitude,
      lon: f.longitude,
      originCountry: f.departure ? f.departure.airport : null,
      destination: f.arrival ? f.arrival.airport : null
    }));

    res.status(200).json({ planes });

  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({ error: "Server error" });
  }
}
