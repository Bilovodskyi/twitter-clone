import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";
import { getServerSession } from "next-auth";
import { getProviders, signIn } from "next-auth/react";
import { authOptions } from "~/server/auth";
import { FcGoogle } from "react-icons/fc";
import { Button } from "~/components/Button";
import { SwitchLoginPageLink } from "~/components/SwitchLink";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import {
  AuthCredentialsValidator,
  TAuthCredentialsValidator,
} from "~/utils/credentialsValidator";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

function SignIn({
  providers,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TAuthCredentialsValidator>({
    resolver: zodResolver(AuthCredentialsValidator),
  });

  function onSubmit({ email, password }: TAuthCredentialsValidator) {
    void signIn("credentials", { redirect: false, email, password }).then(
      (staff) => {
        if (staff?.status == 401) {
          toast.error("Wrong email or password!");
        } else {
          router.push("/");
        }
      },
    );

    // router.push("/");
  }
  // function handleSubmit(e: any) {
  //   e.preventDefault();
  //   signIn("credentials", { email, password });
  //   router.push("/");
  // }

  return (
    <div className="absolute bottom-0 left-0 right-0 top-0 z-20 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="z-30 w-[380px] cursor-default rounded-2xl bg-[#1b2730] px-5 py-3 mobile:w-[400px]">
        <div className="flex items-center justify-between">
          <h1 className="px-2 py-6 text-xl">Welcome back!</h1>
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
          <Button className="h-[50px]">Sign in</Button>
        </form>
        <p className="flex items-center whitespace-nowrap px-2 py-6 text-center text-[0.9rem] text-gray-300 before:mr-2 before:h-[1px] before:w-full before:bg-gray-300 after:ml-2 after:h-[1px] after:w-full after:bg-gray-300">
          or Log in with
        </p>

        {Object.values(providers).map(
          (provider) =>
            provider.name !== "Credentials" && (
              <div key={provider.name}>
                <button
                  className="flex h-[50px] w-full items-center justify-center gap-4 rounded-full bg-white text-gray-900"
                  onClick={() => signIn(provider.id)}
                >
                  <FcGoogle className="text-4xl" />
                  Sign in with {provider.name}
                </button>
              </div>
            ),
        )}
        <SwitchLoginPageLink isSigninPage={true} />
      </div>
    </div>
  );
}

export default SignIn;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession(context.req, context.res, authOptions);

  // If the user is already logged in, redirect.
  // Note: Make sure not to redirect to the same page
  // To avoid an infinite loop!
  if (session) {
    return { redirect: { destination: "/" } };
  }

  const providers = await getProviders();

  return {
    props: { providers: providers ?? [] },
  };
}
