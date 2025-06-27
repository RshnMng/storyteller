import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import Storywriter from "@/components/Storywriter";

export default function Home() {
  return (
    <main className="flex-1 flex flex-col">
      {/* UI component */}
      <section className="flex-1 grid grid-cols-1 lg:grid-cols-2">
        <div className="bg-purple-400 flex flex-col space-y-5 justify-center items-center order-1 lg:-order-1 pb-10">
          {/* insert logo here later with Image imported from next/image */}
          <img
            src="https://freepngimg.com/save/40968-fairytale-castle-free-clipart-hd/565x565"
            alt="castle"
            height={250}
            width={250}
          />
          <Button
            asChild
            className="px-20 bg-purple-700 p-10 text-xl font-bold"
          >
            <Link href="/stories">Explore Story Library</Link>
          </Button>
        </div>

        {/* story writer  */}

        <Storywriter />
      </section>
    </main>
  );
}
