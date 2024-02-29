import { useSession } from "next-auth/react";
import Link from "next/link";
import { Button } from "~/components/Button";
import { Header } from "~/components/Header";
import { LoadingSpinner } from "~/components/LoadingSpinner";
import { ProfileImage } from "~/components/ProfileImage";

import { api } from "~/utils/api";

function Followers() {
  const { data: users } = api.profile.followingList.useQuery();

  return (
    <div>
      <Header headerTitle={"Following"} />
      <div className="flex flex-col gap-4">
        {!users ? (
          <LoadingSpinner />
        ) : (
          users?.data.map((user) => {
            if (users.userId.flat().includes(user.id)) {
              return <FollowingCard id={user.id} />;
            }
          })
        )}
        {users?.userId.flat().length == 0 && (
          <h2 className="text2xl my-2 text-center text-gray-500">
            No Following Users
          </h2>
        )}
      </div>
    </div>
  );
}

function FollowingCard({ id }: FollowingCardProps) {
  const { data: profile } = api.profile.getById.useQuery({ id });
  const trpcUtils = api.useUtils();
  const session = useSession();
  if (!session.data?.user.id) return null;
  const toggleFollow = api.profile.toggleFollow.useMutation({
    onSuccess: ({ addedFollow }) => {
      const countModifier = addedFollow ? 1 : -1;
      trpcUtils.profile.getById.setData({ id }, (oldData) => {
        if (oldData == null) return;
        return {
          ...oldData,
          isFollowing: addedFollow,
          followersCount: oldData.followersCount + countModifier,
        };
      });
      trpcUtils.profile.getById.setData(
        { id: session.data?.user.id },
        (oldData) => {
          if (oldData == null) return;
          return {
            ...oldData,
            followsCount: oldData.followsCount + countModifier,
          };
        },
      );
    },
  });

  return (
    <div className="flex w-full justify-between rounded-2xl bg-[#1b2730] p-6">
      <div className="flex items-center gap-3">
        <ProfileImage src={profile?.image} />
        <Link
          href={`/profiles/${id}`}
          className="font-bold outline-none hover:underline focus-visible:underline"
        >
          <h1 className="capitalize">{profile?.name}</h1>
        </Link>
      </div>
      <div className="flex items-center">
        <Button
          small
          disabled={toggleFollow.isLoading}
          gray={profile?.isFollowing}
          onClick={() => toggleFollow.mutate({ userId: id })}
        >
          {profile?.isFollowing ? "Unfollow" : "Follow"}
        </Button>
      </div>
    </div>
  );
}

export default Followers;
