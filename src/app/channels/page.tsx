'use client';
import { useAuth } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import { FormEvent } from 'react';

export default function Page() {
  const { getToken } = useAuth();

  const postChannel = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const token = await getToken();
    const res = await fetch(process.env.NEXT_PUBLIC_API_URL + '/channels', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(Object.fromEntries(formData)),
    });
    if (!res.ok) {
      console.log(res.status);
      return;
    }
    const data = await res.json();
    console.log(data);
    redirect('/channels/' + data.id);
  };
  console.log('環境変数');
  console.log(process.env.NEXT_PUBLIC_API_URL);

  return (
    <div>
      <form onSubmit={postChannel} method="POST">
        <h1>一時チャットを作成</h1>
        <input type="text" name="name" placeholder="Channel Name" />
        <input type="text" name="description" placeholder="Description" />
        <input type="submit" value="Create Channel" />
      </form>
    </div>
  );
}
