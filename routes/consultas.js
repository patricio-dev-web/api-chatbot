const express = require('express');
const router = express.Router();
const { saveUserQuery, saveBotResponse } = require('../models/Consultas');
const pool = require('../db/connection'); // Importa la conexión a la base de datos

// Nuevo endpoint para obtener todas las queries y los query results
router.get('/consultas', async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT q.id AS query_id, q.content AS prompt, u.username AS user_name, qr.content AS response, q.date AS query_date, qr.date AS response_date
       FROM query q
       JOIN user u ON q.user_id = u.id
       JOIN query_result qr ON qr.query_id = q.id
       ORDER BY q.id ASC`
    );

    const groupedByDate = rows.reduce((acc, row) => {
      const date = row.query_date.toISOString().split('T')[0]; // Agrupar por fecha (sin hora)
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push({
        user_name: row.user_name,
        prompt: row.prompt,
        response: row.response
      });
      return acc;
    }, {});

    const result = Object.keys(groupedByDate).map(date => ({
      date,
      messages: groupedByDate[date]
    }));

    res.json(result);
  } catch (error) {
    console.error('Error retrieving queries:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Ruta para guardar la consulta del usuario y la respuesta del bot
router.post('/consultas', async (req, res) => {
  const { userId, userQuery, botResponse } = req.body;
  try {
    // Guardar la consulta del usuario y obtener su ID
    const { insertId: userQueryId } = await saveUserQuery(userId, userQuery);

    // Guardar el resultado de la consulta del bot asociado al ID de la consulta del usuario
    await saveBotResponse(userQueryId, botResponse);

    res.status(201).send({ message: 'Consultas guardadas exitosamente' });
  } catch (error) {
    res.status(500).send({ message: 'Error al guardar consultas', error });
  }
});


// Nuevo endpoint para obtener las queries y los query results según el userId
router.get('/consultas/:userId', async (req, res) => {
  const userId = req.params.userId;

  try {
    const [rows] = await pool.query(
      `SELECT q.id, q.content AS text, 'You' AS user, DATE(q.date) AS date
       FROM query q
       WHERE q.user_id = ?
       UNION ALL
       SELECT qr.id, qr.content AS text, 'ChatBot' AS user, DATE(qr.date) AS date
       FROM query_result qr
       INNER JOIN query q ON q.id = qr.query_id
       WHERE q.user_id = ?
       ORDER BY id ASC`,  // Order by date and time
      [userId, userId]
    );

    const groupedByDate = rows.reduce((acc, row) => {
      const date = row.date;
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push({ text: row.text, user: row.user, date:date });
      return acc;
    }, {});

    const result = Object.keys(groupedByDate).map(date => ({
      date,
      messages: groupedByDate[date]
    }));

    res.json(result);
  } catch (error) {
    console.error('Error retrieving queries:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
