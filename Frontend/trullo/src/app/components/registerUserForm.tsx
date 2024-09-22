"use client"

import { useMutation } from "@apollo/client";
import { useState } from "react";
import styles from "../styles/LogRegister.module.css";
import { REGISTER_USER } from "../mutations/userMutations";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface RegisterUserData {
  registerUser: {
    id: string;
    username: string;
    email: string;
  };
}

interface RegisterUserVars {
  username: string;
  email: string;
  password: string;
}

const RegisterForm = () => {
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [errors, setErrors] = useState<string[]>([]);

  const router = useRouter();

  const [registerUser, { loading }] = useMutation<RegisterUserData, RegisterUserVars>(REGISTER_USER);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      setErrors(["Passwords do not match"]);
      return;
    }
    try {
      const response = await registerUser({ variables: { username, email, password } });
      console.log("User registered successfully:", response.data?.registerUser);
      // Очистка полей формы после успешной регистрации
      setUsername("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      router.push("/login");
      alert("User registered successfully");
      
    } catch (error: any) { // Используем `any`, чтобы избежать проблем с типизацией
      console.error("Error registering user:", error);
      // Проверка на сетевые ошибки
      if (error.networkError && typeof error.networkError === "object") {
        const networkError = error.networkError as any; // Используем any, чтобы избежать проблем с типами
        if (networkError.result && Array.isArray(networkError.result.errors)) {
          setErrors(networkError.result.errors.map((err: { message: string }) => err.message));
        }
      } else if (error.graphQLErrors) {
        setErrors(error.graphQLErrors.map((err: any) => err.message));
      } else {
        setErrors([error.message]);
      }
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      {errors.length > 0 && (
        <div>
          <ul>
            {errors.map((error, index) => (
              <li key={index} style={{ color: "red" }}>
                {error}
              </li>
            ))}
          </ul>
        </div>
      )}

      <h1>Register new user</h1>

      <label>
        Username:
        <input
          className={styles.input}
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
      </label>
      <label>
        Email:
        <input
          className={styles.input}
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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
          required
        />
      </label>
      <label>
        Confirm Password:
        <input
          className={styles.input}
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
      </label>
      <button type="submit" disabled={loading}>
        {loading ? "Registering..." : "Register"}
      </button>

      <Link href="/login">Have already an account? Please sign in here</Link>
    </form>
  );
};

export default RegisterForm;
