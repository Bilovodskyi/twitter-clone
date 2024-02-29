import { Button } from "~/components/Button";
import { SwitchLoginPageLink } from "~/components/SwitchLink";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AuthCredentialsValidator,
  TAuthCredentialsValidator,
} from "~/utils/credentialsValidator";
import { api } from "~/utils/api";
import { toast } from "sonner";
import { ZodError } from "zod";
import { useRouter } from "next/navigation";
import { useState } from "react";

function SignUp() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TAuthCredentialsValidator>({
    resolver: zodResolver(AuthCredentialsValidator),
  });
  // const [username, setUsername] = useState("");
  // const [email, setEmail] = useState("");
  // const [password, setPassword] = useState("");

  const { mutate, isLoading } = api.auth.createNewUser.useMutation({
    onError: (err) => {
      if (err) {
        toast.error(err.message);
        return;
      }
      toast.error("Somthing went wrong! Please try again!");
    },
    onSuccess: () => {
      toast.message("Account created successfully!");
      router.push("/signin");
    },
  });

  function onSubmit({ password, email, name }: TAuthCredentialsValidator) {
    mutate({
      email,
      username: name!,
      password,
    });
  }

  // function handleSubmit(e: any) {
  //   e.preventDefault();
  //   mutate({ email, username, password });
  // }

  return (
    <div className="absolute bottom-0 left-0 right-0 top-0 z-20 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="z-30 w-[380px] cursor-default rounded-2xl bg-[#1b2730] px-5 py-3 mobile:w-[400px]">
        <div className="flex items-center justify-between">
          <h1 className="px-2 py-6 text-xl">Create account!</h1>
          <div
            onClick={() => router.push("/")}
            className="cursor-pointer px-2 text-xl"
          >
            {" "}
            &#x2715;
          </div>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
          <div className="h-[85px]">
            <input
              {...register("name")}
              className="h-[50px] w-full rounded-2xl bg-transparent/20 p-4 outline-none"
              placeholder="Enter your username"
              type="text"
            />
          </div>
          <div className="h-[85px]">
            <input
              {...register("email")}
              className="h-[50px] w-full rounded-2xl bg-transparent/20 p-4 outline-none"
              placeholder="Enter your email"
              type="email"
            />
            {errors?.email && (
              <p className="px-2 text-sm text-red-500">
                {errors.email.message}
              </p>
            )}
          </div>
          <div className="h-[85px]">
            <input
              {...register("password")}
              className="h-[50px] w-full rounded-2xl bg-transparent/20 p-4 outline-none"
              placeholder="Password"
              type="password"
            />
            {errors?.password && (
              <p className="px-2 text-sm text-red-500">
                {errors.password.message}
              </p>
            )}
          </div>
          <Button disabled={isLoading} className="h-[50px]">
            Sign up
          </Button>
        </form>

        <SwitchLoginPageLink isSigninPage={false} />
      </div>
    </div>
  );
}

export default SignUp;
