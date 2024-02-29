import { useSession } from "next-auth/react";
import { Button } from "~/components/Button";
import { Header } from "~/components/Header";
import { LoadingSpinner } from "~/components/LoadingSpinner";
import { api } from "~/utils/api";
import { CiCircleQuestion } from "react-icons/ci";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChangeUserInformation } from "~/utils/credentialsValidator";
import type { TChangeUserInformation } from "~/utils/credentialsValidator";
import { toast } from "sonner";
import { UploadImageForm } from "~/components/UploadImageForm";
import { ChangePasswordForm } from "~/components/ChangePasswordForm";
import { DeleteAccountForm } from "~/components/DeleteAccountForm";

function Settings() {
  const session = useSession();
  if (!session.data?.user.id) return null;

  const { data: profile } = api.profile.getById.useQuery({
    id: session.data?.user.id,
  });
  const trpcUtils = api.useUtils();
  const { mutate } = api.profile.changeUsername.useMutation({
    onError: (err) => {
      if (err) {
        toast.error(err.message);
        return;
      }
      console.log(err);
      toast.error("Somthing went wrong! Please try again!");
    },
    onSuccess: (username) => {
      toast.message("Username changed successfully! ");
      trpcUtils.profile.getById.setData(
        { id: session.data?.user.id },
        (oldData) => {
          if (oldData == null) return;
          return {
            ...oldData,
            name: username,
          };
        },
      );
      reset();
    },
  });
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TChangeUserInformation>({
    resolver: zodResolver(ChangeUserInformation),
    resetOptions: {
      keepErrors: false,
    },
  });
  function onSubmitUsername({ username }: TChangeUserInformation) {
    mutate({ username });
  }
  if (!profile?.name) {
    return <LoadingSpinner />;
  }
  return (
    <div>
      <Header headerTitle="Settings" />
      <div className="flex flex-col gap-5">
        <form
          onSubmit={handleSubmit(onSubmitUsername)}
          className="flex flex-col gap-6 rounded-2xl bg-[#1b2730] p-4 mobile:p-6"
        >
          <h1>Change username:</h1>
          <div className="h-[75px]">
            <input
              {...register("username")}
              disabled={profile?.isGoogle}
              className={`flex w-full gap-4 rounded-2xl bg-[#06121d]/20 p-4 outline-none ${
                errors?.username && "outline-1 outline-red-500"
              }`}
              placeholder={
                profile?.name.charAt(0)?.toUpperCase() + profile?.name.slice(1)
              }
              type="text"
            />
            {errors?.username && (
              <p className="p-2 text-sm text-red-500">
                {errors.username.message}
              </p>
            )}
          </div>
          <div
            className={`flex w-full ${
              profile?.isGoogle ? "justify-between" : "justify-end"
            }`}
          >
            {profile?.isGoogle && (
              <div className="flex items-center gap-2">
                <CiCircleQuestion className="text-[1.25rem]" />
                <p className="text-[0.75rem] text-gray-400">
                  Users logged in with Google can't change their username
                </p>
              </div>
            )}
            <Button disabled={profile?.isGoogle}>Save</Button>
          </div>
        </form>
        <ChangePasswordForm profile={profile} />
        <div className="flex flex-col gap-2 rounded-2xl bg-[#1b2730] p-4 mobile:p-6">
          <h1>Change profile image</h1>
          <UploadImageForm />
        </div>
        <DeleteAccountForm />
      </div>
    </div>
  );
}

export default Settings;
