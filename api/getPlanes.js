export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { countryName } = req.body;
  if (!countryName) return res.status(400).json({ error: "countryName fehlt" });

  // Liste der Hauptflughäfen pro Land (nur Beispiele)
  const countryAirports = {
    Germany: ["EDDF","EDDM","EDDW","EDDH","EDDS"],
    France: ["LFPG","LFPO","LFLL","LFML"],
    Spain: ["LEMD","LEBL","LEMG","LEPA"]
  };

  const airports = countryAirports[countryName];
  if (!airports || airports.length === 0) return res.status(404).json({ planes: [] });

  const airportParam = airports.join(",");

  try {
    const response = await fetch(`http://api.aviationstack.com/v1/flights?access_key=${process.env.AVIATIONSTACK_API_KEY}&dep_icao=${airportParam}`);
    const data = await response.json();

    if (!response.ok) return res.status(500).json({ error: "AviationStack API Fehler", details: data });

    // Mapping der Flugdaten auf das, was die Karte braucht
    const planes = (data.data || []).map(f => ({
      lat: f.latitude || f.latitude_dep,
      lon: f.longitude || f.longitude_dep,
      callsign: f.flight.iata || f.flight.icao || "Unbekannt",
      originCountry: f.departure.country || "Unbekannt",
      destination: f.arrival.icao || null
    }));

    res.status(200).json({ planes });
  } catch (err) {
    console.error("Fehler beim Laden der AviationStack-Daten:", err);
    res.status(500).json({ error: "Server error" });
  }
}
