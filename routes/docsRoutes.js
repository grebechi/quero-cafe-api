const express = require('express');
const apiDocs = require('../docs/apiDocs');

const router = express.Router();

router.get('/', (req, res) => {
  const sections = apiDocs.map(group => {
    const rows = group.routes.map(route => {
      const color = getMethodColor(route.method);
      return `
        <tr>
          <td style="color: ${color}; font-weight: bold;">${route.method}</td>
          <td>${route.path}</td>
          <td>${route.description}</td>
          <td>${route.auth ? '🔒 Sim' : 'Não'}</td>
        </tr>
      `;
    }).join('');

    return `
      <h2>${group.group}</h2>
      <table>
        <thead>
          <tr>
            <th>Método</th>
            <th>Caminho</th>
            <th>Descrição</th>
            <th>Auth</th>
          </tr>
        </thead>
        <tbody>
          ${rows}
        </tbody>
      </table>
    `;
  }).join('<br>');

  const dataFormatada = new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' });

  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Documentação da API - Quero Café</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          background: #f9fafb;
          padding: 2rem;
          color: #111827;
        }
        h1 {
          text-align: center;
          margin-bottom: 2rem;
          font-size: 2rem;
        }
        h2 {
          margin-top: 2rem;
          color: #374151;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 1rem;
        }
        th, td {
          padding: 1rem;
          border-bottom: 1px solid #e5e7eb;
        }
        th {
          text-align: left;
          background: #f3f4f6;
        }
        .footer {
          margin-top: 2rem;
          text-align: center;
          font-size: 0.9rem;
          color: #6b7280;
        }
      </style>
    </head>
    <body>
      <h1>Documentação da API - Quero Café</h1>
      ${sections}
      <div class="footer">
        <p>Gerado automaticamente - ${dataFormatada}</p>
      </div>
    </body>
    </html>
  `);
});

function getMethodColor(method) {
  switch (method) {
    case 'GET': return '#3b82f6';  // azul
    case 'POST': return '#10b981'; // verde
    case 'PUT': return '#f59e0b';  // amarelo
    case 'DELETE': return '#ef4444'; // vermelho
    default: return '#6b7280';  // cinza
  }
}

module.exports = router;
