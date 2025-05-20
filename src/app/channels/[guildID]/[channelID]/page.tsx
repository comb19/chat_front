'use client';

import MessageItem from '@/components/message';
import GetAChannel from '@/lib/get_a_channel';
import GetMessages from '@/lib/get_messages';
import { useAuth } from '@clerk/nextjs';
import { FormEventHandler, use, useEffect, useRef, useState } from 'react';

export default function Page({
  params,
}: {
  params: Promise<{ guildID: string; channelID: string }>;
}) {
  const { channelID } = use(params);
  const { getToken } = useAuth();
  const socketRef = useRef<WebSocket | null>(null);
  const [channel, setChannel] = useState<ResponseChannel | undefined>(
    undefined,
  );
  const [messages, setMessages] = useState<Message[]>([]);

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    console.log('handleSubmit');
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    console.log(socketRef.current);
    socketRef.current?.send(
      JSON.stringify({
        action: 'send',
        channel_id: channelID,
        content: formData.get('message'),
      }),
    );
  };

  useEffect(() => {
    const fetchChannel = async () => {
      const token = await getToken();
      const channel = await GetAChannel(token!, channelID);
      setChannel(channel);
    };
    fetchChannel();
  }, [getToken, channelID]);

  useEffect(() => {
    const fetchMessages = async () => {
      console.log('get messages');
      const token = await getToken();
      const data = await GetMessages(token!, channelID);
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
              created_at: msg.created_at,
            } as Message;
          }),
        );
      }
      console.log('finished to get messages');
    };
    fetchMessages();
  }, [channelID, getToken]);

  useEffect(() => {
    const establishWebSocketConnection = async () => {
      const token = await getToken();
      if (socketRef.current != null) {
        return;
      }
      const socket = new WebSocket(
        process.env.NEXT_PUBLIC_API_URL + '/ws/messages/' + channelID,
      );
      socketRef.current = socket;

      const onOpen = () => {
        console.log('WebSocket connection established');
        socket.send(
          JSON.stringify({
            action: 'authorization',
            channel_id: channelID,
            token: token,
          }),
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
      socket.addEventListener('close', () => {
        console.log('websocket closed!');
      });

      return () => {
        console.log('WebSocket connection closed');
        socket.close();
        socket.removeEventListener('open', onOpen);
        socket.removeEventListener('message', onMessage);
      };
    };
    establishWebSocketConnection();
  }, [channelID, getToken]);

  return (
    <div className="flex-grow flex flex-col">
      <div className="w-full border-b border-b-border h-18 p-1">
        <h1 className="text-3xl"># {channel?.name}</h1>
        <p>{channel?.description}</p>
      </div>
      <div className="flex-1 flex flex-col h-full pb-4 px-1">
        <ul className="flex-1 h-full">
          {messages.map((message: Message) => MessageItem(message))}
        </ul>
        <form onSubmit={handleSubmit} className="flex w-full h-8 bottom-0">
          <textarea
            name="message"
            placeholder="Type your message here"
            className="flex-grow border border-border resize-none mr-1 px-1"
          ></textarea>
          <input type="submit" value=">" className="w-8 bg-accent" />
        </form>
      </div>
    </div>
  );
}
