'use client';
import PostCreateGuildInvitation from '@/lib/create_guild_invitation';
import { useAuth } from '@clerk/nextjs';
import { useState } from 'react';

export function CreateNewGuildInvitation({
  guildID,
  setIsOpen,
}: {
  guildID: string;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [invitationURL, setInvitationURL] = useState<string | undefined>(
    undefined,
  );
  const { getToken } = useAuth();

  const actionCreateGuildInvitation = async () => {
    const token = await getToken();
    const responseGuildInvitation = await PostCreateGuildInvitation(
      token!,
      guildID,
    );
    setInvitationURL(
      `${process.env.NEXT_PUBLIC_BASE_URL}/invitations/${responseGuildInvitation?.id}`,
    );
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(invitationURL!);
  };

  return (
    <div className="absolute h-56 w-64 py-10 border-2 border-border top-0 bottom-0 right-0 left-0 m-auto text-center">
      {invitationURL ? (
        <>
          <h1 className="my-2 text-3xl">招待リンク</h1>
          <button onClick={handleCopy} className="w-56 mb-2 bg-accent">
            リンクをコピー
          </button>
        </>
      ) : (
        <>
          <h1 className="my-2 text-3xl">ギルドへの招待を作成</h1>
          <form action={actionCreateGuildInvitation}>
            <button type="submit" className="w-32 my-1 text-2xl bg-accent">
              作成
            </button>
          </form>
        </>
      )}
      <button
        onClick={() => setIsOpen(false)}
        className="w-32 my-1 text-2xl border border-border"
      >
        閉じる
      </button>
    </div>
  );
}
