import { Header } from "~/components/Header";
import { TweetCard } from "~/components/InfiniteTweetList";
import { LoadingSpinner } from "~/components/LoadingSpinner";
import { api } from "~/utils/api";

function Likes() {
  const tweets = api.tweet.infiniteFeed.useInfiniteQuery(
    {},
    { getNextPageParam: (lastPage) => lastPage.nextCursor },
  );
  const data = tweets.data?.pages.flatMap((page) => page.tweets);

  const { data: tweetsId } = api.tweet.likedTweets.useQuery();

  return (
    <div>
      <Header headerTitle={"Liked tweets"} />
      <div className="flex flex-col gap-4">
        {!data || !tweetsId ? (
          <LoadingSpinner />
        ) : (
          data?.map((tweet) => {
            if (tweetsId?.tweetsId.flat().includes(tweet.id)) {
              return <TweetCard {...tweet} />;
            }
          })
        )}
        {tweetsId?.tweetsId.flat().length == 0 && (
          <h2 className="text2xl my-2 text-center text-gray-500">
            No Liked Tweets
          </h2>
        )}
      </div>
    </div>
  );
}

export default Likes;
