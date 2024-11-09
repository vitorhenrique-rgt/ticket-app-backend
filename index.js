const express = require("express");
const cors = require("cors");
const sequelize = require("./config/database");
const companyRoutes = require("./routes/companyRoutes");
const userRoutes = require("./routes/userRoutes");
const ticketRoutes = require("./routes/ticketRoutes");
const tagRoutes = require("./routes/tagRoutes");
const app = express();

const corsOptions = {
  origin: process.env.CORS_ORIGIN,
  methods: "GET,PUT,POST,DELETE",
};
app.use(cors(corsOptions));

app.use(express.json());

app.use("/api", companyRoutes);
app.use("/api", userRoutes);
app.use("/api", ticketRoutes);
app.use("/api", tagRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
  try {
    await sequelize.authenticate();
    console.log(`Servidor rodando na porta ${PORT}`);
  } catch (error) {
    console.error("Erro ao conectar ao banco:", error);
  }
});
