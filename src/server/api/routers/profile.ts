import { z } from "zod";
import { compare, hash } from "bcrypt";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const profileRouter = createTRPCRouter({
  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input: { id }, ctx }) => {
      const currentUserId = ctx.session?.user.id;
      const profile = await ctx.db.user.findUnique({
        where: { id },
        select: {
          name: true,
          image: true,
          isGoogleAccount: true,
          _count: { select: { followers: true, follows: true, tweets: true } },
          followers:
            currentUserId == null
              ? undefined
              : { where: { id: currentUserId } },
        },
      });

      if (profile == null) return;

      return {
        name: profile.name,
        image: profile.image,
        followersCount: profile._count.followers,
        followsCount: profile._count.follows,
        tweetsCount: profile._count.tweets,
        isFollowing: profile.followers.length > 0,
        isGoogle: profile.isGoogleAccount,
      };
    }),
  followingList: protectedProcedure.query(async ({ ctx }) => {
    const currentUserId = ctx.session?.user.id;
    const follows = await ctx.db.user.findMany({
      where: {
        id: currentUserId,
      },
      select: {
        follows: {},
      },
    });
    const users = await ctx.db.user.findMany({
      select: {
        id: true,
        image: true,
        name: true,
        followers:
          currentUserId == null ? undefined : { where: { id: currentUserId } },
      },
    });

    return {
      data: users.map((user) => {
        return {
          name: user.name,
          id: user.id,
          image: user.image,
          isFollowing: user.followers.length > 0,
        };
      }),
      userId: follows.map((user) => {
        return user.follows.map((userId) => {
          return userId.id;
        });
      }),
    };
  }),
  toggleFollow: protectedProcedure
    .input(z.object({ userId: z.string() }))
    .mutation(async ({ input: { userId }, ctx }) => {
      const currentUserId = ctx.session.user.id;

      const existingFollow = await ctx.db.user.findFirst({
        where: { id: userId, followers: { some: { id: currentUserId } } },
      });

      let addedFollow;
      if (existingFollow == null) {
        await ctx.db.user.update({
          where: { id: userId },
          data: { followers: { connect: { id: currentUserId } } },
        });
        addedFollow = true;
      } else {
        await ctx.db.user.update({
          where: { id: userId },
          data: { followers: { disconnect: { id: currentUserId } } },
        });
        addedFollow = false;
      }

      void ctx.revalidateSSG?.(`/profiles/${userId}`);
      void ctx.revalidateSSG?.(`/profiles/${currentUserId}`);

      return { addedFollow };
    }),
  changeUsername: protectedProcedure
    .input(z.object({ username: z.string() }))
    .mutation(async ({ input: { username }, ctx }) => {
      const currentUserId = ctx.session?.user.id;
      const existingUsername = await ctx.db.user.findFirst({
        where: {
          name: username,
        },
      });
      if (existingUsername) {
        throw new Error("Username already exist");
      }
      await ctx.db.user.update({
        where: {
          id: currentUserId,
        },
        data: {
          name: username,
        },
      });
      return username;
    }),
  changePassword: protectedProcedure
    .input(z.object({ currentPassword: z.string(), newPassword: z.string() }))
    .mutation(async ({ input: { currentPassword, newPassword }, ctx }) => {
      const currentUserId = ctx.session?.user.id;
      const existingUser = await ctx.db.user.findFirst({
        where: {
          id: currentUserId,
        },
      });
      if (!existingUser?.password) {
        throw new Error("User doesn't exist");
      }
      const matchingPassword = await compare(
        currentPassword,
        existingUser.password,
      );
      if (!matchingPassword) {
        throw new Error("Wrong password");
      }

      const hashedPassword = await hash(newPassword, 10);
      await ctx.db.user.update({
        where: {
          id: currentUserId,
        },
        data: {
          password: hashedPassword,
        },
      });
    }),
  uploadImage: protectedProcedure
    .input(z.object({ image: z.string() }))
    .mutation(async ({ input: { image }, ctx }) => {
      const currentUserId = ctx.session?.user.id;
      await ctx.db.user.update({
        where: {
          id: currentUserId,
        },
        data: {
          image: image,
        },
      });
    }),
  deleteUser: protectedProcedure
    // .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx }) => {
      const userId = ctx.session.user.id;
      await ctx.db.user.delete({
        where: {
          id: userId,
        },
      });
    }),
});
