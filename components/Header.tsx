import { BookOpen, FilePen } from "lucide-react";
import Link from "next/link";

function Header() {
  return (
    <header className="relative p-16 text-center pt-24">
      <Link href="/">
        <h1 className="text-6xl font-black whitespace-nowrap">
          StoryTeller AI
        </h1>
        <div className="flex space-x-5 text-3xl lg:text-5xl justify-center whitespace-nowrap">
          <h2 className="">Bringing your stories</h2>
          <div className="relative">
            <div className="absolute bg-purple-500 -left-2 -top-1 bottom-1 -right-2 md:-left-3 md:-top-0 md:-bottom-0 md:-right-3 -rotate-1" />
            <p className="relative text-white italic">To Life!</p>
          </div>
        </div>
      </Link>

      {/* Nav Icons */}
      <div className="flex absolute -top-5 right-5 ">
        <Link href="/">
          <FilePen
            className="
        w-14 h-14 lg:h-20 lg:w-20  mx-auto text-purple-500 mt-10 mb-10 border border-purple-500  p-2 rounded-md hover:opacity-50 cursor-pointer
        "
          />
        </Link>
        <Link href="/stories">
          <BookOpen
            className="
        w-14 h-14 lg:h-20 lg:w-20  mx-auto text-purple-500 mt-10 border border-purple-500  p-2 rounded-md hover:opacity-50 cursor-pointer
        "
          />
        </Link>
      </div>
    </header>
  );
}
export default Header;
