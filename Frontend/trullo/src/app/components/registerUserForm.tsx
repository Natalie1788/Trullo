import { REGISTER_USER } from "../mutations/userMutations";
import { useMutation} from "@apollo/client";
import { useState } from "react";

// Определение типов для мутации и ее возвращаемого значения
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
  // Определение состояний для хранения значений полей формы
  const [username, setUsername] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');

  // Использование мутации с типизацией данных и переменных
  const [registerUser, { loading }] = useMutation<RegisterUserData, RegisterUserVars>(REGISTER_USER, {
    onCompleted: (data) => {
      console.log('User registered successfully:', data.registerUser);
    },
    onError: (error) => {
      console.error('Error registering user:', error);
    }
  });

  // Типизация события формы
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (password === confirmPassword) {
      // Передача переменных в мутацию с типизацией
      registerUser({ variables: { username, email, password } });
    } else {
      console.error('Passwords do not match');
    }
    // Очистка полей формы после отправки
    setUsername('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Username:
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
      </label>
      <label>
        Email:
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </label>
      <label>
        Password:
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </label>
      <label>
        Confirm Password:
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
      </label>
      <button type="submit" disabled={loading}>
        {loading ? 'Registering...' : 'Register'}
      </button>
    </form>
  )
}

export default RegisterForm;
