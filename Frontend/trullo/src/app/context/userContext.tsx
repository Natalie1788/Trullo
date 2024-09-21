import React, { createContext, useContext, useState, ReactNode } from 'react';

// Определение интерфейса для пользователя
interface User {
  id: string;
  username: string;
  email: string;
}

// Определение интерфейса для контекста пользователя
interface UserContextType {
  user: User | null; // Либо объект User, либо null, если пользователь не авторизован
  setUser: React.Dispatch<React.SetStateAction<User | null>>; // Функция для обновления состояния пользователя
}

// Создание контекста с указанием типа данных по умолчанию
const UserContext = createContext<UserContextType | undefined>(undefined);

// Кастомный хук для использования контекста
export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

// Типизация пропсов для провайдера контекста
interface UserProviderProps {
  children: ReactNode; // Любой React-компонент
}

// Провайдер контекста пользователя
export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
