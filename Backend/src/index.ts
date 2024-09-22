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

const dbUser = process.env.DB_USER;
const dbPass = process.env.DB_PASSWORD;

mongoose.connect("mongodb+srv://cluster0.gyqz4.mongodb.net/Trullo", {
  user: dbUser,
  pass: dbPass,
})
  .then(() => console.log("MongoDB connected"))
  .catch((error) => console.error("MongoDB connection error:", error));



app.use('/graphql', graphqlHTTP({
    schema: schema,
    graphiql: true
}));


app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
