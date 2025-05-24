require('dotenv').config();
console.log('Chave ORS:', process.env.ORS_API_KEY);

const axios = require('axios');

const NOMINATIM_URL = 'https://nominatim.openstreetmap.org/search';
const ORS_URL = 'https://api.openrouteservice.org/v2/directions/foot-hiking';

async function buscarCoordenadas(local) {
  const res = await axios.get(NOMINATIM_URL, {
    params: {
      q: local,
      format: 'json',
      limit: 1,
    },
    headers: {
      'User-Agent': 'hiking-app/1.0',
    },
  });

  if (res.data.length === 0) {
    throw new Error('Local não encontrado.');
  }

  const { lat, lon, display_name } = res.data[0];
  return { lat: parseFloat(lat), lon: parseFloat(lon), nome: display_name };
}

async function gerarRotaDeHiking(origem, destino) {
  const res = await axios.post(ORS_URL, {
    coordinates: [
      [origem.lon, origem.lat],
      [destino.lon, destino.lat],
    ],
  }, {
    headers: {
      Authorization: process.env.ORS_API_KEY,
      'Content-Type': 'application/json',
    },
  });
  console.log(res);
  const rota = res.data.routes[0];
  const distancia = (rota.summary.distance / 1000).toFixed(2); // metros para km
  const duracao = (rota.summary.duration / 60).toFixed(0);     // segundos para minutos
  
  console.log(`📍 Rota de ${origem.nome} até ${destino.nome}`);
  console.log(`🚶‍♂️ Distância: ${distancia} km`);
  console.log(`⏱️ Duração estimada: ${duracao} min`);

  console.log(
    `🗺️ Ver rota no mapa: https://www.openstreetmap.org/directions?engine=fossgis_osrm_foot&route=${origem.lat},${origem.lon};${destino.lat},${destino.lon}`
  );
}
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

(async () => {
  try {
    const origem = await buscarCoordenadas("Pedra Bonita, Rio de Janeiro");
    // Aguarda 1 segundo antes de fazer a segunda requisição
    await delay(1000);
    const destino = await buscarCoordenadas(' Trilha da Pedra Bonita, Rio de Janeiro');
    await gerarRotaDeHiking(origem, destino);
  } catch (erro) {
    console.error('Erro:', erro.message);
  }
})();