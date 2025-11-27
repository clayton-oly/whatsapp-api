// index.js
const express = require('express');
const mongoose = require('mongoose');
const { Client, RemoteAuth } = require('whatsapp-web.js');
const { MongoStore } = require('wwebjs-mongo');
const qrcodeTerminal = require('qrcode-terminal');
const QRCode = require('qrcode');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// ================================
// MIDDLEWARES
// ================================
app.use(express.json());
app.use(cors());

// ================================
// CONEXÃO MONGO
// ================================
const MONGO_URI = process.env.MONGO_URI ||
    "mongodb+srv://whatsappUser:wYvXsBArkDTQ8a0C@cluster0.afuoeud.mongodb.net/?retryWrites=true&w=majority";

let lastQR = null;
let client;

async function start() {
    try {
        if (!MONGO_URI) throw new Error('MONGO_URI não definido!');

        await mongoose.connect(MONGO_URI, {
            serverSelectionTimeoutMS: 30000,
            maxPoolSize: 10,
            minPoolSize: 1,
            socketTimeoutMS: 45000,
            heartbeatFrequencyMS: 10000,
        });

        console.log('📦 Conectado ao MongoDB Atlas');

        const store = new MongoStore({
            mongoose,
            collectionName: 'whatsappSessions',
        });

        client = new Client({
            authStrategy: new RemoteAuth({
                store,
                backupSyncIntervalMs: 60000,
            }),
            puppeteer: {
                args: ['--no-sandbox', '--disable-setuid-sandbox'],
            }
        });

        // ================================
        // EVENTOS
        // ================================
        client.on('qr', (qr) => {
            lastQR = qr;
            console.log('📲 QR Code gerado!');
            qrcodeTerminal.generate(qr, { small: true });

            setTimeout(() => { lastQR = null; }, 300000); // expira em 5 min
        });

        client.on('ready', () => {
            console.log('✅ Bot conectado ao WhatsApp!');
        });

        client.on('auth_failure', (msg) => {
            console.log('⚠️ Falha na autenticação:', msg);
        });

        client.on('remote_session_saved', () => {
            console.log("💾 Sessão salva com sucesso no MongoDB!");
        });

        client.on('disconnected', (reason) => {
            console.log('❌ Cliente desconectado:', reason);
            console.log('⌛ Aguardando reconexão automática via RemoteAuth...');
        });

        client.initialize();

        // ================================
        // ROTAS
        // ================================
        app.get('/', (req, res) => {
            res.send('🚀 API do WhatsApp rodando!');
        });

        app.get('/qr', async (req, res) => {
            if (!lastQR) return res.send('QR Code não disponível no momento.');
            try {
                const qrImage = await QRCode.toDataURL(lastQR);
                res.send(`<h1>Escaneie o QR Code</h1><img src="${qrImage}" />`);
            } catch (e) {
                res.status(500).send('Erro ao gerar QR');
            }
        });

        app.get('/getPhoto', async (req, res) => {
            try {
                const numero = req.query.numero;
                if (!numero) return res.status(400).send('Número não informado');

                if (!client.info) throw new Error('Cliente não está pronto');

                const jid = `${numero}@c.us`;
                const url = await client.getProfilePicUrl(jid).catch(() => null);

                if (!url) return res.status(404).send('Sem foto');

                const response = await axios.get(url, { responseType: 'arraybuffer' });
                res.set('Content-Type', 'image/jpeg');
                res.send(response.data);

            } catch (err) {
                console.error(err);
                res.status(500).send({ error: err.message || 'Erro ao buscar foto' });
            }
        });

        // ================================
        // SERVIDOR
        // ================================
        app.listen(PORT, () => console.log(`🚀 Servidor rodando na porta ${PORT}`));

    } catch (err) {
        console.error('❌ Erro geral:', err);
        process.exit(1);
    }
}

start();
