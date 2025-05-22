
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

## Autenticação

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

## Endpoints

### Auth

**POST /auth/login**  
→ Login e recebe token.

---

### 📌 People

**POST /people** → Criar usuário (somente admin)  
- Envie:

```json
{
  "name": "Novo Usuário",
  "mail": "novo@exemplo.com",
  "pass": "senha123",
  "isTrainee": true,
  "isAdmin": false
}
```

- Retorna:

```json
{ "message": "User created" }
```

---

**DELETE /people/:id** → Remover usuário (somente admin)  

Exemplo:  
`DELETE /people/5`

- Retorna:

```json
{ "message": "User deleted" }
```

---

### 📌 Request

**POST /requests** → Criar solicitação de café  
- Envie:

```json
{
  "person_id": 2
}
```

- Restrições:
  - Só é permitido criar uma nova solicitação se a última foi há mais de **5 minutos**.

- Retorna:

```json
{ "message": "Request created", "request_id": 1 }
```

---

### 📌 Coffee

**POST /coffee** → Registrar café passado  
- Envie:

```json
{
  "trainee_id": 3,
  "request_id": 1
}
```

- `request_id` é opcional → pode ser `null`.

- Retorna:

```json
{ "message": "Coffee recorded", "coffee_id": 1 }
```

---

## Exemplo de fluxo completo

1. **Usuário faz login** → obtém token.
2. **Solicita café** → `POST /requests` com token.
3. **Estagiário passa o café** → `POST /coffee` com token.

---

## Segurança

- Senhas armazenadas com **bcrypt**.
- Autenticação via **JWT**.
- Rotas sensíveis protegidas por **middleware**.

---

## Estrutura de Diretórios

```
quero-cafe-api/
├── controllers/
├── middlewares/
├── routes/
├── db.js
├── app.js
├── .env
├── .gitignore
├── package.json
└── README.md
```

---

## Contribuição

1. Fork o projeto.
2. Crie sua branch: `git checkout -b feature/nome`.
3. Commit suas mudanças: `git commit -m 'feat: algo'`.
4. Push: `git push origin feature/nome`.
5. Abra um Pull Request.

---

## Licença

MIT License.
