export default async function GetGuilds(
  token: string,
): Promise<ResponseGuild[] | undefined> {
  const fetchData = await fetch(process.env.NEXT_PUBLIC_API_URL! + '/guilds', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
  const responseGuilds = await fetchData.json();
  console.log(responseGuilds);
  return responseGuilds;
}
