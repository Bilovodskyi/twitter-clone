type ButtonProps = {
  small?: boolean;
  gray?: boolean;
  className?: string;
} & DetailedHTMLProps<
  ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>;

type ProfileImageProps = {
  src?: string | null;
  className?: string;
};

type Tweet = {
  id: string;
  content: string;
  createdAt: Date;
  likeCount: number;
  likedByMe: boolean;
  user: { id: string; image: string | null; name: string | null };
};

type InfiniteTweetListProps = {
  isLoading: boolean;
  isError: boolean;
  hasMore: boolean | undefined;
  fetchNewTweets: () => Promise<unknown>;
  tweets?: Tweet[];
};

type HeartButtonProps = {
  onClick: () => void;
  isLoading: boolean;
  likedByMe: boolean;
  likeCount: number;
};

type IconHoverEffectProps = {
  children: ReactNode;
  red?: boolean;
};

type LoadingSpinnerProps = {
  big?: boolean;
};

type FollowButtonProps = {
  userId: string;
  isFollowing: boolean;
  isLoading: boolean;
  onClick: () => void;
};

type FollowingCardProps = {
  id: string;
};

type ProfileInformationProps = {
  // followers: number;
  // image: string | null;
  // following: number;
  // tweets: number;
  // name: string | null;
  id: string;
};

// type Profile = {
//   name: string | null;
//   image: string | null;
//   followersCount: number;
//   followsCount: number;
//   tweetsCount: number;
//   isFollowing: boolean;
//   isGoogle: boolean;
// };

type ChangePasswordFormProps = {
  profile:
    | {
        name: string | null;
        image: string | null;
        followersCount: number;
        followsCount: number;
        tweetsCount: number;
        isFollowing: boolean;
        isGoogle: boolean;
      }
    | undefined;
};
