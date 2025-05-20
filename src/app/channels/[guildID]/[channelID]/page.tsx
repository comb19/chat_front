'use client';

import MessageItem from '@/components/message';
import GetAChannel from '@/lib/get_a_channel';
import GetMessages from '@/lib/get_messages';
import { useAuth } from '@clerk/nextjs';
import { use, useEffect, useRef, useState } from 'react';

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
  const [message, setMessage] = useState<string>('');

  const handleEnter = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.code == 'Enter' && (e.ctrlKey || e.metaKey)) {
      handleSend();
    }
  };

  const handleSend = () => {
    if (message.length == 0) {
      return;
    }
    socketRef.current?.send(
      JSON.stringify({
        action: 'send',
        channel_id: channelID,
        content: message,
      }),
    );
    setMessage('');
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
    <div className="flex-grow" onKeyDown={handleEnter}>
      <div className="w-full border-b border-b-border h-18 p-1">
        <h1 className="text-3xl"># {channel?.name}</h1>
        <p>{channel?.description}</p>
      </div>
      <div className="pb-4 px-1">
        <ul className="h-[calc(100vh-var(--spacing)*38)] overflow-y-scroll">
          {messages.map((message: Message) => MessageItem(message))}
        </ul>
        <div className="flex w-full h-10 py-1">
          <textarea
            placeholder="Type your message here"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="flex-grow border border-border resize-none mr-1 px-1"
          ></textarea>
          <button onClick={handleSend} className="w-8 bg-accent">
            {'>'}
          </button>
        </div>
      </div>
    </div>
  );
}
