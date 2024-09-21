import { UserResolvers} from "../types/userTypes"; // Импортируем интерфейсы и типы (нужно создать `types.ts` файл)
import User from "../models/userModel";
import { generateToken } from "../auth/auth";
import { IUserWithToken } from "../types/userTypes";
import { validationResult } from 'express-validator';
import { userRegisterValidation } from "../validation/userValidation";

// Определение резолверов с типизацией
const userResolvers: UserResolvers = {
  Query: {
    users: async () => {
      try {
        return await User.find({}).populate("tasks").exec();
      } catch (error) {
        throw new Error("Error fetching users");
      }
    },
    user: async (_, { id }) => {
      try {
        return await User.findById(id).populate("tasks").exec();
      } catch (error) {
        throw new Error("User not found");
      }
    },
  },
  Mutation: {
    registerUser: async (_, { username, email, password }) => {
      // Создание фиктивного req для использования валидаторов
      const mockReq = {
        body: { username, email, password },
      };

      // Выполнение валидации
      for (const validator of userRegisterValidation) {
        const result = await validator.run(mockReq);
        if (!result.isEmpty()) break;
      }

      const errors = validationResult(mockReq);
      if (!errors.isEmpty()) {
        throw new Error(
          errors
            .array()
            .map((err) => err.msg)
            .join(', ')
        );
      }
      try {
        const existingUser = await User.findOne({ email }).exec();
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
        const user = await User.findOne({ email }).exec();
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
        ).exec();

        if (!updatedUser) throw new Error("User not found");

        return updatedUser;
      } catch (error) {
        throw new Error("Error updating user");
      }
    },
    deleteUser: async (_, { id}) => {
      try {
        const deletedUser = await User.findByIdAndDelete(id).exec();

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
