import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { IconHoverEffect } from "./IconHoverEffect";
import {
  VscHeart,
  VscHome,
  VscOrganization,
  VscSettingsGear,
  VscSignIn,
  VscSignOut,
} from "react-icons/vsc";
import { FaTwitter } from "react-icons/fa";
import { ProfileInformation } from "./ProfileInformation";
import { Button } from "./Button";

export function SideNav() {
  const session = useSession();
  const user = session.data?.user;

  return (
    <nav className="sticky top-0 flex flex-col gap-4 px-2 py-4 mobile:px-6">
      <Link href="/" className="mb-2 ml-6 h-[43px] w-[43px]">
        <FaTwitter className="text-[2.5rem] text-[#03a9f4]" />
      </Link>
      {user != null ? (
        <ProfileInformation id={user.id} />
      ) : (
        <div className="flex h-[250px] w-full flex-col items-center justify-center gap-6 rounded-2xl bg-[#1b2730] px-6 mobile:w-[300px]">
          <VscSignIn className="h-10 w-10" />
          <h2 className="text-center">
            Create account or Log in to like posts and follow creators.
          </h2>
          <Button gray={false} onClick={() => void signIn()}>
            Log in
          </Button>
        </div>
      )}
      {user != null && (
        <ul className="flex flex-col items-start gap-2 whitespace-nowrap">
          <li className="hidden mobile:block">
            <Link href="/">
              <IconHoverEffect>
                <span className="flex items-center gap-4">
                  <VscHome className="h-6 w-6" />
                  <span className="text-lg">Home</span>
                </span>
              </IconHoverEffect>
            </Link>
          </li>

          <li className="w-full mobile:w-auto">
            <Link href="/likes">
              <IconHoverEffect>
                <span className="flex items-center gap-4">
                  <VscHeart className="h-6 w-6" />
                  <span className="text-lg">Likes</span>
                </span>
              </IconHoverEffect>
            </Link>
          </li>

          <li className="w-full mobile:w-auto">
            <Link href="/following">
              <IconHoverEffect>
                <span className="flex items-center gap-4">
                  <VscOrganization className="h-6 w-6" />
                  <span className="text-lg">Following</span>
                </span>
              </IconHoverEffect>
            </Link>
          </li>

          <li className="w-full mobile:w-auto">
            <Link href="/settings">
              <IconHoverEffect>
                <span className="flex items-center gap-4">
                  <VscSettingsGear className="h-6 w-6" />
                  <span className="text-lg">Settings</span>
                </span>
              </IconHoverEffect>
            </Link>
          </li>
          <li className="w-full mobile:w-auto">
            <button onClick={() => void signOut()} className="w-full">
              <IconHoverEffect>
                <span className="flex items-center gap-4">
                  <VscSignOut className="h-6 w-6 fill-red-700" />
                  <span className="text-lg text-red-700">Log out</span>
                </span>
              </IconHoverEffect>
            </button>
          </li>
        </ul>
      )}
    </nav>
  );
}
