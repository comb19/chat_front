export default async function Page({params}: {params: Promise<{guild_id: string}>}) {
    const {guild_id} = await params
    return <div>{guild_id}</div>
}