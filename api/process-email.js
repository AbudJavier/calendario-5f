import Anthropic from "@anthropic-ai/sdk";

export default async function handler(req, res) {
  // Solo POST
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { emailContent, emailSubject } = req.body;

    // Validar que lleguen los datos
    if (!emailContent) {
      return res.status(400).json({ error: "emailContent is required" });
    }

    // Inicializar cliente Anthropic (usa ANTHROPIC_API_KEY env var)
    const client = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });

    // Llamar a Claude para analizar el email
    const message = await client.messages.create({
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
    });

    // Extraer el texto de la respuesta
    const responseText =
      message.content[0].type === "text" ? message.content[0].text : "";

    // Parsear JSON
    let eventData;
    try {
      eventData = JSON.parse(responseText);
    } catch (e) {
      return res.status(400).json({ error: "Claude no retornó JSON válido" });
    }

    // Retornar los datos procesados
    return res.status(200).json({
      success: true,
      eventData,
      tokensUsed: message.usage,
    });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({
      error: error.message || "Error processing email",
    });
  }
}
