const repo = require('./credits.repository');
function validateCustomer(data) { if (!data.fullName?.trim()) throw Object.assign(new Error('Customer name is required'), { statusCode: 400 }); }
async function createCustomer(data) { validateCustomer(data); return repo.createCustomer(data); }
async function updateCustomer(id, data) { validateCustomer(data); return repo.updateCustomer(id, data); }
module.exports = { ...repo, createCustomer, updateCustomer };
