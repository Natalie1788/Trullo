import express from 'express';
import cors from 'cors';
import { graphqlHTTP } from 'express-graphql';
import schema from './schema';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const PORT = 4000;
const app = express();
app.use(cors());
app.use(express.json());

// Переменные окружения для подключения к базе данных
const dbUser = process.env.DB_USER;
const dbPass = process.env.DB_PASSWORD;

// Подключение к MongoDB
mongoose.connect("mongodb+srv://cluster0.gyqz4.mongodb.net/Trullo", {
  user: dbUser,
  pass: dbPass,
})
  .then(() => console.log("MongoDB connected"))
  .catch((error) => console.error("MongoDB connection error:", error));

// Импортируем middleware
/*app.use(authenticateToken); 

app.use(
  '/graphql',
  graphqlHTTP((req) => {
    const user = req.user; 

    return {
      schema,
      context: { req, user },
      graphiql: true,
    };
  })
);*/
app.use('/graphql', graphqlHTTP((req) => ({
  schema: schema,
  context: { req }, // Передаем req в контекст
  graphiql: true, // Включаем GraphiQL в development mode
})));





// Запуск сервера
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
