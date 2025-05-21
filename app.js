require('dotenv').config(); // Para carregar variáveis de ambiente
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const session = require('express-session');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const http = require('http'); // Importar http para Socket.IO
const socketIo = require('socket.io');
const axios = require('axios'); // Para fazer requisições a APIs externas

const app = express();
const server = http.createServer(app); // Criar servidor HTTP para Socket.IO
const io = socketIo(server); // Inicializar Socket.IO
const PORT = process.env.PORT || 3000;

// --- Conexão com o Banco de Dados (MongoDB) ---
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Conectado ao MongoDB'))
    .catch(err => console.error('Erro de conexão ao MongoDB:', err));

// --- Modelos (Mongoose) ---
// src/models/User.js (exemplo)
const User = require('./src/models/User');
// src/models/Trail.js (exemplo)
const Trail = require('./src/models/Trail');
// src/models/Product.js (exemplo)
const Product = require('./src/models/Product');
// src/models/Service.js (exemplo)
const Service = require('./src/models/Service');
// src/models/Reservation.js (exemplo)
const Reservation = require('./src/models/Reservation');

// --- Configuração da Sessão e Passport (OAuth Google) ---
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Use `true` em produção com HTTPS
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/callback"
},
async (accessToken, refreshToken, profile, done) => {
    try {
        let user = await User.findOne({ googleId: profile.id });
        if (!user) {
            user = new User({
                googleId: profile.id,
                name: profile.displayName,
                email: profile.emails[0].value,
                profilePicture: profile.photos[0].value
            });
            await user.save();
        }
        return done(null, user);
    } catch (error) {
        return done(error, null);
    }
}));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (error) {
        done(error, null);
    }
});

// Middleware para verificar autenticação
function isAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login'); // Redireciona para a página de login se não autenticado
}

// --- Middlewares ---
app.use(express.json()); // Para parsing de JSON no corpo da requisição
app.use(express.urlencoded({ extended: true })); // Para parsing de URL-encoded
app.use(express.static(path.join(__dirname, 'public'))); // Serve arquivos estáticos

// --- Rotas de Autenticação ---
app.get('/auth/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
);

app.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/login' }),
    (req, res) => {
        // Autenticação bem-sucedida, redireciona para a página principal
        res.redirect('/');
    }
);

app.get('/logout', (req, res) => {
    req.logout((err) => { // req.logout agora exige um callback
        if (err) { return next(err); }
        res.redirect('/');
    });
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// --- Rotas API para Trilhas ---
app.get('/api/trilhas', async (req, res) => {
    try {
        const { search, difficulty, duration, lat, lon, radius } = req.query;
        let query = {};

        // Filtro por busca
        if (search) {
            query.name = { $regex: search, $options: 'i' }; // Busca case-insensitive
        }
        // Filtro por dificuldade
        if (difficulty) {
            query.difficulty = difficulty;
        }
        // Filtro por duração (ex: duração máxima em horas)
        if (duration) {
            query.durationHours = { $lte: parseFloat(duration) };
        }

        // Filtro por geolocalização (exemplo básico com raio)
        if (lat && lon && radius) {
            // Em produção, use Geospatial Indexes do MongoDB para performance
            // Isso é um exemplo simplificado de filtro de proximidade
            const centerLat = parseFloat(lat);
            const centerLon = parseFloat(lon);
            const searchRadiusKm = parseFloat(radius);

            const allTrilhas = await Trail.find(query);
            const filteredByGeo = allTrilhas.filter(trilha => {
                const distance = calculateDistance(centerLat, centerLon, trilha.latitude, trilha.longitude);
                return distance <= searchRadiusKm;
            });
            return res.json(filteredByGeo);
        }

        const trilhas = await Trail.find(query);
        res.json(trilhas);
    } catch (error) {
        console.error('Erro ao buscar trilhas:', error);
        res.status(500).json({ message: 'Erro interno do servidor.' });
    }
});

// Rota para detalhes da trilha
app.get('/api/trilhas/:id', async (req, res) => {
    try {
        const trilha = await Trail.findById(req.params.id);
        if (!trilha) {
            return res.status(404).json({ message: 'Trilha não encontrada.' });
        }
        res.json(trilha);
    } catch (error) {
        console.error('Erro ao buscar detalhes da trilha:', error);
        res.status(500).json({ message: 'Erro interno do servidor.' });
    }
});

// --- Rotas API para Produtos (E-commerce) ---
app.get('/api/produtos', async (req, res) => {
    try {
        const produtos = await Product.find();
        res.json(produtos);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar produtos.' });
    }
});

// Simulação de compra (E-commerce básico)
app.post('/api/comprar-produto', isAuthenticated, async (req, res) => {
    const { productId, quantity } = req.body;
    // Lógica real de processamento de pagamento e atualização de estoque
    console.log(`Usuário ${req.user.name} comprou ${quantity} de ${productId}`);
    io.emit('notification', { userId: req.user.id, message: 'Sua compra foi realizada com sucesso!' });
    res.json({ message: 'Compra processada (simulado).' });
});

// --- Rotas API para Serviços (Reservas/Agendamentos) ---
app.get('/api/servicos', async (req, res) => {
    try {
        const servicos = await Service.find();
        res.json(servicos);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar serviços.' });
    }
});

// Agendamento de serviço
app.post('/api/agendar-servico', isAuthenticated, async (req, res) => {
    const { serviceId, date, time } = req.body;
    try {
        const newReservation = new Reservation({
            userId: req.user.id,
            serviceId,
            date,
            time,
            status: 'pending'
        });
        await newReservation.save();
        io.emit('notification', { userId: req.user.id, message: 'Seu agendamento foi registrado com sucesso!' });
        res.status(201).json({ message: 'Agendamento realizado com sucesso!', reservation: newReservation });
    } catch (error) {
        console.error('Erro ao agendar serviço:', error);
        res.status(500).json({ message: 'Erro ao agendar serviço.' });
    }
});


// --- Notificações em tempo real (Socket.IO) ---
io.on('connection', (socket) => {
    console.log('Um usuário conectado via WebSocket');

    // Você pode enviar notificações específicas para o usuário conectado
    // Ex: socket.emit('welcome', 'Bem-vindo ao Hiking Explorer!');

    socket.on('disconnect', () => {
        console.log('Usuário desconectado do WebSocket');
    });
});


// --- Servindo as páginas HTML ---
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// As rotas de produtos e serviços agora podem consumir as APIs
app.get('/produtos', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'produtos.html'));
});

app.get('/servicos', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'servicos.html'));
});

// Rota de fallback para qualquer outra coisa (single page app)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Adicione esta rota ao app.js
app.get('/trilha/:id', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'trail-details.html'));
});

// --- Função auxiliar para cálculo de distância (Haversine) ---
// Para um cálculo mais preciso e robusto, considere bibliotecas como `geolib`
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Raio da Terra em km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return distance; // Distância em km
}


server.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});