import { VscLocation } from "react-icons/vsc";
import { ProfileImage } from "./ProfileImage";
import { api } from "~/utils/api";
import { getPlural } from "~/pages/profiles/[id]";

export function ProfileInformation({ id }: ProfileInformationProps) {
  const { data: profile } = api.profile.getById.useQuery({ id });
  console.log(profile?.image);

  return (
    <div className="flex h-[250px] w-full flex-col items-center gap-4 rounded-2xl bg-[#1b2730] py-6 mobile:w-[300px]">
      <ProfileImage src={profile?.image} />
      <h2 className="capitalize">{profile?.name}</h2>
      <h3 className="flex items-center gap-2 text-[0.75rem]">
        <VscLocation className="text-[1rem]" />
        Canada
      </h3>
      <div className="flex gap-6">
        <div>
          <h2 className="text-[0.9rem] text-gray-400">
            {getPlural(profile?.tweetsCount!, "Tweet", "Tweets")}
          </h2>
          <h3 className="text-center">{profile?.tweetsCount!}</h3>
        </div>
        <div>
          <h2 className="text-[0.9rem] text-gray-400">
            {getPlural(profile?.followersCount!, "Follower", "Followers")}
          </h2>
          <h3 className="text-center">{profile?.followersCount!}</h3>
        </div>
        <div>
          <h2 className="text-[0.9rem] text-gray-400">Following</h2>
          <h3 className="text-center">{profile?.followsCount}</h3>
        </div>
      </div>
    </div>
  );
}
