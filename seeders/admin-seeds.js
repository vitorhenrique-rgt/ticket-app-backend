const { User, Company, sequelize } = require("../models");

async function seedAdminUser() {
  try {
    // Sincroniza o banco de dados (não use force: true para não resetar tudo)
    await sequelize.sync();

    // Verifica se já existe uma empresa para associar
    let company = await Company.findOne({ where: { name: "DefaultCompany" } });

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
  } finally {
    await sequelize.close();
  }
}

seedAdminUser();
