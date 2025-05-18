export default async function PostCreateChannel(
  token: string,
  guildID: string,
  requestChannel: RequestChannel,
) {
  try {
    const fetchData = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL!}/guilds/${guildID}/channels`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestChannel),
      },
    );
    const fetchGuild = await fetchData.json();
    return fetchGuild;
  } catch {
    return null;
  }
}
