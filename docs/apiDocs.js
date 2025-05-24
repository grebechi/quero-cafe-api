const apiDocs = [
    // AUTH ROUTES
    { method: 'POST', path: '/auth/login', description: 'Authenticate user and return token', auth: false },
  
    // COFFEE ROUTES
    { method: 'POST', path: '/coffee', description: 'Register that you made coffee', auth: true },
    { method: 'GET', path: '/coffee/today', description: 'Get list of today\'s coffee actions', auth: true },
    { method: 'GET', path: '/coffee/last', description: 'Get last coffee action', auth: true },
    { method: 'GET', path: '/coffee/trainee/:id', description: 'Get coffee actions by trainee ID', auth: true },
  
    // PEOPLE ROUTES
    { method: 'POST', path: '/people', description: 'Create new user (admin only)', auth: true },
    { method: 'DELETE', path: '/people/:id', description: 'Delete user by ID (admin only)', auth: true },
  
    // REQUEST ROUTES
    { method: 'POST', path: '/requests', description: 'Create a coffee request', auth: true },
    { method: 'GET', path: '/requests/my', description: 'Get my coffee requests', auth: true },
  
    // SETTINGS ROUTES
    { method: 'GET', path: '/api/settings', description: 'List all settings (admin only)', auth: true },
    { method: 'GET', path: '/api/settings/:key', description: 'Get setting by key (admin only)', auth: true },
    { method: 'PUT', path: '/api/settings/:key', description: 'Update or create setting by key (admin only)', auth: true },
  
    // USER ROUTE
    { method: 'GET', path: '/me', description: 'Get current authenticated user', auth: true }
  ];
  
  module.exports = apiDocs;
  