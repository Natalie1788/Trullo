import { UserResolvers} from "../types/userTypes"; // Импортируем интерфейсы и типы (нужно создать `types.ts` файл)
import User from "../models/userModel";
import { verifyToken, generateToken } from "../auth/auth";
import { IUserWithToken } from "../types/userTypes";
import { validationResult } from 'express-validator';
import { ValidationChain} from 'express-validator';
import { userRegisterValidation } from "../validation/userValidation";

// Функция для выполнения валидации
const runValidation = async (inputs: Record<string, any>, validators: ValidationChain[]): Promise<void> => {
  // Создаём фиктивный объект req с полем body, который ожидает express-validator
  const req = { body: inputs };

  // Выполняем каждый валидатор на данном req объекте
  for (let validator of validators) {
    const result = await validator.run(req);
    if (!result.isEmpty()) break; // Если найдена ошибка, прерываем цикл
  }

  // Извлекаем ошибки из валидации
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // Если есть ошибки, кидаем их в виде исключения
    const errorMessages = errors.array().map(err => err.msg);
    throw new Error(errorMessages.join(', '));
  }
};


// Определение резолверов с типизацией
const userResolvers: UserResolvers = {
  Query: {
    users: async () => {
      try {
        return await User.find({}).populate("tasks");
      } catch (error) {
        throw new Error("Error fetching users");
      }
    },
    user: async (_, { id }) => {
      try {
        return await User.findById(id).populate("tasks");
      } catch (error) {
        throw new Error("User not found");
      }
    },
currentUser: async (_, __, { req }) => {
  try {
    console.log('Request headers:', req.headers); // Логируем заголовки запроса
    // Используем verifyToken для проверки токена
    const user = verifyToken(req); // Получаем данные пользователя из токена
    
    if (!user.id) {
      throw new Error("User ID is missing from the token");
    }
    // Теперь можно искать пользователя в базе данных
    const currentUser = await User.findById(user.id).populate("tasks");

    if (!currentUser) {
      throw new Error("User not found");
    }
    console.log("Current User:", currentUser);

    return {
     
        ...currentUser.toObject(),
        id: currentUser._id,
      }

    
  } catch (error) {
    throw new Error("Error fetching current user: " + error.message);
  }
},

    },
  Mutation: {
    registerUser: async (_, { username, email, password }) => {

      await runValidation({ username, email, password }, userRegisterValidation);

      try {
        const existingUser = await User.findOne({ email }).populate("tasks");
        if (existingUser) throw new Error("Email already exists");

        const newUser = new User({
          username,
          email,
          password,
        });

        await newUser.save();

        return {
          ...newUser.toObject(),
          id: newUser._id,
        };
      } catch (error) {
        throw new Error("Error registering user");
      }
    },
    loginUser: async (_, { email, password }) => {
      try {
        const user = await User.findOne({ email }).populate("tasks");
        if (!user) throw new Error("User with this email does not exist");

        const isMatch = await user.comparePassword(password);
        if (!isMatch) throw new Error("Invalid credentials");

        const token = generateToken(user as IUserWithToken);

        return {
          user: {
            ...user.toObject(),
            id: user._id,
          },
          token,
        };
      } catch (error) {
        throw new Error("Login failed");
      }
    },
    logoutUser: async (_, __, { token }) => {
      try {
        // Логика разлогина может быть дополнена, если нужно
        return true;
      } catch (error) {
        throw new Error("Error logging out");
      }
    },
    updateUser: async (_, { id, username, email }) => {
      try {
        const updatedUser = await User.findByIdAndUpdate(
          id,
          { username, email },
          { new: true }
        ).populate("tasks");

        if (!updatedUser) throw new Error("User not found");

        return updatedUser;
      } catch (error) {
        throw new Error("Error updating user");
      }
    },
    deleteUser: async (_, { id}) => {
      try {
        const deletedUser = await User.findByIdAndDelete(id);

        if (!deletedUser) {
          throw new Error("User not found");
        }

        return deletedUser;
      } catch (error) {
        throw new Error("Error deleting user");
      }
    },
  },
};

export default userResolvers;
