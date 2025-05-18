export default async function GetAChannel(
  token: string,
  channelID: string,
): Promise<ResponseChannel | undefined> {
  const fetchData = await fetch(
    process.env.NEXT_PUBLIC_API_URL! + `/channels/${channelID}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    },
  );
  const responseChannel = await fetchData.json();
  console.log(responseChannel);
  return responseChannel;
}
