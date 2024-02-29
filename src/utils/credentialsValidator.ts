import { z } from "zod";

export const AuthCredentialsValidator = z.object({
  email: z.string().email(),
  name: z.string().optional(),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long!" }),
});

export type TAuthCredentialsValidator = z.infer<
  typeof AuthCredentialsValidator
>;

export const ChangeUserInformation = z.object({
  username: z
    .string()
    .min(3, { message: "The username must contain at least one character!" }),
});

export type TChangeUserInformation = z.infer<typeof ChangeUserInformation>;

export const ChangePassword = z
  .object({
    currentPassword: z
      .string()
      .min(8, { message: "Password must be at least 8 characters long!" }),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters long!" }),
    repeatPassword: z
      .string()
      .min(8, { message: "Password must be at least 8 characters long!" }),
  })
  .refine((data) => data.password === data.repeatPassword, {
    message: "Passwords don't match",
    path: ["repeatPassword"],
  });

export type TChangePassword = z.infer<typeof ChangePassword>;
