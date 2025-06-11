const express = require('express');
const { OpenAI } = require("openai");

const router = express.Router();

const OPENAI_API_KEY = process.env.OPENAI_API_KEY; 

// Ruta para manejar las solicitudes de chat
router.post('/chat', async (req, res) => {
  try {
    console.log("Ejecutando solicitud a chatgpt....");

    const { message } = req.body;

    // Crea una instancia de OpenAI con la API key
    const openai = new OpenAI(OPENAI_API_KEY);

    // Hacer una solicitud a la API de ChatGPT
    const completion = await openai.chat.completions.create({
        messages: [
          {
            role: "system",
            content:
              "Eres experto en análisis social",
          },
          { role: "user", content: message },
        ],
        model: "gpt-3.5-turbo",
      });
    const suggestions = completion.choices[0].message.content;

    // Enviar la respuesta del modelo de vuelta al cliente
    res.json({respuesta_chat: suggestions});
  } catch (error) {
    console.error('Error al procesar la solicitud:', error);
    res.status(500).json({ error: 'Ocurrió un error al procesar la solicitud.' });
  }
});

module.exports = router;
