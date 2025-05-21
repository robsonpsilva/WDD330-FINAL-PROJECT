document.addEventListener('DOMContentLoaded', () => {
    const trailsContainer = document.getElementById('trails-container');
    const searchInput = document.getElementById('search-input');
    const difficultyFilter = document.getElementById('difficulty-filter');
    const durationFilter = document.getElementById('duration-filter');
    const applyFiltersBtn = document.getElementById('apply-filters-btn');
    const findTrailsBtn = document.getElementById('find-trails-btn');

    // --- Verificação de Autenticação e Atualização da UI ---
    async function checkAuth() {
        try {
            const res = await fetch('/api/user'); // Crie esta rota no backend para retornar o usuário logado
            if (res.ok) {
                const user = await res.json();
                document.getElementById('auth-link').style.display = 'none';
                document.getElementById('logout-link').style.display = 'block';
                // Opcional: mostrar nome do usuário ou foto de perfil
                // const userProfileDiv = document.createElement('div');
                // userProfileDiv.innerHTML = `<span>Olá, ${user.name}!</span>`;
                // document.querySelector('nav ul').prepend(userProfileDiv);
            } else {
                document.getElementById('auth-link').style.display = 'block';
                document.getElementById('logout-link').style.display = 'none';
            }
        } catch (error) {
            console.error('Erro ao verificar autenticação:', error);
        }
    }
    checkAuth(); // Chama a função ao carregar a página

    // --- Notificações em Tempo Real (Socket.IO) ---
    const socket = io();
    socket.on('notification', (data) => {
        // Exibe a notificação para o usuário (pode ser um toast, um banner, etc.)
        if (data.userId && data.userId === 'ID_DO_USUARIO_LOGADO') { // Substitua 'ID_DO_USUARIO_LOGADO' pelo ID real do usuário
            alert(`Notificação: ${data.message}`);
        } else if (!data.userId) { // Notificação geral
            alert(`Notificação: ${data.message}`);
        }
    });

    // --- Carregar Trilhas ---
    async function loadTrails(filters = {}) {
        let queryString = '?';
        for (const key in filters) {
            if (filters[key]) {
                queryString += `${key}=${filters[key]}&`;
            }
        }
        queryString = queryString.slice(0, -1); // Remove o último '&'

        try {
            const response = await fetch(`/api/trilhas${queryString}`);
            const trilhas = await response.json();
            renderTrails(trilhas);
        } catch (error) {
            console.error('Erro ao carregar trilhas:', error);
            trailsContainer.innerHTML = '<p>Não foi possível carregar as trilhas no momento. Tente novamente mais tarde.</p>';
        }
    }

    function renderTrails(trilhas) {
        trailsContainer.innerHTML = ''; // Limpa os cards existentes
        if (trilhas.length === 0) {
            trailsContainer.innerHTML = '<p>Nenhuma trilha encontrada com os critérios selecionados.</p>';
            return;
        }
        trilhas.forEach(trilha => {
            const card = document.createElement('div');
            card.classList.add('card');
            card.innerHTML = `
                <img src="${trilha.images && trilha.images[0] ? trilha.images[0] : 'images/default-trail.jpg'}" alt="${trilha.name}">
                <h4>${trilha.name}</h4>
                <p>Nível: ${trilha.difficulty} | Duração: ${trilha.durationHours}h | Local: ${trilha.location}</p>
                <a href="/trilha/${trilha._id}">Ver Detalhes</a>
            `;
            trailsContainer.appendChild(card);
        });
    }

    // --- Event Listeners para Busca e Filtragem ---
    applyFiltersBtn.addEventListener('click', () => {
        const filters = {
            search: searchInput.value,
            difficulty: difficultyFilter.value,
            duration: durationFilter.value
        };
        loadTrails(filters);
    });

    // --- Geolocalização ---
    findTrailsBtn.addEventListener('click', () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(async (position) => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                // Para simplificar, vamos usar um raio fixo de 50km
                await loadTrails({ lat: lat, lon: lon, radius: 50 });
                alert(`Trilhas próximas à sua localização (${lat.toFixed(2)}, ${lon.toFixed(2)}) carregadas!`);
            }, (error) => {
                console.error('Erro ao obter localização:', error);
                alert('Não foi possível obter sua localização para encontrar trilhas próximas.');
                loadTrails(); // Carrega todas as trilhas se a geolocalização falhar
            });
        } else {
            alert('Seu navegador não suporta geolocalização.');
            loadTrails(); // Carrega todas as trilhas
        }
    });

    // Carrega as trilhas iniciais ao carregar a página
    loadTrails();
});