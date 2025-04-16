import CreateTodo from "./todo";

export default async function Home() {
  const data = await fetch('http://localhost:8080/todos')
  const todos = await data.json();
  
  return (
    <main className="flex flex-col items-center justify-between ">
      {todos.map((todo: { id: number; title: string, description: string }) => (
        <div key={todo.id} className="text-bold text-2xl">
          {todo.title}
          <p className="text-lg">{todo.description}</p>
        </div>
      ))}
      <CreateTodo /> 
    </main>
  );
}
