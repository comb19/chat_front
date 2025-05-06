'use client';

import MessageItem from '@/components/message';
import { useAuth } from '@clerk/nextjs';
import { FormEventHandler, use, useEffect, useRef, useState } from 'react';

export default function Page({
  params,
}: {
  params: Promise<{ channel_id: string }>;
}) {
  const { channel_id } = use(params);
  const { getToken } = useAuth();
  const socketRef = useRef<WebSocket | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    console.log('handleSubmit');
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    socketRef.current?.send(
      JSON.stringify({
        action: 'message',
        channel_id: channel_id,
        content: formData.get('message'),
      })
    );
  };

  useEffect(() => {
    const fetchMessages = async () => {
      console.log('get messages');
      const token = await getToken();
      const messages = await fetch(
        process.env.NEXT_PUBLIC_API_URL! + '/messages/' + channel_id,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log('unti');
      const data = await messages.json();
      console.log('init fetch');
      console.log(data);
      console.log(Array.isArray(data));
      if (Array.isArray(data)) {
        setMessages(
          data.map((msg) => {
            return {
              id: msg.id,
              user_id: msg.user_id,
              user_name: msg.user_name,
              channel_id: msg.channel_id,
              content: msg.content,
            } as Message;
          })
        );
      }
      console.log('finished to get messages');
    };
    fetchMessages();
  }, [channel_id, getToken]);

  useEffect(() => {
    const establishWebSocketConnection = async () => {
      const token = await getToken();
      const socket = new WebSocket(
        process.env.NEXT_PUBLIC_API_URL + '/ws/messages/' + channel_id
      );
      socketRef.current = socket;

      const onOpen = () => {
        console.log('WebSocket connection established');
        socket.send(
          JSON.stringify({
            user_id: 'user_id',
            channel_id: channel_id,
            token: token,
          })
        );
      };
      const onMessage = (event: MessageEvent<string>) => {
        console.log('WebSocket message received');
        console.log(event.data);
        setMessages((prevMessages) => {
          console.log('add message!');
          const newMessage = JSON.parse(event.data) as Message;
          console.log(newMessage);
          return [...prevMessages, newMessage];
        });
      };

      socket.addEventListener('open', onOpen);
      socket.addEventListener('message', onMessage);

      return () => {
        console.log('WebSocket connection closed');
        socket.close();
        socket.removeEventListener('open', onOpen);
        socket.removeEventListener('message', onMessage);
      };
    };
    establishWebSocketConnection();
  }, [channel_id, getToken]);

  return (
    <div>
      <h1>Channel ID: {channel_id}</h1>
      {messages.map((message: Message) => MessageItem(message))}
      <form onSubmit={handleSubmit}>
        <textarea
          name="message"
          placeholder="Type your message here"
        ></textarea>
        <input type="submit" value="Send" />
      </form>
    </div>
  );
}
