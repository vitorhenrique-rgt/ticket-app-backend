const express = require('express');
const { check, validationResult } = require('express-validator');
const router = express.Router();
const { User } = require('../models'); // Importa o modelo User
const bcrypt = require('bcrypt');

// Cria um novo usuário
exports.createUser = async (req, res) => {
  // Verifica se há erros de validação
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const {name, nickname, password, companyId } = req.body;

    // Verificar se o nickname já existe
    const existingUser = await User.findOne({ where: { nickname } });
    if (existingUser) {
      return res.status(400).json({ error: 'Nickname já existe' });
    }

    // Criptografar a senha
    const hashedPassword = await bcrypt.hash(password, 10); // O número 10 é o "salt rounds"

    const user = await User.create({
      name,
      nickname,
      password: hashedPassword,
      companyId
    });

    // 4. Preparar a resposta sem a senha
    const userResponse = {
      id: user.id,
      nickname: user.nickname,
    };

    res.status(201).json({ message: 'Usuário criado com sucesso', user: userResponse });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar usuário' });
    console.error(error);
  }
};

// Lista todos os usuários
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar usuários' });
  }
}

// Obter um usuário específico
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar usuário' });
  }
}


// Atualiza um usuário existente
exports.updateUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }
    const {name, nickname, password, companyId } = req.body;
    // Criptografar a senha
    const hashedPassword = await bcrypt.hash(password, 10); // O número 10 é o "salt rounds"
    await user.update({
      name,
      nickname,
      password: hashedPassword,
      companyId
    });
    res.json(user);
  } catch (error) {
    res.status(400).json({ error: 'Erro ao atualizar usuário' });
  }
}

// Exclui um usuário
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }
    await user.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Erro ao excluir usuário' });
  }
}

// Login do usuário
exports.loginUser = async (req, res) => {
  const { nickname, password } = req.body;

  try {
    // Procurar usuário pelo nickname
    const user = await User.findOne({ where: { nickname } });
    if (!user) {
      return res.status(400).json({ error: 'Invalid nickname or password' });
    }

    // Comparar a senha fornecida com a armazenada no banco
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid nickname or password' });
    }
    // 4. Preparar a resposta sem a senha
    const userResponse = {
      id: user.id,
      nickname: user.nickname,
      admin:user.isAdmin
    };

    res.status(200).json({ message: 'Login successful', user: userResponse });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};