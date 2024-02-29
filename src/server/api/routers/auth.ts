import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { NextResponse } from "next/server";
import { hash } from "bcrypt";

export const authRouter = createTRPCRouter({
  createNewUser: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        password: z.string().min(8),
        username: z.string(),
      }),
    )
    .mutation(async ({ input: { email, password, username }, ctx }) => {
      const existingUserByEmail = await ctx.db.user.findUnique({
        where: {
          email: email,
        },
      });
      if (existingUserByEmail) {
        throw new Error("This email is already in use!");
      }
      const existingUserByUsername = await ctx.db.user.findUnique({
        where: {
          name: username,
        },
      });
      if (existingUserByUsername) {
        throw new Error("User with this username already exist!");
      }

      const hashedPassword = await hash(password, 10);
      await ctx.db.user.create({
        data: {
          email,
          name: username,
          password: hashedPassword,
          isGoogleAccount: false,
        },
      });
      return NextResponse.json(
        { message: "User created successfully!" },
        { status: 201 },
      );
    }),
});
