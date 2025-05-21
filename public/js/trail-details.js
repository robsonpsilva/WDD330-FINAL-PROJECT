document.addEventListener('DOMContentLoaded', async () => {
    const pathParts = window.location.pathname.split('/');
    const trailId = pathParts[pathParts.length - 1]; // Pega o ID da URL

    const trailDetailsDiv = document.getElementById('trail-details');

    if (!trailId) {
        trailDetailsDiv.innerHTML = '<p>ID da trilha não encontrado na URL.</p>';
        return;
    }

    try {
        const response = await fetch(`/api/trilhas/${trailId}`);
        if (!response.ok) {
            if (response.status === 404) {
                trailDetailsDiv.innerHTML = '<h2>Trilha Não Encontrada</h2><p>A trilha que você está procurando não existe ou foi removida.</p>';
            } else {
                throw new Error(`Erro HTTP: ${response.status}`);
            }
            return;
        }
        const trilha = await response.json();
        renderTrailDetails(trilha);
    } catch (error) {
        console.error('Erro ao carregar detalhes da trilha:', error);
        trailDetailsDiv.innerHTML = '<p>Ocorreu um erro ao carregar os detalhes da trilha. Tente novamente mais tarde.</p>';
    }

    function renderTrailDetails(trilha) {
        trailDetailsDiv.innerHTML = `
            ${trilha.images && trilha.images[0] ? `<img src="${trilha.images[0]}" alt="${trilha.name}">` : ''}
            <h2>${trilha.name}</h2>
            <p><strong>Descrição:</strong> ${trilha.description || 'Sem descrição.'}</p>
            <p><strong>Local:</strong> ${trilha.location}</p>
            <p><strong>Dificuldade:</strong> ${trilha.difficulty}</p>
            <p><strong>Duração Estimada:</strong> ${trilha.durationHours} horas</p>
            <p><strong>Distância:</strong> ${trilha.distanceKm} km</p>
            ${trilha.elevationGainMeters ? `<p><strong>Ganho de Elevação:</strong> ${trilha.elevationGainMeters} metros</p>` : ''}
            ${trilha.pointsOfInterest && trilha.pointsOfInterest.length > 0 ? `
                <h3>Pontos de Interesse:</h3>
                <ul>
                    ${trilha.pointsOfInterest.map(poi => `<li>${poi}</li>`).join('')}
                </ul>
            ` : ''}
            <div class="map-placeholder">
                Mapa da Trilha aqui (Integração com Google Maps API, OpenStreetMap, etc.)
                </div>
            `;
        // Exemplo de como inicializar um mapa (requer script da API do mapa no HTML)
        // if (typeof initMap === 'function' && trilha.latitude && trilha.longitude) {
        //     initMap(trilha.latitude, trilha.longitude);
        // }
    }
});