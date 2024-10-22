const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const ticketController = require('../controllers/ticketController');
const { Ticket, TicketTag, Tag, sequelize } = require('../models');

// Rota para criar um novo ticket
router.post('/tickets', 
  [
    check('title').notEmpty().withMessage('Title is required').isLength({ min: 10 }).withMessage('Title must be at least 10 characters long'),
    check('tagId').notEmpty().withMessage('Tag is required'),
    check('requesterId').notEmpty().withMessage('Requester is required'),
    check('adminId').notEmpty().withMessage('Admin is required'),
    check('companyId').notEmpty().withMessage('Company is required')
  ], 
  ticketController.createTicket
);


// Rota para listar todos os tickets
router.get('/tickets', ticketController.getTickets);

// Rota para listar um ticket específico
router.get('/tickets/:id',  ticketController.getTicketById);

// Rota para atualizar um ticket
router.put('/tickets/:id', ticketController.updateTicket);

// Rota para deletar um ticket
router.delete('/tickets/:id', ticketController.deleteTicket);

router.get('tickets/stats', ticketController.getTicketStats);

module.exports = router;
