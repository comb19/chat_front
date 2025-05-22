'use client';
import { CreateNewGuildInvitation } from '@/components/guild_invitation';
import GuildList from '@/components/guild_list';
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from '@clerk/nextjs';
import { useParams } from 'next/navigation';
import { useState } from 'react';

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const params = useParams();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  return (
    <div className="overflow-y-hidden h-screen flex flex-col">
      <header className="flex justify-end items-center p-4 gap-4 h-10 border-b-2 border-b-border">
        {typeof params.guildID == 'string' && (
          <button onClick={() => setIsOpen(true)}>招待</button>
        )}
        <SignedOut>
          <SignInButton />
          <SignUpButton />
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </header>
      <div className="flex-1 flex divide-x-1 divide-border w-screen h-full">
        <GuildList />
        {children}
      </div>
      {typeof params.guildID == 'string' && isOpen && (
        <CreateNewGuildInvitation
          guildID={params.guildID}
          setIsOpen={setIsOpen}
        />
      )}
    </div>
  );
}
