import mongoose, { Document, Model, Schema } from "mongoose";
import bcrypt from "bcrypt";

// Интерфейс для документа User (включает стандартные методы mongoose и добавленные методы)
interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  token?: string;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

// Создание схемы для пользователя
const userSchema: Schema<IUser> = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  token: { type: String },
});

// Прехук для хэширования пароля перед сохранением
userSchema.pre<IUser>('save', async function (next) {
    if (this.isModified('password') || this.isNew) {
      try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
      } catch (error: unknown) {  // Указываем тип unknown для ошибки
        if (error instanceof Error) {
          return next(error); // Приводим error к типу Error перед использованием
        }
        // В случае, если ошибка не является экземпляром Error, можно кинуть другую ошибку
        return next(new Error('An unknown error occurred during password hashing.'));
      }
    }
    next();
  });

// Метод для сравнения паролей
userSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Создание модели
const User: Model<IUser> = mongoose.model<IUser>('User', userSchema, "users");

export default User;
