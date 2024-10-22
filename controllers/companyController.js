const express = require('express');
const router = express.Router();
const { Company } = require('../models');
const { check, validationResult } = require('express-validator');

// Cria uma nova empresa (CREATE)
exports.createCompany = async (req, res) => {
     // Verifica se há erros de validação
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
  try {
    const company = await Company.create(req.body);
    res.status(201).json(company);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar a empresa' });
  }
}

// Listar todas as empresas (READ)
exports.getAllCompanies = async (req, res) => {
    try {
      const companies = await Company.findAll();
      res.json(companies);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao listar empresas' });
    }
  }
  
  // Busca uma empresa específica por ID (READ)
exports.getCompanyById = async (req, res) => {
    try {
      const company = await Company.findByPk(req.params.id);
      if (company) {
        res.json(company);
      } else {
        res.status(404).json({ error: 'Empresa não encontrada' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Erro ao buscar a empresa' });
    }
  }
  
  // Atualiza uma empresa existente (UPDATE)
exports.updatedCompany = async (req, res) => {
    try {
      const [updated] = await Company.update(req.body, {
        where: { id: req.params.id }
      });
      if (updated) {
        const updatedCompany = await Company.findByPk(req.params.id);
        res.json(updatedCompany);
      } else {
        res.status(404).json({ error: 'Empresa não encontrada' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Erro ao atualizar a empresa' });
    }
  }
  
  // Deletar uma empresa (DELETE)
exports.deleteCompany = async (req, res) => {
    try {
      const deleted = await Company.destroy({
        where: { id: req.params.id }
      });
      if (deleted) {
        res.status(204).json();
      } else {
        res.status(404).json({ error: 'Empresa não encontrada' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Erro ao deletar a empresa' });
    }
  }