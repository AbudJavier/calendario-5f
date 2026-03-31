export default async function handler(req, res) {
  // Solo POST
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { emailContent, emailSubject } = req.body;

    if (!emailContent) {
      return res.status(400).json({ error: "emailContent is required" });
    }

    // Llamar a Claude directamente via fetch (sin SDK)
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 1024,
        messages: [
          {
            role: "user",
            content: `Eres un asistente que parsea emails de un colegio chileno (Craighouse School, 5° Básico F) y extrae eventos para un calendario escolar.

Analiza el siguiente email y extrae información para crear un evento de calendario.

Asunto: ${emailSubject || "Sin asunto"}
Contenido: ${emailContent}

Retorna un JSON con:
- titulo: (título del evento, máximo 100 caracteres)
- tipo: (prueba | tarea | evento | aviso)
- materia: (Matemáticas | Lenguaje | Inglés | Historia | Ciencias | Artes | Ed. Física | Diseño | Proyecto Comunitario | General)
- fecha: (YYYY-MM-DD si está explícita)
- descripcion: (descripción del evento)

Retorna SOLO el JSON, sin markdown, sin backticks, sin explicación.`,
          },
        ],
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(500).json({ error: data.error?.message || "Error de Claude API" });
    }

    const responseText = data.content?.[0]?.text || "";

    let eventData;
    try {
      eventData = JSON.parse(responseText);
    } catch (e) {
      return res.status(400).json({ error: "Claude no retornó JSON válido", raw: responseText });
    }

    return res.status(200).json({ success: true, eventData });

  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ error: error.message || "Error interno" });
  }
}
