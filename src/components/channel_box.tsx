import PostCreateChannel from '@/lib/create_channel';
import { useAuth } from '@clerk/nextjs';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { useState } from 'react';

export function ChannelBoxLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div className="h-8 p-1 m-1">{children}</div>;
}

export function ChannelBox({
  guildID,
  channelID,
  channelName,
}: {
  guildID: string;
  channelID: string;
  channelName: string;
}) {
  return (
    <ChannelBoxLayout>
      <Link
        href={`/channels/${guildID}/${channelID}`}
        className="block h-full w-full text-left"
      >
        # {channelName}
      </Link>
    </ChannelBoxLayout>
  );
}

export function AddChannelBox({ guildID }: { guildID: string }) {
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);

  return (
    <>
      <ChannelBoxLayout>
        <button
          onClick={() => setIsOpenModal(true)}
          className="h-full w-full text-left"
        >
          +
        </button>
      </ChannelBoxLayout>
      {isOpenModal && (
        <CreateChannelModal guildID={guildID} setIsOpen={setIsOpenModal} />
      )}
    </>
  );
}

export function CreateChannelModal({
  guildID,
  setIsOpen,
}: {
  guildID: string;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const { getToken } = useAuth();
  const actionCreateChannel = async (formData: FormData) => {
    const token = await getToken();
    if (token == undefined) {
      redirect('/');
    }
    const requestChannel = {
      name: formData.get('name'),
      description: formData.get('description'),
    } as RequestChannel;
    PostCreateChannel(token, guildID, requestChannel);
    setIsOpen(false);
  };

  return (
    <div className="absolute h-96 w-64 py-10 border-2 border-border top-0 bottom-0 right-0 left-0 m-auto text-center">
      <h1 className="my-2 text-3xl">チャンネルを作成</h1>
      <form action={actionCreateChannel}>
        <input
          type="text"
          name="name"
          placeholder="チャンネル名"
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
