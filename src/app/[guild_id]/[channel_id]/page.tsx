export default async function Page({params}: {params: Promise<{channel_id: string}>}) {
    const {channel_id} = await params
    return <div>{channel_id}</div>
}