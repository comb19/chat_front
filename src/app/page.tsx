import { SignInButton, SignUpButton } from '@clerk/nextjs';

export default function Page() {
  return (
    <div className="text-center">
      <h1 className="text-5xl mt-16 mb-8">Chat</h1>
      <div className="w-32 mx-auto my-2 text-2xl bg-accent">
        <SignInButton />
      </div>
      <div className="w-32 mx-auto my-2 text-2xl border border-border">
        <SignUpButton />
      </div>
    </div>
  );
}
