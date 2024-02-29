import { VscSearch } from "react-icons/vsc";

export function SearchAndTrendsNav() {
  return (
    <nav className="mobile:px-6 mobile:pt-3 sticky top-0 flex flex-col gap-4 px-2 pt-5">
      <div className="flex h-[44px] w-full items-center gap-4 rounded-full bg-[#1b2730] px-6">
        <VscSearch className="text-[1.1rem]" />
        <input
          className="w-full bg-transparent outline-none"
          placeholder="Search Twitter"
        />
      </div>

      <div className="mobile:w-[400px] mt-3 flex w-full flex-col gap-4 rounded-2xl bg-[#1b2730] p-6">
        <h1 className="text-xl">What’s happening</h1>
        <h1 className="text-lg text-gray-500">Trending</h1>
        <div>
          <p className="text-[0.9rem] text-gray-500">Sports:</p>
          <p>Liverpool</p>
          <p className="text-[0.9rem] text-gray-500">50 Tweets</p>
        </div>
        <div className="mb-4">
          <p className="text-[0.9rem] text-gray-500">Politics:</p>
          <p>Poland</p>
          <p className="text-[0.9rem] text-gray-500">15 Tweets</p>
        </div>
        <div className="h-[1px] w-full bg-gray-500"></div>
        <h1 className="text-lg text-gray-500">Trending in Canada</h1>
        <div>
          <p className="text-[0.9rem] text-gray-500">Weather:</p>
          <p>Weather in Calgary</p>
          <p className="text-[0.9rem] text-gray-500">35 Tweets</p>
        </div>
        <div className="mb-4">
          <p className="text-[0.9rem] text-gray-500">Toronto:</p>
          <p>Toronto Police</p>
          <p className="text-[0.9rem] text-gray-500">11 Tweets</p>
        </div>
      </div>
    </nav>
  );
}
