"use client";

import { createContext, useContext, ReactNode } from "react";

export type UserPayload = {
  sub: string;
  name: string;
  email: string;
  role: string;
} | null;

interface UserContextType {
  user: UserPayload;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({
  user,
  children,
}: {
  user: UserPayload;
  children: ReactNode;
}) {
  return (
    <UserContext.Provider value={{ user }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context.user;
}
