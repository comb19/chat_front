'use client';

import { useEffect, useState } from "react";
import CreateTodo from "./todo";
import { useAuth } from "@clerk/nextjs";
import TodoBox from "@/components/todo";

export default function Home() {
  const [todos, setTodos] = useState<Todo[] | null>(null);
  const { getToken } = useAuth();

  useEffect(() => {
    async function fetchTodos() {
      const token = await getToken();
      const response =  await fetch('http://localhost:3001/todos', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setTodos(data);
    }
    fetchTodos();
  }, [getToken]);

  if (todos == null) {
    return <div>Loading...</div>;
  }
  else {
  return (
    <main className="flex flex-col items-center justify-between ">
      {todos.map((todo: Todo) => (
        TodoBox(todo)
      ))}
      <CreateTodo /> 
    </main>
  );}
}
