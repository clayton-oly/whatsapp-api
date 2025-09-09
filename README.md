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
<<<<<<< HEAD
```

2. Instale as dependências:

```bash
npm install
```

3. Crie um arquivo `.env` na raiz do projeto:

```
PORT=3000
MONGO_URI=mongodb+srv://<usuario>:<senha>@cluster0.abcd123.mongodb.net/whatsapp?retryWrites=true&w=majority
```
=======

Instale as dependências:

npm install

Crie um arquivo .env na raiz do projeto:

PORT=3000
MONGO_URI=mongodb+srv://<usuario>:<senha>@cluster0.abcd123.mongodb.net/whatsapp?retryWrites=true&w=majority

Substitua <usuario> e <senha> pelos dados do seu MongoDB Atlas.
>>>>>>> c39473c681d1ba55b77c599087ea3bbacf908bbf

> Substitua `<usuario>` e `<senha>` pelos dados do seu MongoDB Atlas.

<<<<<<< HEAD
4. Inicie o servidor:

```bash
npm start
```
=======
npm start

Teste os endpoints:
>>>>>>> c39473c681d1ba55b77c599087ea3bbacf908bbf

5. Teste os endpoints:

- `http://localhost:3000/` → API rodando  
- `http://localhost:3000/qr` → QR Code WhatsApp  
- `http://localhost:3000/getPhoto?numero=5511999999999` → busca foto de perfil

---

<<<<<<< HEAD
## ☁️ Deploy no Render
=======
☁️ Deploy no Render

Crie um repositório GitHub com o projeto.
>>>>>>> c39473c681d1ba55b77c599087ea3bbacf908bbf

1. Crie um repositório GitHub com o projeto.
2. Crie um **Web Service** no Render e conecte o repositório.
3. Configure **Environment Variables**:

<<<<<<< HEAD
```
MONGO_URI=<sua conexão Atlas>
PORT=10000
```
=======
Configure Environment Variables:

MONGO_URI=<sua conexão Atlas>
PORT=10000

Deploy → abra https://SEUAPP.onrender.com/qr para escanear QR Code (primeira vez).
>>>>>>> c39473c681d1ba55b77c599087ea3bbacf908bbf

4. Deploy → abra `https://SEUAPP.onrender.com/qr` para escanear QR Code (primeira vez).  
5. Depois, use `/getPhoto?numero=...` normalmente.

<<<<<<< HEAD
---

## 🎨 Estrutura do Projeto

```
=======
🎨 Estrutura do Projeto
>>>>>>> c39473c681d1ba55b77c599087ea3bbacf908bbf
whatsapp-api/
│── package.json
│── index.js
│── .gitignore
│── README.md
<<<<<<< HEAD
```
=======
📌 Observações

O número consultado precisa ter WhatsApp e foto de perfil pública.
>>>>>>> c39473c681d1ba55b77c599087ea3bbacf908bbf

---

## 📌 Observações

- O número consultado precisa ter WhatsApp e foto de perfil pública.  
- A sessão é salva no MongoDB, evitando necessidade de escanear QR Code toda vez.  
- Evite uso abusivo para não ter seu número banido.

<<<<<<< HEAD
---

## 📚 Referências
=======



2. Buscando Foto de Perfil




📚 Referências

whatsapp-web.js
>>>>>>> c39473c681d1ba55b77c599087ea3bbacf908bbf

- [whatsapp-web.js](https://github.com/pedroslopez/whatsapp-web.js)  
- [wwebjs-mongo](https://github.com/open-wa/wwebjs-mongo)  
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)

<<<<<<< HEAD
---

**Observação:** Para baixar este README, clique em **"Raw"** no GitHub e depois **Ctrl+S / Cmd+S** para salvar o arquivo em sua máquina como `README.md`.
=======
MongoDB Atlas
>>>>>>> c39473c681d1ba55b77c599087ea3bbacf908bbf
