import { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import { VscAccount } from "react-icons/vsc";
import { storage } from "~/firebase/firebase";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { Button } from "./Button";
import { api } from "~/utils/api";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import Image from "next/image";

export function UploadImageForm() {
  const [error, setError] = useState("");
  const [file, setFile] = useState<File | undefined>(undefined);
  const [image, setImage] = useState("");
  const session = useSession();
  if (!session.data?.user.id) return null;
  const trpcUtils = api.useUtils();
  const { mutate } = api.profile.uploadImage.useMutation({
    onError: (err) => {
      if (err) {
        toast.error(err.message);
        return;
      }
      console.log(err);
      toast.error("Somthing went wrong! Please try again!");
    },
    onSuccess: () => {
      toast.message("Image uploaded successfully! ");
      setImage("");
      trpcUtils.profile.getById.setData(
        { id: session.data?.user.id },
        (oldData) => {
          if (oldData == null) return;
          return {
            ...oldData,
            image: image,
          };
        },
      );
    },
  });

  useEffect(() => {
    const uploadFile = () => {
      const uniqueName = new Date().getTime() + file!.name; // to prevent overriding files, when uploading multiple
      const storageRef = ref(storage, uniqueName);
      const uploadTask = uploadBytesResumable(storageRef, file!);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(progress);
          switch (snapshot.state) {
            case "paused":
              console.log("Upload is paused");
              break;
            case "running":
              console.log("Upload is running");
              break;
          }
        },
        (error) => {
          setError(error.message);
          console.log(error);
        },
        () => {
          void getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setImage(downloadURL);
          });
        },
      );
    };
    file && uploadFile();
  }, [file]);

  function setImageToDB(image: string) {
    mutate({ image });
    setFile(undefined);
  }

  function discardChanges() {
    setFile(undefined);
    setImage("");
  }

  return (
    <>
      <div className="mt-4 flex justify-center px-4">
        <div className="relative max-w-[160px] space-y-3 rounded-2xl p-4 transition-colors duration-200 hover:bg-white/5">
          {image ? (
            <div className="mx-auto h-[100px] w-[100px] overflow-hidden rounded-full">
              <Image
                src={image}
                alt="uploaded image"
                width={100}
                height={100}
              />
            </div>
          ) : (
            <>
              <VscAccount className="mx-auto text-[5rem]" />
              <div className="flex items-center gap-2">
                <FaPlus /> Upload image
              </div>
            </>
          )}
          <input
            type="file"
            onChange={(e) => setFile(e.target.files![0])}
            className="absolute bottom-0 left-0 right-0 top-0 z-20 cursor-pointer opacity-0"
          />

          {error && <h1 className="text-center text-red-400">{error}</h1>}
        </div>
      </div>
      <div className="flex justify-end gap-4">
        <Button
          disabled={file == undefined}
          onClick={discardChanges}
          gray={true}
        >
          Discard
        </Button>
        <Button
          onClick={() => setImageToDB(image)}
          disabled={file == undefined}
        >
          Save
        </Button>
      </div>
    </>
  );
}
