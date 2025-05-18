export default async function GetChannels(
  token: string,
  guild_id: string,
): Promise<ResponseGuild[] | undefined> {
  const fetchData = await fetch(
    process.env.NEXT_PUBLIC_API_URL! + `/guilds/${guild_id}/channels`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    },
  );
  const responseChannels = await fetchData.json();
  console.log(responseChannels);
  return responseChannels;
}
