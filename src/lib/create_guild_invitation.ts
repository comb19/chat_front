export default async function PostCreateGuildInvitation(
  token: string,
  guildID: string,
) {
  try {
    const fetchData = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL!}/invitations/guilds`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ guild_id: guildID }),
      },
    );
    const responseGuildInvitation = (await fetchData.json()) as GuildInvitation;
    return responseGuildInvitation;
  } catch {
    return null;
  }
}
