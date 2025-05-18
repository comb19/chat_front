export default async function PostCreateGuild(
  token: string,
  requestGuild: RequestChannel,
) {
  try {
    const fetchData = await fetch(
      process.env.NEXT_PUBLIC_API_URL! + '/guilds',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestGuild),
      },
    );
    const fetchGuild = await fetchData.json();
    console.log(fetchGuild);
    return fetchGuild;
  } catch {
    return null;
  }
}
