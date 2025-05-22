export default async function GetVerifyGuildInvitation(
  token: string,
  guildInvitationID: string,
) {
  try {
    const fetchData = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL!}/invitations/guilds/${guildInvitationID}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return fetchData.status == 202;
  } catch {
    return null;
  }
}
