//
//
import { Story } from "@/types/stories";
import getAllStories from "@/lib/stories";
import Link from "next/link";
import { BookOpen } from "lucide-react";

export const revalidate = 0;

function Stories() {
  const stories: Story[] = getAllStories();

  return (
    <div className="p-10 max-w-7xl mx-auto">
      {stories.length === 0 && <p>No stories found.</p>}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
        {stories.map((story) => {
          return (
            <Link
              key={story.story}
              href={`/stories/${story.story}`}
              className="border rounded-lg cursor-pointer hover:shadow-2xl translation-all duration-300 ease-in-out bg-purple-300 pb-1"
            >
              <div className="relative">
                <p className="absolute flex items-center top-0 right-0 z-50 bg-white text-purple-800 font-bold p-2 rounded-lg m-1">
                  <BookOpen className="w-4 h-4 mr-1" />
                  {story.pages.length === 1
                    ? `${story.pages.length} Page`
                    : `${story.pages.length} Pages`}
                </p>
                <img
                  src={story.pages[0].png}
                  alt={story.story}
                  width={100}
                  height={100}
                  className="w-full object-contain rounded-t-lg"
                />
              </div>
              <h2 className="text-lg p-1 first-letter:text-3xl font-light text-center">
                {story.story}
              </h2>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
export default Stories;
