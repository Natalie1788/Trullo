import jwt, { JwtPayload } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { IUserWithToken } from '../types/userTypes';

const SECRETKEY = process.env.SECRET_KEY || 'defaultsecret'; // Указываем тип для SECRETKEY

// Интерфейс для пользователя, который будет использоваться для создания токена


// Интерфейс для расширения объекта Request с полем user
export interface AuthenticatedRequest extends Request {
 user?: string | JwtPayload & { id?: string; email?: string } | string;
}

export const generateToken = (user: IUserWithToken): string => {
  return jwt.sign({ id: user._id, email: user.email }, SECRETKEY, {
    expiresIn: '1h', // Токен истекает через 1 час
  });
};

/*export const authenticateToken = (req: AuthenticatedRequest, res: Response, next: NextFunction): Response | void => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  console.log(token);
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
};*/

/*export const verifyToken = (req: AuthenticatedRequest): JwtPayload | string => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    throw new Error('Access token is missing or invalid');
  }

  try {
    // Проверяем токен и возвращаем данные пользователя
    const user = jwt.verify(token, SECRETKEY);
    return user;
  } catch (err) {
    throw new Error('Invalid or expired token');
  }
}*/

// Тип для данных, которые будут в токене
interface TokenPayload extends JwtPayload {
  id: string;
  email: string;
}

export const verifyToken = (req: AuthenticatedRequest): TokenPayload => {
  const authHeader = req.headers['authorization'];
  console.log(authHeader);

  if (!authHeader) {
    throw new Error('Authorization header is missing');
  }

  const token = authHeader.split(' ')[1];

  if (!token) {
    throw new Error('Token is missing');
  }

  try {
    // Приводим результат к типу TokenPayload
    const decoded = jwt.verify(token, process.env.SECRETKEY || 'defaultsecret') as JwtPayload;

    // Проверяем, что результат — это объект, а не строка
    if (typeof decoded === 'object' && 'id' in decoded) {
      return decoded as TokenPayload; // Указываем, что это TokenPayload
    } else {
      throw new Error('Invalid token format');
    }
  } catch (err) {
    throw new Error('Invalid or expired token');
  }
};


