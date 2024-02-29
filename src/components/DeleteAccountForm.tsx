import { signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Button } from "./Button";
import { api } from "~/utils/api";
import { toast } from "sonner";

export function DeleteAccountForm() {
  const [modalOpen, setModalOpen] = useState(false);
  const session = useSession();
  const username = session.data?.user.name;
  const email = session.data?.user.email;

  const { mutate } = api.profile.deleteUser.useMutation({
    onError: (err) => {
      if (err) {
        console.log(err);
      }
    },
    onSuccess: () => {
      toast.message("Account deleted successfully!");
      signOut();
    },
  });

  useEffect(() => {
    if (document) {
      document.body.style.overflow = modalOpen ? "hidden" : "auto";
    }
  }, [modalOpen]);

  function handleDeleteAccount() {
    mutate();
  }
  return (
    <>
      <div className="group mb-[60px] flex flex-col gap-6 rounded-2xl bg-[#1b2730] p-4 mobile:mb-[40px] mobile:p-6">
        <h1>Danger zone:</h1>

        <Button
          className="bg-red-500 hover:bg-red-500/70"
          onClick={() => {
            setModalOpen(true);
          }}
        >
          Delete my account
        </Button>
      </div>
      <div
        className={`${
          modalOpen ? "fixed" : "hidden"
        } bottom-0 left-0 right-0 top-0 z-30 flex h-full items-center justify-center bg-black/50 backdrop-blur-sm`}
      >
        <div className="flex h-[220px] w-[380px] flex-col justify-between rounded-2xl bg-[#1b2730] mobile:w-[450px]">
          <div className="flex justify-between border-b border-gray-700 px-3 py-2">
            <div className="flex items-end justify-center gap-1">
              <p className="text-[0.9rem]">Delete acount</p>
              <p className="text-[0.9rem]">{username}</p>
            </div>
            <button
              // onClick={() => router.push("/settings")}
              onClick={() => {
                setModalOpen(false);
              }}
              className="cursor-pointer px-2 text-xl"
            >
              {" "}
              &#x2715;
            </button>
          </div>

          <div className="flex flex-col items-center justify-center gap-2">
            <p className="text-[1.2rem]">{username}</p>
            <p className="text-[0.9rem] text-gray-500">{email}</p>
          </div>
          <div className="flex justify-center border-t border-gray-700 p-3">
            <button
              onClick={handleDeleteAccount}
              className="w-full cursor-pointer rounded-[5px] bg-white/10 p-2 text-[0.9rem] outline-none hover:bg-white/20"
            >
              I want to delete my account
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
