// netlify/functions/get-hiking-details.js

const { MongoClient } = require("mongodb"); // Importa o cliente do driver nativo
require("dotenv").config(); // Carrega as variáveis de ambiente (para desenvolvimento local)

const MONGODB_URI = process.env.MONGODB_URI;

// Variável para armazenar o cliente MongoDB conectado, para reutilização entre invocações
let cachedClient = null;
let cachedDb = null; // Opcional: para armazenar o objeto 'db' também

async function connectToDatabase() {
  // Se já temos um cliente conectado, retornamos a conexão existente
  // 'isConnected()' verifica se a conexão está ativa
  if (cachedClient && cachedClient.topology && cachedClient.topology.isConnected()) {
    console.log("=> Usando conexão MongoDB existente");
    return { client: cachedClient, db: cachedDb };
  }

  // Se não houver cliente conectado, ou a conexão não estiver ativa, criamos uma nova
  console.log("=> Criando nova conexão MongoDB");
  try {
    const client = new MongoClient(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      // maxPoolSize: 10, // Opcional: Limita o número de conexões no pool
      serverSelectionTimeoutMS: 5000, // Tempo limite para encontrar um servidor
      socketTimeoutMS: 45000 // Tempo limite para operações de socket
    });

    await client.connect();
    console.log("Conectado ao MongoDB Atlas!");

    cachedClient = client;
    cachedDb = client.db("riohiking"); // Armazena o objeto 'db' também para reutilização

    return { client: cachedClient, db: cachedDb };

  } catch (error) {
    console.error("Erro na conexão ao MongoDB:", error);
    // É importante lançar o erro para que o bloco `catch` principal da função `handler` o capture.
    throw new Error(`Failed to connect to database: ${error.message}`);
  }
}

export async function handler(event, context) {
  // Configurações de CORS
  const headers = {
    "Access-Control-Allow-Origin": "*", // Em produção, MUDAR para o domínio exato do seu frontend (ex: 'https://seusite.netlify.app')
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };

  // Lidar com requisições OPTIONS (pré-voo CORS)
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers,
      body: "OK",
    };
  }

  // A Netlify Function deve apenas aceitar requisições GET para buscar dados
  if (event.httpMethod !== "GET") {
    return {
      statusCode: 405,
      headers,
      body: "Method Not Allowed. Only GET is supported.",
    };
  }

  try {
    // Tenta conectar ou reutilizar a conexão existente
    const { db } = await connectToDatabase();
    
    // Acessa a collection e busca os dados
    const collection = db.collection("hiking-details");
    const hikingDetails = await collection.find({}).toArray();

    // Retorna os dados como JSON
    return {
      statusCode: 200,
      headers: { ...headers, "Content-Type": "application/json" },
      body: JSON.stringify(hikingDetails),
    };

  } catch (error) {
    console.error("Erro na Netlify Function (handler):", error);
    // Retorna uma resposta de erro para o frontend
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: "Erro interno do servidor ao buscar detalhes de trilhas.", 
        details: error.message 
      }),
    };
  }
  // Não precisamos de um bloco `finally` para `client.close()` aqui
  // pois estamos reutilizando a conexão para otimizar o desempenho em serverless.
}