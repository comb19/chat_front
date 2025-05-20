import PostCreateGuild from '@/lib/create_guild';
import { useAuth } from '@clerk/nextjs';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { useState } from 'react';

export function GuildBoxLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <li className="flex jusitify-center items-center border rounded-md border-border w-16 h-16 m-2">
      {children}
    </li>
  );
}

export function GuildBox({
  guildID,
  guildName,
}: {
  guildID: string;
  guildName: string;
}) {
  return (
    <GuildBoxLayout>
      <Link href={`/channels/${guildID}`} className="m-1 truncate">
        {guildName}
      </Link>
    </GuildBoxLayout>
  );
}

export function AddGuildBox({
  setGuilds,
}: {
  setGuilds: React.Dispatch<React.SetStateAction<ResponseGuild[] | undefined>>;
}) {
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);

  return (
    <>
      <GuildBoxLayout>
        <button
          onClick={() => setIsOpenModal(true)}
          className="w-full h-full text-3xl"
        >
          +
        </button>
      </GuildBoxLayout>
      {isOpenModal && (
        <CreateGuildModal setIsOpen={setIsOpenModal} setGuilds={setGuilds} />
      )}
    </>
  );
}

export function CreateGuildModal({
  setIsOpen,
  setGuilds,
}: {
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setGuilds: React.Dispatch<React.SetStateAction<ResponseGuild[] | undefined>>;
}) {
  const { getToken } = useAuth();
  const actionCreateGuild = async (formData: FormData) => {
    const token = await getToken();
    if (token == undefined) {
      redirect('/');
    }
    const requestGuild = {
      name: formData.get('name'),
      description: formData.get('description'),
    } as RequestChannel;
    const newGuild = await PostCreateGuild(token, requestGuild);
    setIsOpen(false);
    setGuilds((guilds) => {
      if (guilds) {
        return [...guilds, newGuild];
      } else {
        return [newGuild];
      }
    });
  };

  return (
    <div className="absolute h-96 w-64 py-10 border-2 border-border top-0 bottom-0 right-0 left-0 m-auto text-center">
      <h1 className="my-2 text-3xl">ギルドを作成</h1>
      <form action={actionCreateGuild}>
        <input
          type="text"
          name="name"
          placeholder="ギルド名"
          className="w-56 my-1 text-xl border border-border"
        />
        <textarea
          name="description"
          placeholder="説明"
          className="w-56 h-32 my-1 text-lg border border-border resize-none"
        />
        <button type="submit" className="w-32 my-1 text-2xl bg-accent">
          作成
        </button>
      </form>
      <button
        onClick={() => setIsOpen(false)}
        className="w-32 my-1 text-2xl border border-border"
      >
        閉じる
      </button>
    </div>
  );
}
