Whatsapp Api Readme
🚀 WhatsApp API com Node.js + MongoDB Atlas

API para consultar fotos de perfil do WhatsApp e gerenciar sessão via MongoDB Atlas. Também permite gerar o QR Code diretamente no navegador.

✨ Funcionalidades

✅ Consultar foto de perfil de números WhatsApp públicos

✅ Salvar sessão no MongoDB Atlas (sem precisar escanear QR Code toda vez)

✅ Gerar QR Code em rota HTTP (/qr) para escanear com celular

✅ Endpoint REST fácil de usar

💻 Tecnologias

Node.js + Express

MongoDB Atlas

whatsapp-web.js

wwebjs-mongo

qrcode & qrcode-terminal

dotenv

⚡ Instalação Local

Clone o repositório:

git clone <seu-repo-url>
cd whatsapp-api

Instale as dependências:

npm install

Crie um arquivo .env na raiz do projeto:

PORT=3000
MONGO_URI=mongodb+srv://<usuario>:<senha>@cluster0.abcd123.mongodb.net/whatsapp?retryWrites=true&w=majority

Substitua <usuario> e <senha> pelos dados do seu MongoDB Atlas.

Inicie o servidor:

npm start

Teste os endpoints:

http://localhost:3000/ → API rodando

http://localhost:3000/qr → QR Code WhatsApp

http://localhost:3000/getPhoto?numero=5511999999999 → busca foto de perfil

☁️ Deploy no Render

Crie um repositório GitHub com o projeto.

Crie um Web Service no Render e conecte o repositório.

Configure Environment Variables:

MONGO_URI=<sua conexão Atlas>
PORT=10000

Deploy → abra https://SEUAPP.onrender.com/qr para escanear QR Code (primeira vez).

Depois, use /getPhoto?numero=... normalmente.

🎨 Estrutura do Projeto
whatsapp-api/
│── package.json
│── index.js
│── .gitignore
│── README.md
📌 Observações

O número consultado precisa ter WhatsApp e foto de perfil pública.

A sessão é salva no MongoDB, evitando necessidade de escanear QR Code toda vez.

Evite uso abusivo para não ter seu número banido.

🎥 Demonstração (Exemplo de uso)
1. Acessando QR Code




2. Buscando Foto de Perfil




📚 Referências

whatsapp-web.js

wwebjs-mongo

MongoDB Atlas
