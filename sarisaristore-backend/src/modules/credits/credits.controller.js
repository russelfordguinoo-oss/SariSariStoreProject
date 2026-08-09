const service = require('./credits.service');
async function handler(fn, req, res, next) { try { res.status(200).json(await fn()); } catch (err) { next(err); } }
exports.listCustomers = (req,res,next) => handler(() => service.listCustomers(req.query),req,res,next);
exports.getDashboard = (req,res,next) => handler(() => service.dashboard(),req,res,next);
exports.getProfile = (req,res,next) => handler(() => service.getProfile(req.params.id),req,res,next);
exports.createCustomer = (req,res,next) => handler(() => service.createCustomer(req.body),req,res,next);
exports.updateCustomer = (req,res,next) => handler(() => service.updateCustomer(req.params.id,req.body),req,res,next);
exports.archiveCustomer = (req,res,next) => handler(async () => { await service.archiveCustomer(req.params.id); return { success: true }; },req,res,next);
exports.recordPayment = (req,res,next) => handler(() => service.recordPayment(req.params.id,req.user.userId,req.body.amount,req.body.notes),req,res,next);
