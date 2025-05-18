export default async function GetMessages(
  token: string,
  channelID: string,
): Promise<Message[] | undefined> {
  const fetchData = await fetch(
    process.env.NEXT_PUBLIC_API_URL! + `/channels/${channelID}/messages`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    },
  );
  const responseMessages = await fetchData.json();
  return responseMessages;
}
