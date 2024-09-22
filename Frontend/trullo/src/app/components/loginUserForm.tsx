"use client"

import { useState } from "react";
import { useMutation } from "@apollo/client";
import { LOGIN_USER } from "../mutations/userMutations";
import styles from "../styles/LogRegister.module.css"
import Link from "next/link";

// Интерфейс для данных, которые возвращает мутация логина
interface LoginUserData {
  loginUser: {
    token: string;
    user: {
      id: string;
      username: string;
      email: string;
    };
  };
}

// Интерфейс для переменных, которые передаются в мутацию логина
interface LoginUserVars {
  email: string;
  password: string;
}

const LoginUserForm = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  // Использование мутации с типизацией данных и переменных
  const [loginUser, { loading }] = useMutation<LoginUserData, LoginUserVars>(LOGIN_USER, {
    onCompleted: (data) => {
      // Здесь можно сохранить токен в localStorage или context
      console.log('User logged in successfully:', data.loginUser);
      localStorage.setItem('token', data.loginUser.token);
    },
    onError: (error) => {
      console.error('Error logging in user:', error);
    }
  });

  // Типизация события формы
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Отправка данных для логина
    loginUser({ variables: { email, password } });

    // Очистка полей формы после отправки
    setEmail('');
    setPassword('');
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <h1>Sign in</h1>

      <label>
        Email:
        <input className={styles.input}
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </label>
      <label>
        Password:
        <input className={styles.input}
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </label>
      <button type="submit" disabled={loading}>
        {loading ? 'Logging in...' : 'Login'}
      </button>

      <Link href="/register">Do not have an account? Create here</Link>
    </form>
  );
}

export default LoginUserForm;
