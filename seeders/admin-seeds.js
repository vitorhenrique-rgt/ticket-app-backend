const { User, Company } = require("../models");

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

      // Cria um usuário admin com o nickname 'ticket'
      await User.create({
        name: "Admin",
        nickname: "admin",
        password: "admin",
        isAdmin: true,
        companyId: company.id,
      });

      console.log("Usuário admin criado com sucesso!");
    } catch (error) {
      console.error("Erro ao criar usuário admin:", error);
    }
  },

  async down(queryInterface, Sequelize) {
    // Este método pode ser usado para reverter as seeds, caso necessário
    await User.destroy({ where: { nickname: "admin" } });
    await Company.destroy({ where: { name: "DefaultCompany" } });
  },
};
