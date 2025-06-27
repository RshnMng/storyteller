"use client";
import { useState } from "react";
import { Textarea } from "./ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "./ui/select";
import { Button } from "./ui/button";

function Storywriter() {
  const [storyInput, setStoryInput] = useState<string>("");
  const [storyPages, setStoryPage] = useState<number>();

  return (
    <div className="flex flex-col container">
      <section className="flex-1 flex flex-col rounded-md p-10 space-y-2">
        <Textarea
          onChange={(e) => setStoryInput(e.target.value)}
          value={storyInput}
          className="flex-1 text-black"
          placeholder="Write a story about a robot and a human who become friends..."
        />
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="How many pages should the story be?" />
          </SelectTrigger>
          <SelectContent className="w-full">
            {Array.from({ length: 10 }, (_, i) => {
              return (
                <SelectItem value={String(i + 1)} key={i}>
                  {i + 1}
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>

        <Button className="w-full" size="lg">
          Generate Story
        </Button>
      </section>
      <section className="flex-1 pb-5 mt-5 bg-pink-200"></section>
    </div>
  );
}
export default Storywriter;
