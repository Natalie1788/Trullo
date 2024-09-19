import jwt, { JwtPayload } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { IUserWithToken } from '../types/userTypes';

const SECRETKEY = process.env.SECRET_KEY || 'defaultsecret'; // Указываем тип для SECRETKEY

// Интерфейс для пользователя, который будет использоваться для создания токена


// Интерфейс для расширения объекта Request с полем user
interface AuthenticatedRequest extends Request {
  user?: string | JwtPayload;
}

// Функция для создания JWT
export const generateToken = (user: IUserWithToken): string => {
  return jwt.sign({ id: user._id, email: user.email }, SECRETKEY, {
    expiresIn: '1h', // Токен истекает через 1 час
  });
};

// Middleware для проверки JWT
export const authenticateToken = (req: AuthenticatedRequest, res: Response, next: NextFunction): Response | void => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Access token is missing or invalid' });
  }

  jwt.verify(token, SECRETKEY, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }

    // Сохраняем пользователя в запрос для дальнейшего использования
    req.user = user;
    next();
  });
};

