const apiDocs = [
    {
      group: 'Autenticação',
      routes: [
        { method: 'POST', path: '/auth/login', description: 'Autentica usuário e retorna token', auth: false }
      ]
    },
    {
      group: 'Café',
      routes: [
        { method: 'POST', path: '/coffee', description: 'Registrar que fez café', auth: true },
        { method: 'GET', path: '/coffee/today', description: 'Listar ações de café de hoje', auth: true },
        { method: 'GET', path: '/coffee/last', description: 'Obter última ação de café', auth: true },
        { method: 'GET', path: '/coffee/trainee/:id', description: 'Listar ações de café por trainee', auth: true }
      ]
    },
    {
      group: 'Usuários',
      routes: [
        { method: 'POST', path: '/people', description: 'Criar novo usuário (apenas admin)', auth: true },
        { method: 'DELETE', path: '/people/:id', description: 'Deletar usuário por ID (apenas admin)', auth: true }
      ]
    },
    {
      group: 'Requisições de Café',
      routes: [
        { method: 'POST', path: '/requests', description: 'Criar uma requisição de café', auth: true },
        { method: 'GET', path: '/requests/my', description: 'Listar minhas requisições de café', auth: true }
      ]
    },
    {
      group: 'Configurações',
      routes: [
        { method: 'GET', path: '/api/settings', description: 'Listar todas as configurações (apenas admin)', auth: true },
        { method: 'GET', path: '/api/settings/:key', description: 'Buscar configuração por chave (apenas admin)', auth: true },
        { method: 'PUT', path: '/api/settings/:key', description: 'Atualizar ou criar configuração (apenas admin)', auth: true }
      ]
    },
    {
      group: 'Usuário Atual',
      routes: [
        { method: 'GET', path: '/me', description: 'Obter informações do usuário autenticado', auth: true }
      ]
    }
  ];
  
  module.exports = apiDocs;
  