// public/js/app.js

document.addEventListener('DOMContentLoaded', () => {
    // --- Elementos do DOM ---
    const appContainer = document.querySelector('.app-container');
    const appMainContent = document.getElementById('app-main-content');
    const menuToggle = document.getElementById('menu-toggle');
    const sidebar = document.getElementById('sidebar');
    const closeSidebarBtn = document.getElementById('close-sidebar-btn');

    // Seletores mais específicos para evitar conflitos se a navegação for duplicada
    const desktopNavLinks = document.querySelectorAll('.desktop-nav .nav-link');
    const sidebarNavLinks = document.querySelectorAll('#sidebar .nav-link');

    // Elementos de autenticação
    const authLinkHeader = document.getElementById('auth-link-header');
    const logoutLinkHeader = document.getElementById('logout-link-header');
    const authLinkSidebar = document.getElementById('auth-link-sidebar');
    const logoutLinkSidebar = document.getElementById('logout-link-sidebar');

    const toastContainer = document.getElementById('toast-container');
    const socket = io(); // Conexão Socket.IO

    // --- Estado da Aplicação (Simples) ---
    let currentUser = null;

    // --- Notificações em Tempo Real (Socket.IO) ---
    socket.on('notification', (data) => {
        if (currentUser && data.userId === currentUser._id) {
            showToastNotification(`Você: ${data.message}`, 'success');
        } else if (!data.userId) {
            showToastNotification(`Info: ${data.message}`, 'info');
        }
    });

    function showToastNotification(message, type = 'info') {
        if (!toastContainer) {
            console.error('Elemento #toast-container não encontrado.');
            return;
        }

        const toast = document.createElement('div');
        toast.classList.add('toast', type);
        toast.textContent = message;

        toastContainer.appendChild(toast);

        setTimeout(() => {
            toast.remove();
        }, 5000);
    }

    // --- Funções de Controle do Menu Hamburger ---
    function openSidebar() {
        appContainer.classList.add('sidebar-open');
        // Cria e adiciona o overlay
        const overlay = document.createElement('div');
        overlay.classList.add('sidebar-overlay');
        appContainer.appendChild(overlay);
        overlay.addEventListener('click', closeSidebar); // Clica no overlay para fechar
    }

    function closeSidebar() {
        appContainer.classList.remove('sidebar-open');
        const overlay = document.querySelector('.sidebar-overlay');
        if (overlay) {
            overlay.removeEventListener('click', closeSidebar); // Remove listener para evitar vazamentos
            overlay.remove();
        }
    }

    // --- Funções de Renderização de Conteúdo ---
    // Essas funções agora apenas renderizam o conteúdo no 'appMainContent'
    // Você não precisa mais do `script.js` e `trail-details.js` separados;
    // toda a lógica de renderização estará aqui para as rotas SPA.

    // A renderização da página inicial pode ser mais simples se o HTML já a contiver
    async function renderHomePage() {
        // Se o conteúdo da home já está no HTML, não precisa re-renderizá-lo aqui
        // Mas se quiser que o JS carregue, descomente o bloco abaixo.
        // Por agora, vamos assumir que o HTML inicial já é a home.
        // Você só chamaria loadTrails() para popular o cards-container
        const trailsContainer = document.getElementById('trails-container');
        if (trailsContainer && trailsContainer.innerHTML === '<p>Carregando trilhas...</p>') {
             loadTrails(); // Carrega as trilhas se ainda não foram carregadas
        }
        setupHomePageListeners(); // Anexa listeners aos elementos da home
    }

    async function renderProductsPage() {
        appMainContent.innerHTML = `
            <section class="product-page">
                <h2>Nossos Produtos para Sua Aventura</h2>
                <div class="product-grid" id="product-grid">
                    <p>Carregando produtos...</p>
                </div>
            </section>
        `;
        await loadProducts(); // Garante que produtos sejam carregados antes de continuar
    }

    async function renderServicesPage() {
        appMainContent.innerHTML = `
            <section class="services-page">
                <h2>Nossos Serviços para Você</h2>
                <div class="service-grid" id="service-grid">
                    <p>Carregando serviços...</p>
                </div>
            </section>
        `;
        await loadServices();
    }

    async function renderTrailDetailsPage(id) {
        appMainContent.innerHTML = `
            <div class="trail-details-container" id="trail-details">
                <h2>Carregando Detalhes da Trilha...</h2>
            </div>
        `;
        await loadTrailDetails(id);
    }

    function renderLoginPage() {
        appMainContent.innerHTML = `
            <div class="login-container">
                <h2>Faça Login para Acessar</h2>
                <a href="/auth/google" class="login-button">
                    <img src="images/google-icon.png" alt="Google Icon">
                    Entrar com Google
                </a>
                <p style="margin-top: 20px; font-size: 0.9em;">Ao fazer login, você concorda com nossos termos de uso.</p>
            </div>
        `;
    }

    function renderNotFoundPage() {
        appMainContent.innerHTML = `
            <section class="not-found">
                <h2>Página Não Encontrada (404)</h2>
                <p>Parece que você se perdeu na trilha! A página que você procura não existe.</p>
                <a href="/" class="btn-cta nav-link">Voltar para a Home</a>
            </section>
        `;
        attachNavLinkListeners(appMainContent); // Garante que o novo link seja clicável via SPA
    }

    // --- Funções de Carregamento de Dados (as mesmas da resposta anterior) ---

    async function loadTrails(filters = {}) {
        const trailsContainer = document.getElementById('trails-container');
        if (!trailsContainer) return;

        trailsContainer.innerHTML = '<p>Buscando trilhas...</p>';

        let queryString = '?';
        for (const key in filters) {
            if (filters[key]) {
                queryString += `${key}=${filters[key]}&`;
            }
        }
        queryString = queryString.slice(0, -1);

        try {
            const response = await fetch(`/api/trilhas${queryString}`);
            if (!response.ok) throw new Error('Erro ao carregar trilhas.');
            const trilhas = await response.json();
            renderTrailCards(trilhas);
        } catch (error) {
            console.error('Erro ao carregar trilhas:', error);
            trailsContainer.innerHTML = '<p>Não foi possível carregar as trilhas no momento. Tente novamente mais tarde.</p>';
        }
    }

    function renderTrailCards(trilhas) {
        const trailsContainer = document.getElementById('trails-container');
        if (!trailsContainer) return;

        trailsContainer.innerHTML = '';
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
                <a href="/trilha/${trilha._id}" class="nav-link">Ver Detalhes</a>
            `;
            trailsContainer.appendChild(card);
        });
        attachNavLinkListeners(trailsContainer); // Re-anexa listeners para novos links de trilhas
    }

    async function loadTrailDetails(id) {
        const trailDetailsDiv = document.getElementById('trail-details');
        if (!trailDetailsDiv) return;

        trailDetailsDiv.innerHTML = '<h2>Carregando Detalhes da Trilha...</h2>';

        try {
            const response = await fetch(`/api/trilhas/${id}`);
            if (!response.ok) {
                if (response.status === 404) {
                    trailDetailsDiv.innerHTML = '<h2>Trilha Não Encontrada</h2><p>A trilha que você está procurando não existe ou foi removida.</p>';
                } else {
                    throw new Error(`Erro HTTP: ${response.status}`);
                }
                return;
            }
            const trilha = await response.json();
            renderTrailDetailsContent(trilha);
        } catch (error) {
            console.error('Erro ao carregar detalhes da trilha:', error);
            trailDetailsDiv.innerHTML = '<p>Ocorreu um erro ao carregar os detalhes da trilha. Tente novamente mais tarde.</p>';
        }
    }

    function renderTrailDetailsContent(trilha) {
        const trailDetailsDiv = document.getElementById('trail-details');
        if (!trailDetailsDiv) return;

        trailDetailsDiv.innerHTML = `
            ${trilha.images && trilha.images[0] ? `<img src="${trilha.images[0]}" alt="${trilha.name}">` : ''}
            <h2>${trilha.name}</h2>
            <p><strong>Descrição:</strong> ${trilha.description || 'Sem descrição.'}</p>
            <p><strong>Local:</strong> ${trilha.location}</p>
            <p><strong>Dificuldade:</strong> ${trilha.difficulty} | Duração Estimada: ${trilha.durationHours} horas | Distância: ${trilha.distanceKm} km</p>
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
    }

    async function loadProducts() {
        const productGrid = document.getElementById('product-grid');
        if (!productGrid) return;

        productGrid.innerHTML = '<p>Buscando produtos...</p>';

        try {
            const response = await fetch('/api/produtos');
            if (!response.ok) throw new Error('Erro ao carregar produtos.');
            const products = await response.json();
            renderProductCards(products);
        } catch (error) {
            console.error('Erro ao carregar produtos:', error);
            productGrid.innerHTML = '<p>Não foi possível carregar os produtos no momento. Tente novamente mais tarde.</p>';
        }
    }

    function renderProductCards(products) {
        const productGrid = document.getElementById('product-grid');
        if (!productGrid) return;

        productGrid.innerHTML = '';
        if (products.length === 0) {
            productGrid.innerHTML = '<p>Nenhum produto encontrado.</p>';
            return;
        }
        products.forEach(product => {
            const card = document.createElement('div');
            card.classList.add('product-card');
            card.innerHTML = `
                <img src="${product.imageUrl || 'images/default-product.jpg'}" alt="${product.name}">
                <h3>${product.name}</h3>
                <p>${product.description}</p>
                <span>R$ ${product.price.toFixed(2)}</span>
                <button data-product-id="${product._id}" class="buy-product-btn">Adicionar ao Carrinho</button>
            `;
            productGrid.appendChild(card);
        });
        attachProductBuyListeners(productGrid);
    }

    async function loadServices() {
        const serviceGrid = document.getElementById('service-grid');
        if (!serviceGrid) return;

        serviceGrid.innerHTML = '<p>Buscando serviços...</p>';

        try {
            const response = await fetch('/api/servicos');
            if (!response.ok) throw new Error('Erro ao carregar serviços.');
            const services = await response.json();
            renderServiceCards(services);
        } catch (error) {
            console.error('Erro ao carregar serviços:', error);
            serviceGrid.innerHTML = '<p>Não foi possível carregar os serviços no momento. Tente novamente mais tarde.</p>';
        }
    }

    function renderServiceCards(services) {
        const serviceGrid = document.getElementById('service-grid');
        if (!serviceGrid) return;

        serviceGrid.innerHTML = '';
        if (services.length === 0) {
            serviceGrid.innerHTML = '<p>Nenhum serviço encontrado.</p>';
            return;
        }
        services.forEach(service => {
            const card = document.createElement('div');
            card.classList.add('service-card');
            card.innerHTML = `
                <h3>${service.name}</h3>
                <p>${service.description}</p>
                <ul>
                    <li>Tipo: ${service.type}</li>
                    ${service.price ? `<li>Preço: R$ ${service.price.toFixed(2)}</li>` : ''}
                </ul>
                <button data-service-id="${service._id}" class="schedule-service-btn">Saiba Mais / Agendar</button>
            `;
            serviceGrid.appendChild(card);
        });
        attachServiceScheduleListeners(serviceGrid);
    }


    // --- Event Listeners Dinâmicos (da resposta anterior) ---

    function setupHomePageListeners() {
        const searchInput = document.getElementById('search-input');
        const difficultyFilter = document.getElementById('difficulty-filter');
        const durationFilter = document.getElementById('duration-filter');
        const applyFiltersBtn = document.getElementById('apply-filters-btn');
        const findTrailsBtn = document.getElementById('find-trails-btn');

        if (applyFiltersBtn) {
            applyFiltersBtn.addEventListener('click', () => {
                const filters = {
                    search: searchInput.value,
                    difficulty: difficultyFilter.value,
                    duration: durationFilter.value
                };
                loadTrails(filters);
            });
        }

        if (findTrailsBtn) {
            findTrailsBtn.addEventListener('click', () => {
                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(async (position) => {
                        const lat = position.coords.latitude;
                        const lon = position.coords.longitude;
                        await loadTrails({ lat: lat, lon: lon, radius: 50 });
                        showToastNotification(`Trilhas próximas à sua localização (${lat.toFixed(2)}, ${lon.toFixed(2)}) carregadas!`, 'info');
                    }, (error) => {
                        console.error('Erro ao obter localização:', error);
                        showToastNotification('Não foi possível obter sua localização. Exibindo todas as trilhas.', 'warning');
                        loadTrails();
                    });
                } else {
                    showToastNotification('Seu navegador não suporta geolocalização. Exibindo todas as trilhas.', 'warning');
                    loadTrails();
                }
            });
        }
    }

    function attachProductBuyListeners(container) {
        container.querySelectorAll('.buy-product-btn').forEach(button => {
            button.addEventListener('click', async (event) => {
                const productId = event.target.dataset.productId;
                if (!currentUser) {
                    showToastNotification('Você precisa estar logado para comprar produtos.', 'error');
                    navigateTo('/login');
                    return;
                }
                showToastNotification(`Comprando produto ${productId}... (Simulado)`, 'info');
                try {
                    const response = await fetch('/api/comprar-produto', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ productId, quantity: 1 })
                    });
                    const data = await response.json();
                    if (response.ok) {
                        showToastNotification(data.message, 'success');
                    } else {
                        showToastNotification(data.message || 'Erro ao processar compra.', 'error');
                    }
                } catch (error) {
                    console.error('Erro na requisição de compra:', error);
                    showToastNotification('Erro de conexão ao processar compra.', 'error');
                }
            });
        });
    }

    function attachServiceScheduleListeners(container) {
        container.querySelectorAll('.schedule-service-btn').forEach(button => {
            button.addEventListener('click', async (event) => {
                const serviceId = event.target.dataset.serviceId;
                if (!currentUser) {
                    showToastNotification('Você precisa estar logado para agendar serviços.', 'error');
                    navigateTo('/login');
                    return;
                }
                showToastNotification(`Agendando serviço ${serviceId}... (Simulado)`, 'info');
                const mockDate = new Date().toISOString().split('T')[0];
                const mockTime = "14:00";

                try {
                    const response = await fetch('/api/agendar-servico', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ serviceId, date: mockDate, time: mockTime })
                    });
                    const data = await response.json();
                    if (response.ok) {
                        showToastNotification(data.message, 'success');
                    } else {
                        showToastNotification(data.message || 'Erro ao agendar serviço.', 'error');
                    }
                } catch (error) {
                    console.error('Erro na requisição de agendamento:', error);
                    showToastNotification('Erro de conexão ao agendar serviço.', 'error');
                }
            });
        });
    }


    // --- Roteamento Cliente-Side (SPA) ---

    const routes = {
        '/': renderHomePage,
        '/produtos': renderProductsPage,
        '/servicos': renderServicesPage,
        '/login': renderLoginPage,
        '/trilha/:id': renderTrailDetailsPage,
        '404': renderNotFoundPage
    };

    function navigateTo(url) {
        history.pushState(null, '', url);
        handleLocation();
    }

    async function handleLocation() {
        const path = window.location.pathname;
        let routeHandler = routes[path];

        if (!routeHandler) {
            const dynamicRouteMatch = path.match(/^\/trilha\/([a-f\d]{24})$/);
            if (dynamicRouteMatch) {
                const trailId = dynamicRouteMatch[1];
                routeHandler = () => renderTrailDetailsPage(trailId);
            }
        }

        if (routeHandler) {
            await routeHandler();
        } else {
            renderNotFoundPage();
        }

        // Fecha a sidebar após navegar, se estiver aberta
        if (appContainer.classList.contains('sidebar-open')) {
            closeSidebar();
        }
    }

    // Anexa listeners a TODOS os links com a classe 'nav-link'
    function attachNavLinkListeners(container = document) {
        container.querySelectorAll('.nav-link').forEach(link => {
            link.removeEventListener('click', handleNavLinkClick); // Evita duplicar
            link.addEventListener('click', handleNavLinkClick);
        });
    }

    function handleNavLinkClick(event) {
        const href = event.target.getAttribute('href');
        // Previne navegação padrão apenas para links internos que controlamos
        if (href && !href.startsWith('http') && !href.startsWith('//') && !href.startsWith('/auth/google') && !href.startsWith('/logout')) {
            event.preventDefault();
            navigateTo(href);
        }
    }

    function handleLogoutClick(event) {
        event.preventDefault();
        window.location.href = '/logout'; // Permite que o servidor limpe a sessão
    }

    // --- Verificação de Autenticação e Atualização da UI ---
    async function checkAuth() {
        try {
            const res = await fetch('/api/user');
            if (res.ok) {
                currentUser = await res.json();
                // Oculta login, mostra logout nos dois menus
                if (authLinkHeader) authLinkHeader.style.display = 'none';
                if (logoutLinkHeader) logoutLinkHeader.style.display = 'block';
                if (authLinkSidebar) authLinkSidebar.style.display = 'none';
                if (logoutLinkSidebar) logoutLinkSidebar.style.display = 'block';
                showToastNotification(`Bem-vindo, ${currentUser.name}!`, 'success');
            } else {
                currentUser = null;
                // Mostra login, oculta logout nos dois menus
                if (authLinkHeader) authLinkHeader.style.display = 'block';
                if (logoutLinkHeader) logoutLinkHeader.style.display = 'none';
                if (authLinkSidebar) authLinkSidebar.style.display = 'block';
                if (logoutLinkSidebar) logoutLinkSidebar.style.display = 'none';
            }
        } catch (error) {
            console.error('Erro ao verificar autenticação:', error);
            currentUser = null;
        }
        // Anexa os listeners de logout APÓS verificar a autenticação
        if (logoutLinkHeader) logoutLinkHeader.addEventListener('click', handleLogoutClick);
        if (logoutLinkSidebar) logoutLinkSidebar.addEventListener('click', handleLogoutClick);
    }

    // --- Inicialização da Aplicação ---
    // Adiciona listeners para abrir e fechar o menu hamburger
    menuToggle.addEventListener('click', openSidebar);
    closeSidebarBtn.addEventListener('click', closeSidebar);

    // Adiciona listener para o evento popstate (botões de voltar/avançar do navegador)
    window.addEventListener('popstate', handleLocation);

    // Primeiro, verifica a autenticação
    checkAuth().then(() => {
        // Depois, lida com a rota inicial para renderizar o conteúdo
        handleLocation();
        // Anexa listeners para os links de navegação estáticos iniciais
        // tanto no header quanto na sidebar
        attachNavLinkListeners(document.querySelector('header'));
        attachNavLinkListeners(sidebar);
    });

});