// *** SUA CHAVE DE API DO OPENROUTESERVICE AQUI ***
// Para produção, NUNCA exponha sua chave diretamente assim.
// Use um proxy server para fazer as requisições ORS.
const ORS_API_KEY = '5b3ce3597851110001cf6248615f32ba700946d9b4eb594c34e8c87f'; // Substitua pela sua chave!

// Inicializa o mapa
const map = L.map('map').setView([-22.951912, -43.210487], 13); // Centro inicial em Rio de Janeiro

// Adiciona a camada de tiles do OpenStreetMap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

let routeLayer = null; // Para armazenar a camada da rota

async function findRoute() {
    const startInput = document.getElementById('startPoint').value;
    const endInput = document.getElementById('endPoint').value;
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
        // Validação e parse dos pontos
        const parseCoordinates = (coordString) => {
            const parts = coordString.split(',').map(s => parseFloat(s.trim()));
            if (parts.length !== 2 || isNaN(parts[0]) || isNaN(parts[1])) {
                throw new Error('Formato de coordenada inválido. Use "latitude, longitude".');
            }
            // ORS espera [longitude, latitude]
            return [parts[1], parts[0]];
        };

        const startCoords = parseCoordinates(startInput);
        const endCoords = parseCoordinates(endInput);

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
                const distanceKm = (summary.distance / 1000).toFixed(2); // Distância em km
                const durationMinutes = (summary.duration / 60).toFixed(0); // Duração em minutos
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

// Exemplo de coordenadas iniciais (Corcovado para Parque Lage, Rio de Janeiro)
// Isso preenche os campos automaticamente para facilitar o teste.
// É uma boa prática executar isso após o DOM estar carregado para garantir que os elementos existem.
document.addEventListener('DOMContentLoaded', (event) => {
    document.getElementById('startPoint').value = '-22.951912, -43.210487'; // Corcovado
    document.getElementById('endPoint').value = '-22.946369, -43.204595'; // Parque Lage
});