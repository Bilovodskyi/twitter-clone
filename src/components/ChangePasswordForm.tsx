import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { CiCircleQuestion } from "react-icons/ci";
import { toast } from "sonner";
import { api } from "~/utils/api";
import { ChangePassword, TChangePassword } from "~/utils/credentialsValidator";
import { Button } from "./Button";

export function ChangePasswordForm({ profile }: ChangePasswordFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, touchedFields },
  } = useForm<TChangePassword>({
    resolver: zodResolver(ChangePassword),
    resetOptions: {
      keepErrors: false,
    },
  });

  const { mutate } = api.profile.changePassword.useMutation({
    onError: (err) => {
      if (err) {
        toast.error(err.message);
        return;
      }
      console.log(err);
      toast.error("Somthing went wrong! Please try again!");
    },
    onSuccess: () => {
      toast.message("Password changed successfully! ");
      reset();
    },
  });

  function onSubmitPassword({ currentPassword, password }: TChangePassword) {
    mutate({ currentPassword: currentPassword, newPassword: password });
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmitPassword)}
      className="flex flex-col gap-6 rounded-2xl bg-[#1b2730] p-4 mobile:p-6"
    >
      <h1>Change password:</h1>
      <div className="h-[75px]">
        <input
          {...register("currentPassword")}
          disabled={profile?.isGoogle}
          type="password"
          className={`flex w-full gap-4 rounded-2xl bg-[#06121d]/20 p-4 outline-none ${
            errors?.currentPassword && "outline-1 outline-red-500"
          }`}
          placeholder="Current password"
        />
        {errors?.currentPassword && (
          <p className="p-2 text-sm text-red-500">
            {errors.currentPassword.message}
          </p>
        )}
      </div>
      <div className="h-[75px]">
        <input
          {...register("password")}
          disabled={profile?.isGoogle}
          type="password"
          className={`flex w-full gap-4 rounded-2xl bg-[#06121d]/20 p-4 outline-none ${
            errors?.password && "outline-1 outline-red-500"
          }`}
          placeholder="New password"
        />
        {errors?.password && (
          <p className="p-2 text-sm text-red-500">{errors.password.message}</p>
        )}
      </div>
      <div className="h-[75px]">
        <input
          {...register("repeatPassword")}
          disabled={profile?.isGoogle}
          type="password"
          className={`flex w-full gap-4 rounded-2xl bg-[#06121d]/20 p-4 outline-none ${
            errors?.repeatPassword && "outline-1 outline-red-500"
          }`}
          placeholder="Confirm password"
        />
        {errors?.repeatPassword && (
          <p className="p-2 text-sm text-red-500">
            {errors.repeatPassword.message}
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
              Users logged in with Google can't change their password
            </p>
          </div>
        )}
        <Button disabled={profile?.isGoogle}>Save</Button>
      </div>
    </form>
  );
}
