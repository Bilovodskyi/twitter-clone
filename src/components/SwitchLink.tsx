import Link from "next/link";
import { useEffect, useState } from "react";

type SwitchLoginPageLinkProps = {
  isSigninPage: boolean;
};

export function SwitchLoginPageLink({
  isSigninPage,
}: SwitchLoginPageLinkProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);
  if (isClient) {
    return (
      <div className="p-6 text-center text-[0.9rem] text-[#03a9f4]">
        {isSigninPage ? "Don`t have an account?" : "Already have an account?"}
        <Link
          href={isSigninPage ? "/signup" : "/signin"}
          className="ml-2 cursor-pointer underline underline-offset-2"
        >
          {isSigninPage ? "Sign up" : "Sign in"}
        </Link>
      </div>
    );
  }
}
