import { format } from 'date-fns';
export default function MessageItem(message: Message) {
  return (
    <li key={message.id} className="mb-1">
      <div className="h-6">
        <span className="text-lg text-accent mr-2">{message.user_name}</span>
        <span className="text-sm">
          {format(new Date(message.created_at), 'yyyy年MM月dd日 HH:mm')}
        </span>
      </div>
      <div>{message.content}</div>
    </li>
  );
}
