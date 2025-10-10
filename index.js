// index.js
const express = require('express');
const mongoose = require('mongoose');
const { Client, RemoteAuth } = require('whatsapp-web.js');
const { MongoStore } = require('wwebjs-mongo');
const qrcodeTerminal = require('qrcode-terminal');
const QRCode = require('qrcode');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

// Conexão com MongoDB Atlas
const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://whatsappUser:wYvXsBArkDTQ8a0C@cluster0.afuoeud.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

app.use(express.json());

let lastQR = null; // guarda QR temporário
let client;       // client WhatsApp global

// ================================
// INICIALIZAÇÃO
// ================================
async function start() {
    try {
        if (!MONGO_URI) throw new Error('MONGO_URI não definido!');

        await mongoose.connect(MONGO_URI);
        console.log('📦 Conectado ao MongoDB Atlas');

        const store = new MongoStore({ mongoose });

        client = new Client({
            authStrategy: new RemoteAuth({
                store,
                backupSyncIntervalMs: 300000, // 5 minutos
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
            console.log('📲 QR Code gerado, acesse /qr ou use no terminal:');
            qrcodeTerminal.generate(qr, { small: true });

            // Expira QR após 5 min
            setTimeout(() => { lastQR = null; }, 5 * 60 * 1000);
        });

        client.on('ready', () => {
            console.log('✅ Bot conectado ao WhatsApp!');
        });

        client.on('disconnected', (reason) => {
            console.log('❌ Cliente desconectado:', reason);
            client.destroy();
            client.initialize();
        });

        client.initialize();

        // ================================
        // ROTAS
        // ================================

        // Rota teste
        app.get('/', (req, res) => res.send('🚀 API do WhatsApp rodando!'));

        // QR Code
        app.get('/qr', async (req, res) => {
            if (!lastQR) return res.send('QR Code ainda não gerado ou expirado.');
            try {
                const qrImage = await QRCode.toDataURL(lastQR);
                res.send(`<h1>Escaneie o QR Code no WhatsApp</h1><img src="${qrImage}" alt="QR Code WhatsApp"/>`);
            } catch (err) {
                console.error('Erro ao gerar QR:', err);
                res.status(500).send('Erro ao gerar QR Code');
            }
        });

        // ================================
        // Proxy de foto do WhatsApp (aguarda client pronto)
        // ================================
        app.get('/getPhoto', async (req, res) => {
            try {
                const numero = req.query.numero;
                if (!numero) return res.status(400).send('Número não informado');

                // Aguarda client ficar pronto
                const waitClientReady = async (timeout = 30000) => {
                    const interval = 500;
                    const maxTries = timeout / interval;
                    let tries = 0;

                    while (!client.info && tries < maxTries) {
                        await new Promise(r => setTimeout(r, interval));
                        tries++;
                    }

                    if (!client.info) throw new Error('Cliente WhatsApp não ficou pronto a tempo');
                };

                await waitClientReady();

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
        console.error('❌ Erro ao conectar no MongoDB:', err);
        process.exit(1);
    }
}

start();
