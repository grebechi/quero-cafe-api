
# Quero Café API

API REST para gerenciamento de solicitações e preparo de café.

---

## Tecnologias Utilizadas

- Node.js
- Express
- MySQL
- JWT (autenticação)
- Bcrypt (hash de senhas)

---

## Como Rodar Localmente

1. Clone o repositório:

```bash
git clone https://github.com/grebechi/quero-cafe-api.git
cd quero-cafe-api
```

2. Instale as dependências:

```bash
npm install
```

3. Configure o arquivo `.env` com:

```env
DB_HOST=localhost
DB_USER=nome_de_usuario
DB_PASSWORD=senha_forte
DB_NAME=nome_base_de_dados
DB_PORT=porta_da_base_de_dados
JWT_SECRET=token
```

4. Inicie a aplicação:

```bash
node app.js
```

A API estará rodando em: `http://localhost:3000`

---

## ✅ Como Rodar os Testes

1. Certifique-se de que as dependências de desenvolvimento estão instaladas:

```bash
npm install --save-dev jest supertest
```

2. Execute os testes:

```bash
npm test
```

Os testes são executados utilizando **mocks** de banco de dados e de dependências como `bcrypt` e `jsonwebtoken`.  
Nenhum dado real é alterado durante os testes.

Estrutura de testes:

```
tests/
├── auth.test.js
├── coffee.test.js
└── request.test.js
```

---

## ✅ Autenticação

- **Login** → `POST /auth/login`
- Envie: 

```json
{
  "mail": "usuario@exemplo.com",
  "pass": "senha123"
}
```

- Retorna:

```json
{
  "token": "JWT_TOKEN"
}
```

**Todas as rotas (exceto `/auth/login`) exigem o header:**

```http
Authorization: Bearer JWT_TOKEN
```

---

## ✅ Endpoints

### 📌 Auth

**POST /auth/login**  
→ Login e recebe token.

---

### 📌 People

**POST /people** → Criar usuário (somente admin)  
**DELETE /people/:id** → Remover usuário (somente admin)

---

### 📌 Request

**POST /requests** → Criar solicitação de café  
**GET /requests/person/:id** → Buscar todas as solicitações de uma pessoa

---

### 📌 Coffee

**POST /coffee** → Registrar café passado  
**GET /coffee/today** → Cafés feitos hoje  
**GET /coffee/last** → Último café feito  
**GET /coffee/trainee/:id** → Cafés preparados por um estagiário

---

## ✅ Estrutura de Diretórios

```
quero-cafe-api/
├── controllers/
├── middlewares/
├── routes/
├── tests/
├── __mocks__/
├── db.js
├── app.js
├── .env
├── .gitignore
├── package.json
└── README.md
```

---

## ✅ Segurança

- Senhas armazenadas com **bcrypt**.
- Autenticação via **JWT**.
- Rotas sensíveis protegidas por **middleware**.
- Arquivo `.env` incluído no `.gitignore` → nunca suba ele ao GitHub.

---

## ✅ Contribuição

1. Fork o projeto.
2. Crie sua branch: `git checkout -b feature/nome`.
3. Commit suas mudanças: `git commit -m 'feat: algo'`.
4. Push: `git push origin feature/nome`.
5. Abra um Pull Request.

---

## ✅ Licença

MIT License.
