// netlify/functions/get-hiking-details.js

import mongoose from "mongoose"; // Se você usar Mongoose
import connectDB from "./connectDb.js"; // Importe a função de conexão
const { MongoClient } = require("mongodb");

// Ou, se você preferir importar a URI diretamente se não tiver connectDB.js
// require("dotenv").config(); // para desenvolvimento local
// const MONGODB_URI = process.env.MONGODB_URI; 

export async function handler(event, context) {
  // Configurações de CORS (necessário se o frontend estiver em um domínio diferente)
  const headers = {
    "Access-Control-Allow-Origin": "*", // CUIDADO: Em produção, use o domínio exato do seu frontend
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
      body: "Method Not Allowed",
    };
  }

  try {
    // 1. Conectar ao MongoDB (usando sua função connectDB)
    // Se connectDB usar Mongoose, a conexão será estabelecida globalmente após a primeira chamada.
    // Se connectDB apenas retorna o client ou db, você precisará ajustar.
    // Para simplificar, vou usar o driver nativo aqui, que é o que normalmente se faz em Serverless.
    
    // --- Usando o driver nativo do MongoDB ---
    const uri = process.env.MONGODB_URI;
    // Otimização: Reutilizar a conexão. A variável client precisa ser externa à função handler.
    // Para um exemplo simples, podemos inicializá-la aqui. Em produção, use uma variável global persistente.
    let client; 
    try {
      client = new MongoClient(uri);
      await client.connect();
    } catch (dbConnectError) {
      console.error("Erro ao conectar ao MongoDB:", dbConnectError);
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: "Failed to connect to database.", details: dbConnectError.message }),
      };
    }
    
    const db = client.db("riohiking"); // Seu banco de dados
    const collection = db.collection("hiking-details"); // Sua collection

    // 2. Buscar os dados na collection
    const hikingDetails = await collection.find({}).toArray();

    // 3. Fechar a conexão (em serverless, o driver gerencia pools, mas um client.close() pode ser útil em cenários específicos)
    // No entanto, para otimizar o cold start, muitas vezes não se fecha a conexão imediatamente
    // para que ela possa ser reutilizada em invocações subsequentes na mesma instância Lambda.
    // client.close(); // Comentar para reutilização em serverless, descomentar se tiver problemas.

    // 4. Retornar os dados como JSON
    return {
      statusCode: 200,
      headers: { ...headers, "Content-Type": "application/json" },
      body: JSON.stringify(hikingDetails),
    };

  } catch (error) {
    console.error("Erro na Netlify Function:", error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: "Failed to fetch hiking details.", details: error.message }),
    };
  } finally {
      // Recomenda-se fechar a conexão no finally se você não estiver reutilizando
      // para evitar problemas de pool de conexões abertas, especialmente para writes.
      // Para reads leves e reuso, pode-se deixar aberto.
      // if (client) {
      //   client.close();
      // }
  }
}