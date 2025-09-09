const express = require('express');
const mongoose = require('mongoose');
const { Client, RemoteAuth } = require('whatsapp-web.js');
const { MongoStore } = require('wwebjs-mongo');
const qrcodeTerminal = require('qrcode-terminal');
const QRCode = require('qrcode');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para JSON
app.use(express.json());

let lastQR = null; // guarda QR para a rota

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

        // QR Code
        client.on('qr', (qr) => {
            lastQR = qr;
            console.log('📲 QR Code gerado, acesse /qr para visualizar ou use QR no terminal:');
            qrcodeTerminal.generate(qr, { small: true });

            // Expira o QR após 5 minutos
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

        // Rota teste
        app.get('/', (req, res) => {
            res.send('🚀 API do WhatsApp rodando!');
        });

        // Rota QR Code
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

        // Rota para pegar foto de perfil
        app.get('/getPhoto', async (req, res) => {
            try {
                const numero = req.query.numero; // ex: 5511999999999
                if (!numero) return res.status(400).json({ error: 'Número não informado' });

                if (!client.info) {
                    return res.status(400).json({ error: 'Cliente ainda não está pronto' });
                }

                const jid = `${numero}@c.us`;
                const url = await client.getProfilePicUrl(jid).catch(() => null);

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
