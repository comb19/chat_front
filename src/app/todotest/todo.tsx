'use client';

import { useState } from "react";

  

export default function CreateTodo() {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    const onSubmitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const body = JSON.stringify({ title, description });
        console.log(body);
        const res = await fetch('http://localhost:3001/todos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: body,
        });

        console.log(res);
    }

    return (
        <form onSubmit={onSubmitHandler} className="flex flex-col items-center justify-between ">
            <input type="text" value={title} onChange={e => setTitle(e.target.value)}/>
            <input type="text" value={description} onChange={e => setDescription(e.target.value)}/>
            <button type="submit">Create Todo</button>
        </form>
    )
}