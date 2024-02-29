import { useSession } from "next-auth/react";

export let isAuth: boolean | null = null;

const session = useSession();

if (session.status == "authenticated") {
  isAuth = true;
} else {
  isAuth = false;
}
