export default function TodoBox({id, title, description}: Todo) {
    return (
        <div key={id}>
            <h1 className="text-2xl font-bold">{title}</h1>
            <p className="text-lg">{description}</p>
        </div>
    )
}