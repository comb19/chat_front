import GetChannels from '@/lib/get_channels';
import { useAuth } from '@clerk/nextjs';
import { redirect, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { AddChannelBox, ChannelBox } from './channel_box';

export default function ChannelList({ guildID }: { guildID: string }) {
  const { getToken } = useAuth();
  const [channels, setChannels] = useState<ResponseChannel[] | undefined>(
    undefined,
  );
  const params = useParams();

  useEffect(() => {
    const fetchChannels = async () => {
      const token = await getToken();
      if (token === null) {
        throw new Error('not logged in');
      }

      const responseChannels = await GetChannels(token, guildID);
      if (responseChannels === undefined) {
        throw new Error('failed to fetch');
      }

      setChannels(responseChannels);
      if (
        responseChannels &&
        responseChannels.length > 0 &&
        !params?.channelID
      ) {
        redirect(`/channels/${guildID}/${responseChannels[0].id}`);
      }
    };
    try {
      fetchChannels();
    } catch {
      redirect('/');
    }
  }, [getToken]);

  return (
    <div className="w-48">
      {channels ? (
        channels.map((channel: ResponseChannel) => (
          <ChannelBox
            key={channel.id}
            guildID={guildID}
            channelID={channel.id}
            channelName={channel.name}
          />
        ))
      ) : (
        <div>loading</div>
      )}
      <AddChannelBox guildID={guildID} />
    </div>
  );
}
