const express = require('express');
const router = express.Router();
const { TicketTag } = require('../models'); // Importando o modelo TicketTag

// Rota para associar uma tag a um ticket
router.post('/tickets/:ticketId/tags', async (req, res) => {
  try {
    const { ticketId } = req.params;
    const { tagId } = req.body;

    const ticketTag = await TicketTag.create({
      ticketId: ticketId,
      tagId: tagId,
    });

    res.status(201).json(ticketTag);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
