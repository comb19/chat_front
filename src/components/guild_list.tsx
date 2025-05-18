'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@clerk/nextjs';
import GetGuilds from '@/lib/get_guilds';
import { AddGuildBox, GuildBox } from './guild_box';
import { redirect, useParams } from 'next/navigation';

export default function GuilList() {
  const { getToken } = useAuth();
  const [guilds, setGuilds] = useState<ResponseGuild[] | undefined>(undefined);
  const params = useParams();

  console.log(params);
  useEffect(() => {
    const fetchGuilds = async () => {
      const token = await getToken();
      if (token === null) {
        throw new Error('not logged in');
      }

      const responseGuilds = await GetGuilds(token);
      if (responseGuilds === undefined) {
        throw new Error('failed to fetch');
      }

      setGuilds(responseGuilds);
      if (responseGuilds && responseGuilds.length > 0) {
        if (!params?.guildID) {
          redirect(`/channels/${responseGuilds[0].id}`);
        }
      }
    };
    try {
      fetchGuilds();
    } catch {
      redirect('/');
    }
    console.log(guilds);
  }, [getToken]);

  return (
    <ul className="flex-none">
      {guilds === undefined ? (
        <li>loading</li>
      ) : (
        guilds.map((guilds: ResponseGuild) => (
          <GuildBox
            key={guilds.id}
            guildID={guilds.id}
            guildName={guilds.name}
          />
        ))
      )}
      <AddGuildBox />
    </ul>
  );
}
