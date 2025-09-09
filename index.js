const express = require('express');
const mongoose = require('mongoose');
const { Client, RemoteAuth } = require('whatsapp-web.js');
const { MongoStore } = require('wwebjs-mongo');
const qrcode = require('qrcode-terminal');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

async function start() {
    try {
        // 🔗 Conecta ao MongoDB Atlas
        await mongoose.connect(process.env.MONGO_URI);
        console.log('📦 Conectado ao MongoDB Atlas');

        // 🔑 Store para sessões
        const store = new MongoStore({ mongoose });

        // Cliente WhatsApp
        const client = new Client({
            authStrategy: new RemoteAuth({
                store,
                backupSyncIntervalMs: 300000 // sincroniza a cada 5 min
            }),
            puppeteer: {
                args: ['--no-sandbox', '--disable-setuid-sandbox'],
            }
        });

        // QR Code no terminal na primeira vez
        client.on('qr', (qr) => {
            qrcode.generate(qr, { small: true });
        });

        client.on('ready', () => {
            console.log('✅ Bot conectado ao WhatsApp!');
        });

        // Inicializa cliente
        client.initialize();

        // Rotas
        app.get('/', (req, res) => {
            res.send('🚀 API do WhatsApp rodando!');
        });

        app.get('/getPhoto', async (req, res) => {
            try {
                const numero = req.query.numero; // ex: 5511999999999
                if (!numero) return res.status(400).json({ error: 'Número não informado' });

                const jid = `${numero}@c.us`;
                const url = await client.getProfilePicUrl(jid);

                if (url) {
                    res.json({ numero, foto: url });
                } else {
                    res.json({ numero, foto: null, msg: 'Sem foto pública ou número inexistente' });
                }
            } catch (err) {
                console.error(err);
                res.status(500).json({ error: 'Erro ao buscar foto' });
            }
        });

        app.listen(PORT, () => console.log(`🚀 Servidor rodando na porta ${PORT}`));
    } catch (err) {
        console.error('❌ Erro ao conectar no MongoDB:', err);
        process.exit(1);
    }
}

start();
