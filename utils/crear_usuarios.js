const fs = require('fs');
const axios = require('axios');
const readline = require('readline');

const endpoint = 'https://chatbot-desafio.site/api/register'; 

// Función para crear un usuario
const createusername = async (username, password, email) => {
  try {
    const response = await axios.post(endpoint, {
      username,
      password,
      email
    });
    console.log(`username created: ${email}`);
  } catch (error) {
    console.error(`Error creating username ${email}:`, error.response ? error.response.data : error.message);
  }
};

// Leer el archivo de correos
const processEmails = async () => {
  const fileStream = fs.createReadStream('correos.txt');

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  for await (const line of rl) {
    const email = line.trim();
    const [username] = email.split('@');
    const password = username;
    await createusername(username, password, email);
  }
};

processEmails().catch(err => console.error(err));
