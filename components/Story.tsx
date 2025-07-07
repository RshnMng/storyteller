"use client";
import { Story as StoryType } from "../types/stories";
import { useEffect, useState } from "react";
import {
  CarouselApi,
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./ui/carousel";
import { Card, CardContent } from "@/components/ui/card";

interface Props {
  story: StoryType;
}

export const Story = ({ story }: Props) => {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!api) return;
    else {
      setCount(api.scrollSnapList().length);
      setCurrent(api.selectedScrollSnap() + 1);

      api.on("select", () => {
        setCurrent(api.selectedScrollSnap() + 1);
      });
    }
  }, [api]);

  return (
    <div>
      <div className="px-20">
        <Carousel
          setApi={setApi}
          className="w-full lg:w-4/5 h-56 mx-auto max-w-3xl"
        >
          <CarouselContent className="px-5">
            {story.pages.map((page, i) => {
              return (
                <CarouselItem key={i}>
                  <Card className="p-5 md:p-10 border bg-purple-200">
                    <h2 className="text-center text-gray-400">{story.story}</h2>
                    <CardContent className="p-5 xl:flex">
                      <img
                        src={page.png}
                        alt={`Page ${i + 1}`}
                        width={800}
                        height={800}
                        className="w-80 h-80 xl:w-[500px]xl:h-[500px] rounded-3xl mx-auto float-right p-5 xl:order-last"
                      />
                      <p className=" text-xl first-letter:text-3xl whitespace-pre-wrap">
                        {page.txt}
                      </p>
                    </CardContent>

                    <p className="text-center text-gray-500">
                      Page {current} of {count}
                    </p>
                  </Card>
                </CarouselItem>
              );
            })}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    </div>
  );
};
