import GuilList from '@/components/guild_list';
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from '@clerk/nextjs';

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className=" h-screen flex flex-col overflow-y-hidden">
      <header className="flex justify-end items-center p-4 gap-4 h-10 border-b-2 border-b-border">
        <SignedOut>
          <SignInButton />
          <SignUpButton />
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </header>
      <div className="flex-1 flex divide-x-1 divide-border w-screen h-full">
        <GuilList />
        {children}
      </div>
    </div>
  );
}
