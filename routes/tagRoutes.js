const express = require('express');
const router = express.Router();
const { Tag } = require('../models'); // Importando o modelo de Tag
const { check, validationResult } = require('express-validator');
const tagController =  require('./../controllers/tagController')

// Rota para criar uma nova tag
router.post('/tags',
  [
    check('name')
    .notEmpty()
    .withMessage('Name field cannot be empty')
    .isLength({ min: 3 })
    .withMessage('Name must be at least 3 characters long'),
  ],
  tagController.createTag);

// Rota para listar todas as tags
router.get('/tags', tagController.getAllTags);

// Rota para listar uma tag por ID
router.get('/tags/:id', tagController.getTagById);


// Rota para atualizar uma tag
router.put('/tags/:id', tagController.updateTag);

// Rota para deletar uma tag
router.delete('/tags/:id', tagController.deleteTag);

module.exports = router;
