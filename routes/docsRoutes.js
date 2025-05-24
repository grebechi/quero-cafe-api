const express = require('express');
const apiDocs = require('../docs/apiDocs');

const router = express.Router();

router.get('/', (req, res) => {
  const rows = apiDocs.map(route => {
    const color = getMethodColor(route.method);
    return `
      <tr>
        <td style="color: ${color}; font-weight: bold;">${route.method}</td>
        <td>${route.path}</td>
        <td>${route.description}</td>
        <td>${route.auth ? '🔒 Yes' : 'No'}</td>
      </tr>
    `;
  }).join('');

  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Quero Café API Docs</title>
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
      <h1>Quero Café API Documentation</h1>
      <table>
        <thead>
          <tr>
            <th>Method</th>
            <th>Path</th>
            <th>Description</th>
            <th>Auth</th>
          </tr>
        </thead>
        <tbody>
          ${rows}
        </tbody>
      </table>
      <div class="footer">
        <p>Generated automatically - ${new Date().toLocaleString()}</p>
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
