export default function MessageItem(message: Message) {
  return (
    <li key={message.id}>
      <div key={message.id}>{message.user_name}</div>
      <div>{message.content}</div>
    </li>
  );
}
