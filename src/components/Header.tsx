import Link from "next/link";
import { IconHoverEffect } from "./IconHoverEffect";
import { VscArrowLeft } from "react-icons/vsc";
import { useSession } from "next-auth/react";
import { api } from "~/utils/api";
import { LoadingSpinner } from "./LoadingSpinner";

export function Header({ headerTitle }: { headerTitle: string }) {
  const session = useSession();
  if (!session.data?.user.id) return null;
  const { data: profile } = api.profile.getById.useQuery({
    id: session.data?.user.id,
  });

  if (!profile?.name) {
    return <LoadingSpinner />;
  }

  return (
    <header className="sticky top-0 z-10 mb-3 flex items-center bg-[#06121d] py-2">
      <Link href=".." className="mr-2">
        <IconHoverEffect>
          <VscArrowLeft className="h-6 w-6" />
        </IconHoverEffect>
      </Link>

      {headerTitle == "Settings" ? (
        <div className="flex-grow">
          <h1 className="text-lg font-bold">{headerTitle}</h1>
        </div>
      ) : (
        <div className="ml-2 flex-grow">
          <h1 className="text-lg font-bold capitalize">{profile?.name}</h1>

          <div className="text-gray-500">
            <p>{headerTitle}</p>
          </div>
        </div>
      )}
    </header>
  );
}
