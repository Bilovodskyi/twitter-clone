import { useSession } from "next-auth/react";
import { Button } from "./Button";
import { ProfileImage } from "./ProfileImage";
import { useCallback, useLayoutEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import { api } from "~/utils/api";

function updateTextAreaSize(textArea?: HTMLTextAreaElement) {
  if (textArea == null) return;
  textArea.style.height = "0";
  textArea.style.height = `${textArea.scrollHeight}px`;
}

export function NewTweetForm() {
  const session = useSession();
  if (session.status !== "authenticated")
    return (
      <div className="flex h-[75px] w-full items-center">
        <h1 className="text-xl">Recent tweets:</h1>
      </div>
    );
  return <Form />;
}

function Form() {
  const session = useSession();
  const [inputValue, setInputValue] = useState("");
  const textAreaRef = useRef<HTMLTextAreaElement>();
  const inputRef = useCallback((textArea: HTMLTextAreaElement) => {
    updateTextAreaSize(textArea);
    textAreaRef.current = textArea;
  }, []);

  const trpcUtils = api.useUtils();

  useLayoutEffect(() => {
    updateTextAreaSize(textAreaRef.current);
  }, [inputValue]);

  const createTweet = api.tweet.create.useMutation({
    onSuccess: (newTweet) => {
      setInputValue("");

      if (session.status !== "authenticated") return null;

      trpcUtils.tweet.infiniteFeed.setInfiniteData({}, (oldData) => {
        if (!oldData?.pages[0]) return;

        const newCacheData = {
          ...newTweet,
          likeCount: 0,
          likedByMe: false,
          user: {
            id: session.data.user.id,
            name: session.data.user.name ?? null,
            image: session.data.user.image ?? null,
          },
        };

        return {
          ...oldData,
          pages: [
            {
              ...oldData.pages[0],
              tweets: [newCacheData, ...oldData.pages[0].tweets],
            },
            ...oldData.pages.slice(1),
          ],
        };
      });
      trpcUtils.profile.getById.setData(
        { id: session.data?.user.id },
        (oldData) => {
          if (oldData == null) return;
          return {
            ...oldData,
            tweetsCount: oldData.tweetsCount + 1,
          };
        },
      );
    },
  });
  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    createTweet.mutate({ content: inputValue });
  }
  if (session.status !== "authenticated") return null;

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="mb-4 mt-6 flex flex-col gap-2 rounded-2xl bg-[#1b2730] px-4 py-4"
      >
        <div className="flex gap-4">
          <ProfileImage src={session.data.user.image} />
          <textarea
            ref={inputRef}
            style={{ height: 0 }}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="flex-grow resize-none overflow-hidden rounded-2xl bg-white/10 p-4 text-lg outline-none"
            placeholder="What is happening ?!"
          />
        </div>
        <Button className="self-end">Post</Button>
      </form>
    </>
  );
}
