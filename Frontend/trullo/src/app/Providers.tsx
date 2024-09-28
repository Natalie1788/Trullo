"use client"; // Обязательно добавьте эту строку для включения клиентского компонента

import { ApolloProvider } from '@apollo/client';
import client from "./ApolloClient"
import { UserProvider } from './context/userContext';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ApolloProvider client={client}>
      <UserProvider>{children}</UserProvider>
    </ApolloProvider>
  );
}
