'use client';
import ChannelList from '@/components/channel_list';
import { use } from 'react';

export default function Layout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ guildID: string }>;
}>) {
  const { guildID } = use(params);
  return (
    <>
      <ChannelList guildID={guildID} />
      {children}
    </>
  );
}
