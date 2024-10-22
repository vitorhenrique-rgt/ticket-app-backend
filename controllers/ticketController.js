const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const { User, Company, Ticket, TicketTag, Tag, sequelize } = require('../models');
const { Op } = require('sequelize');

// Cria um novo ticket
exports.createTicket = async (req, res) => {
    // Verifica se há erros de validação
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Inicia uma transação
    const t = await sequelize.transaction();

    try {
      const { title, description, tagId, requesterId, adminId, companyId, status } = req.body;

      // Criar o ticket dentro da transação
      const ticket = await Ticket.create({ title, description, requesterId, adminId, companyId, status }, { transaction: t });

      // Verificar se a tag existe
      const tag = await Tag.findByPk(tagId);
      if (!tag) {
        // Caso a tag não seja encontrada, faz rollback e retorna o erro
        await t.rollback();
        return res.status(404).json({ error: 'Tag not found' });
      }

      // Criar a relação na tabela TicketTag dentro da transação
      await TicketTag.create({
        ticketId: ticket.id,
        tagId: tagId,
      }, { transaction: t });

      // Se tudo estiver correto, faz commit
      await t.commit();

      res.status(201).json({ ticket, message: 'Ticket created and associated with tag' });

    } catch (error) {
      // Se houver um erro, faz rollback da transação
      await t.rollback();
      res.status(400).json({ error: error.message });
    }
  }


// Rota para listar tickets com paginação e filtros
exports.getTickets =  async (req, res) => {
  const { page = 1, limit = 10, status, requesterId, adminId, companyId, tagId, startDate, endDate } = req.query;
  const offset = (page - 1) * limit;

  const whereClause = {};

  // Verifica e aplica cada filtro
  if (status) {
    whereClause.status = status;
  }
  if (requesterId) {
    whereClause.requesterId = requesterId;
  }
  if (adminId) {
    whereClause.adminId = adminId;
  }
  if (companyId) {
    whereClause.companyId = companyId;
  }
  if (startDate && endDate) {
    const start = new Date(`${startDate}T00:00:00.000Z`); // Começa à meia-noite
    const end = new Date(`${endDate}T23:59:59.999Z`); // Termina no final do dia
    whereClause.createdAt = {
      [Op.between]: [start, end]
    };
  }
  

  try {
    const tickets = await Ticket.findAndCountAll({
      where: whereClause,
      limit: parseInt(limit),
      offset: parseInt(offset),
      include: [
        { 
          model: Tag, 
          through: { attributes: [] },
          where: tagId ? { id: tagId } : undefined,
        },
        { model: User, as: 'requester' },
        { model: User, as: 'admin' },
        { model: Company },
      ],
    });

    const totalPages = Math.ceil(tickets.count / limit);

    res.status(200).json({
      totalItems: tickets.count,
      totalPages: totalPages,
      currentPage: parseInt(page),
      tickets: tickets.rows,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

  
  // listar um ticket específico
exports.getTicketById = async (req, res) => {
    try {
      const ticket = await Ticket.findByPk(req.params.id);
      if (!ticket) {
        return res.status(404).json({ error: 'Ticket not found' });
      }
      res.status(200).json(ticket);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  

  // atualiza um ticket
exports.updateTicket = async (req, res) => {
    try {
      const ticket = await Ticket.findByPk(req.params.id);
      if (!ticket) {
        return res.status(404).json({ error: 'Ticket not found' });
      }
      await ticket.update(req.body);
      res.status(200).json(ticket);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
  
  // Deleta um ticket
exports.deleteTicket = async (req, res) => {
    try {
      const ticket = await Ticket.findByPk(req.params.id);
      if (!ticket) {
        return res.status(404).json({ error: 'Ticket not found' });
      }
      await ticket.destroy();
      res.status(204).json();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

exports.getTicketStats = async (req, res) => {
    const { filter } = req.query; // 'day', 'week', 'month'
    let dateRange;
  
    // Define o intervalo de datas com base no filtro
    switch (filter) {
      case 'day':
        dateRange = {
          [Op.gte]: new Date(new Date() - 24 * 60 * 60 * 1000) // Últimas 24 horas
        };
        break;
        case 'week':
          dateRange = {
            [Op.gte]: new Date(new Date() - 7 * 24 * 60 * 60 * 1000) // Últimos 7 dias
          };
          break;
          case 'month':
            dateRange = {
              [Op.gte]: new Date(new Date().setMonth(new Date().getMonth() - 1)) // Último mês
            };
            break;
            default:
              return res.status(400).json({ error: 'Filtro inválido. Use "day", "week" ou "month".' });
            }
            
            console.log(dateRange)
    try {
      // Busca a contagem de tickets no intervalo de tempo
      const ticketCount = await Ticket.count({
        where: {
          createdAt: dateRange
        }
      });
  
      return res.json({ ticketCount });
    } catch (error) {
      console.error('Erro ao buscar estatísticas de tickets:', error);
      return res.status(500).json({ error: 'Erro ao buscar estatísticas de tickets.' });
    }
  };
  