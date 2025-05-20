'use client';

import GetVerifyGuildInvitation from '@/lib/verify_invitation';
import { useAuth } from '@clerk/nextjs';
import Link from 'next/link';
import { use, useEffect, useState } from 'react';

export default function Page({
  params,
}: {
  params: Promise<{ invitationID: string }>;
}) {
  const { invitationID } = use(params);
  const { getToken } = useAuth();
  const [verified, setVerified] = useState<boolean | undefined>(undefined);

  useEffect(() => {
    const verifyInvitation = async () => {
      const token = await getToken();
      const fetchData = await GetVerifyGuildInvitation(token!, invitationID);
      setVerified(!!fetchData);
    };
    verifyInvitation();
  }, [getToken]);

  if (verified == undefined) {
    return (
      <div className="absolute h-96 w-64 py-10 border-2 border-border top-0 bottom-0 right-0 left-0 m-auto text-center">
        Loading
      </div>
    );
  } else {
    if (verified) {
      return (
        <div className="absolute h-96 w-64 py-10 border-2 border-border top-0 bottom-0 right-0 left-0 m-auto text-center">
          <h1>ようこそ！</h1>
          <Link href="/channels">ギルドに移動</Link>
        </div>
      );
    } else {
      return (
        <div className="absolute h-96 w-64 py-10 border-2 border-border top-0 bottom-0 right-0 left-0 m-auto text-center">
          <h1>駄目です</h1>
          <Link href="/channels">戻る</Link>
        </div>
      );
    }
  }
}
