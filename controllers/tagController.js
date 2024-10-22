const express = require('express');
const router = express.Router();
const { Tag } = require('../models'); // Importando o modelo de Tag
const { check, validationResult } = require('express-validator');


// Cria uma nova tag
exports.createTag = async (req, res) => {
     // Verifica se há erros de validação
     const errors = validationResult(req);
     if (!errors.isEmpty()) {
       return res.status(400).json({ errors: errors.array() });
     }
  try {
    const tag = await Tag.create(req.body);
    res.status(201).json(tag);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}


// Lista todas as tags
exports.getAllTags =  async (req, res) => {
    try {
      const tags = await Tag.findAll();
      res.status(200).json(tags);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
  
  // Lista uma tag por ID
exports.getTagById = async (req, res) => {
    try {
      const tag = await Tag.findByPk(req.params.id);
      if (!tag) {
        return res.status(404).json({ error: 'Tag not found' });
      }
      res.status(200).json(tag);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
  
  // Atualiza uma tag
exports.updateTag =  async (req, res) => {
    try {
      const tag = await Tag.findByPk(req.params.id);
      if (!tag) {
        return res.status(404).json({ error: 'Tag not found' });
      }
      await tag.update(req.body);
      res.status(200).json(tag);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
  
  // Deleta uma tag
exports.deleteTag = async (req, res) => {
    try {
      const tag = await Tag.findByPk(req.params.id);
      if (!tag) {
        return res.status(404).json({ error: 'Tag not found' });
      }
      await tag.destroy();
      res.status(204).send(); // Sem conteúdo, pois foi deletada com sucesso
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
  
