const { User, Company } = require("../models");
const bcrypt = require("bcrypt"); // Importa o bcrypt

module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      // Verifica se já existe uma empresa para associar
      let company = await Company.findOne({
        where: { name: "DefaultCompany" },
      });

      // Cria uma empresa padrão se não existir
      if (!company) {
        company = await Company.create({ name: "DefaultCompany" });
      }

      // Verifica se o usuário admin já existe
      const adminExists = await User.findOne({ where: { nickname: "admin" } });

      if (!adminExists) {
        // Criptografa a senha usando bcrypt
        const hashedPassword = bcrypt.hash("admin", 10); // 10 é o número de salt rounds

        // Cria um usuário admin com a senha criptografada
        await User.create({
          name: "Admin",
          nickname: "admin",
          password: hashedPassword, // Usa a senha criptografada
          isAdmin: true,
          companyId: company.id,
        });
        console.log("Usuário admin criado com sucesso!");
      } else {
        console.log("Usuário admin já existe.");
      }
    } catch (error) {
      console.error("Erro ao criar usuário admin:", error);
    }
  },

  async down(queryInterface, Sequelize) {
    // Este método reverte o seed caso necessário
    await User.destroy({ where: { nickname: "admin" } });
    await Company.destroy({ where: { name: "DefaultCompany" } });
  },
};
