const express = require('express')
const router = express.Router();
const { Company } = require('../models');
const { check, validationResult } = require('express-validator');
const companyController = require('../controllers/companyController');

// Criar uma nova empresa
router.post('/companies',
  [
    check('name')
    .notEmpty()
    .withMessage('Name field cannot be empty')
    .isLength({ min: 3 })
    .withMessage('Name must be at least 3 characters long'),
  ],
  companyController.createCompany);

// Listar todas as empresas (READ)
router.get('/companies', companyController.getAllCompanies);

// Buscar uma empresa específica por ID (READ)
router.get('/companies/:id', companyController.getCompanyById);

// Atualizar uma empresa existente (UPDATE)
router.put('/companies/:id', companyController.updatedCompany);

// Deletar uma empresa (DELETE)
router.delete('/companies/:id', companyController.deleteCompany);

module.exports = router;
