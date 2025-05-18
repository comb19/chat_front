import { use } from 'react';

export default function Page({
  params,
}: {
  params: Promise<{ guildID: string }>;
}) {
  const { guildID } = use(params);
  return <div>{guildID}</div>;
}
