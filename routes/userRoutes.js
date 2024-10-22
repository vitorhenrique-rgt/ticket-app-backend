const express = require('express');
const { check, validationResult } = require('express-validator');
const router = express.Router();
const userController = require('./../controllers/userController')
const { User } = require('../models'); // Importa o modelo User

const userValidation = [
  check('name').notEmpty().withMessage('Name is required').isLength({ min: 3 }).withMessage('Name must be at least 3 characters long'),
  check('nickname').notEmpty().withMessage('Name is required').isLength({ min: 3 }).withMessage('Name must be at least 3 characters long'),
] 
// Criar um novo usuário
router.post('/users', userValidation, userController.createUser);
  
// Listar todos os usuários
router.get('/users', userController.getAllUsers);

// Obter um usuário específico
router.get('/users/:id', userController.getUserById);

// Atualizar um usuário existente
router.put('/users/:id', userController.updateUser);

// Excluir um usuário
router.delete('/users/:id', userController.deleteUser);

// Rota para login de usuário
router.post('/login', userController.loginUser);
module.exports = router;
