"use client";

import { useState } from "react";
import { useMutation } from "@apollo/client";
import { LOGIN_USER } from "../../mutations/userMutations";
import styles from "../../styles/LogRegister.module.css"
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUser } from "../../context/userContext";

// Интерфейс для данных пользователя
interface User {
  id: string;
  username: string;
  email: string;
}

// Интерфейс для данных, которые возвращает мутация логина
interface LoginUserData {
  loginUser: {
    token: string;
    user: User;
  };
}

// Интерфейс для переменных, которые передаются в мутацию логина
interface LoginUserVars {
  email: string;
  password: string;
}

const LoginUserForm = () => {
  const { user, setUser } = useUser();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const router = useRouter();

  // Использование мутации с типизацией данных и переменных
  const [loginUser, { loading }] = useMutation<LoginUserData, LoginUserVars>(LOGIN_USER);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      // Выполнение мутации логина
      const { data } = await loginUser({
        variables: { email, password },
      }) as { data: LoginUserData }; // Явная типизация data

      // Получаем токен и данные пользователя
      const { token, user } = data.loginUser;
      console.log("User logged in:", user);

      // Сохраняем токен в локальное хранилище
      localStorage.setItem("token", token);
      console.log("Token saved:", token);

      // Сохраняем информацию о пользователе в контексте
      setUser(user);
      console.log("User set in context:", user);
      console.log("Current user from context:", useUser().user);
      router.push('/account');

      // Очищаем поля формы после успешного логина
      setEmail("");
      setPassword("");

    } catch (err) {
      console.error("Login error:", err.message);
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <h1>Sign in</h1>

      <label>
        Email:
        <input
          className={styles.input}
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          required
        />
      </label>
      <label>
        Password:
        <input
          className={styles.input}
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          required
        />
      </label>
      <button type="submit" disabled={loading}>
        {loading ? 'Logging in...' : 'Login'}
      </button>

      <Link href="/register">Do not have an account? Create here</Link>
    </form>
  );
};

export default LoginUserForm;
