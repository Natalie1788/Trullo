"use client"

import { useMutation } from "@apollo/client";
import { useState, FormEvent } from "react";
import { CREATE_TASK } from "../../mutations/taskMutations"

// Интерфейсы для мутации и её возвращаемых данных
interface CreateTaskData {
  createTask: {
    id: string;
    title: string;
    description: string;
  };
}

interface CreateTaskVars {
  title: string;
  description: string;
}

export default function CreateTask() {
  // Состояния для хранения значений полей формы и ошибок
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [errors, setErrors] = useState<string[]>([]);

  // Мутация с типизацией данных и переменных
  const [createTask, { loading }] = useMutation<CreateTaskData, CreateTaskVars>(CREATE_TASK);

  // Функция отправки формы
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Получаем токен из локального хранилища
    const token = (typeof window !== 'undefined') ? localStorage.getItem('token') : null;
    console.log('Token:', token);

    if (!token) {
      console.error('Error: No token found. Please log in.');
      setErrors(["No token found. Please log in."]);
      return;
    }

    // Проверка заполненности полей
    if (!title || !description) {
      setErrors(["Please fill in all required fields."]);
      return;
    }

    try {
      // Выполнение мутации
      await createTask({
        variables: { title, description },
        context: { headers: { Authorization: `Bearer ${token}` } },
      });

      // Очистка полей формы после успешного создания задачи
      setTitle("");
      setDescription("");
      setErrors([]);
    } catch (error: any) { // Используем `any` для универсальной обработки ошибок
      console.error('Error creating task:', error);

      // Определение типа ошибки и формирование сообщения
      if (error.networkError) {
        setErrors(["Network error: Unable to reach the server. Please try again later."]);
      } else if (error.graphQLErrors && error.graphQLErrors.length > 0) {
        // Если есть ошибки GraphQL, отображаем их
        const gqlErrors = error.graphQLErrors.map((err: any) => err.message);
        setErrors(gqlErrors);
      } else {
        // Обработка других ошибок
        setErrors([error.message || "An unexpected error occurred. Please try again later."]);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Title:
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </label>
      <br />
      <label>
        Description:
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
      </label>
      <br />
      {errors.length > 0 && (
        <div>
          {errors.map((error, index) => (
            <p key={index} style={{ color: 'red' }}>
              {error}
            </p>
          ))}
        </div>
      )}
      <button type="submit" disabled={loading}>
        {loading ? "Loading..." : "Create Task"}
      </button>
    </form>
  );
}
