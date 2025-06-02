// *** SUA CHAVE DE API DO OPENROUTESERVICE AQUI ***
// Para produção, NUNCA exponha sua chave diretamente assim.
// Use um proxy server para fazer as requisições ORS.
const ORS_API_KEY = '5b3ce3597851110001cf6248615f32ba700946d9b4eb594c34e8c87f'; // Substitua pela sua chave!

const map = L.map('map').setView([-22.951912, -43.210487], 13); // Centro inicial em Rio de Janeiro

// Adiciona a camada de tiles do OpenStreetMap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

let routeLayer = null; // Para armazenar a camada da rota

async function findRoute() {
    const startPointName = document.getElementById('startPoint').value;
    const endPointName = document.getElementById('endPoint').value;
    const errorMessageDiv = document.getElementById('errorMessage');
    const loader = document.getElementById('loader');

    errorMessageDiv.textContent = ''; // Limpa mensagens de erro anteriores
    loader.style.display = 'block'; // Mostra o loader

    // Remove a rota anterior, se houver
    if (routeLayer) {
        map.removeLayer(routeLayer);
        routeLayer = null;
    }

    try {
                // Função para obter coordenadas usando a API maps_local
        async function getCoordinates(placeName) {
            // URL da API Nominatim para geocodificação
        const nominatimUrl = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(placeName)}&format=json&limit=1`;

        const response = await fetch(nominatimUrl, {
            headers: {
                // É uma boa prática incluir um User-Agent para Nominatim
                // Mais informações sobre a política de uso: https://operations.osmfoundation.org/policies/nominatim/
                'User-Agent': 'MinhaAplicacaoDeHiking/1.0 (seu.email@exemplo.com)'
            }
        });

        if (!response.ok) {
            throw new Error(`Erro ao buscar coordenadas para "${placeName}": ${response.statusText}`);
        }

        const data = await response.json();

        if (data && data.length > 0) {
            // Nominatim retorna latitude (lat) e longitude (lon) como strings
            const lat = parseFloat(data[0].lat);
            const lon = parseFloat(data[0].lon);
            // OpenRouteService espera [longitude, latitude]
            return [lon, lat];
        } else {
            throw new Error(`Local não encontrado: ${placeName}`);
        }
        }

        // Obtém as coordenadas para o ponto de partida e chegada
        const startCoords = await getCoordinates(startPointName);
        const endCoords = await getCoordinates(endPointName);

        if (!startCoords || !endCoords) {
            throw new Error('Não foi possível obter as coordenadas para um ou ambos os locais.');
        }

        // URL da API do OpenRouteService para roteamento de hiking
        const url = 'https://api.openrouteservice.org/v2/directions/foot-hiking/geojson';

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Accept': 'application/json, application/geo+json, application/gpx+xml, application/polyline',
                'Content-Type': 'application/json',
                'Authorization': ORS_API_KEY
            },
            body: JSON.stringify({
                coordinates: [startCoords, endCoords],
                profile: 'foot-hiking', // Perfil de roteamento para hiking
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Erro na API do OpenRouteService: ${response.status} - ${errorData.error ? errorData.error.message : 'Erro desconhecido'}`);
        }

        const data = await response.json();

        if (data.features && data.features.length > 0) {
            const route = data.features[0].geometry.coordinates;
            // As coordenadas do GeoJSON estão em [longitude, latitude], Leaflet precisa [latitude, longitude]
            const leafletCoords = route.map(coord => [coord[1], coord[0]]);

            // Adiciona a rota ao mapa
            routeLayer = L.polyline(leafletCoords, {
                color: 'blue',
                weight: 5,
                opacity: 0.7
            }).addTo(map);

            // Ajusta o zoom do mapa para a rota
            map.fitBounds(routeLayer.getBounds());

            // Adiciona marcadores de início e fim
            L.marker(leafletCoords[0]).addTo(map)
                .bindPopup('Ponto de Partida').openPopup();
            L.marker(leafletCoords[leafletCoords.length - 1]).addTo(map)
                .bindPopup('Ponto de Chegada').openPopup();

            // Exibe a distância e o tempo estimado (se disponível na resposta do ORS)
            const summary = data.features[0].properties.summary;
            if (summary) {
                const distanceKm = (summary.distance / 1000).toFixed(2);
                const durationMinutes = (summary.duration / 60).toFixed(0);
                errorMessageDiv.textContent = `Distância: ${distanceKm} km, Duração Estimada: ${durationMinutes} minutos (aprox.)`;
                errorMessageDiv.style.color = 'green';
            }

        } else {
            errorMessageDiv.textContent = 'Nenhuma rota encontrada para os pontos fornecidos.';
            errorMessageDiv.style.color = 'orange';
        }

    } catch (error) {
        console.error('Erro ao buscar rota:', error);
        errorMessageDiv.textContent = `Erro: ${error.message}`;
        errorMessageDiv.style.color = 'red';
    } finally {
        loader.style.display = 'none'; // Esconde o loader
    }
}