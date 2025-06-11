const connection = require('../db/connection');

// Función para guardar la consulta del usuario
const saveUserQuery = async (userId,userQuery) => {
  const sql = 'INSERT INTO query (user_id, challenge_id, content) VALUES (?, ?,?)';
  const values = [userId,1,userQuery,];
  
  try {
    const [result] = await connection.execute(sql, values);
    return result;
  } catch (error) {
    console.error('Error al guardar la consulta del usuario:', error);
    throw error;
  }
};

// Función para guardar el resultado de la consulta del bot
const saveBotResponse = async (userQueryId, botResponse) => {
  const sql = 'INSERT INTO query_result (query_id, content) VALUES (?, ?)';
  const values = [userQueryId, botResponse];
  
  try {
    const [result] = await connection.execute(sql, values);
    return result;
  } catch (error) {
    console.error('Error al guardar el resultado de la consulta del bot:', error);
    throw error;
  }
};

module.exports = { saveUserQuery, saveBotResponse };
