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
  const [storyPages, setStoryPages] = useState<number>();
  const [progress, setProgress] = useState<string>("");
  const [runStarted, setRunStarted] = useState<boolean>(false);
  const [runFinished, setRunFinished] = useState<boolean | null>(null);
  const [currentTool, setCurrentTool] = useState("");

  return (
    <div className="flex flex-col container mx-auto">
      <section className="flex-1 flex flex-col rounded-md p-10 space-y-2">
        <Textarea
          onChange={(e) => setStoryInput(e.target.value)}
          value={storyInput}
          className="flex-1 text-black"
          placeholder="Write a story about a robot and a human who become friends..."
        />
        <Select onValueChange={(value) => setStoryPages(parseInt(value))}>
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

        <Button
          disabled={!storyInput || !storyPages}
          className="w-full"
          size="lg"
        >
          Generate Story
        </Button>
      </section>
      <section className="flex-1 pb-5 mt-5 bg-pink-200">
        <div className="flex flex-col-reverse w-full space-y-2 bg-gray-800 rounded-md text-gray-200 font-mono p-10 h-96 everflow-y-scroll">
          <div>
            {runFinished === null && (
              <>
                <p className="animate-pulse">
                  Im waiting for you to Generate a story...
                </p>{" "}
              </>
            )}
            <span className="mr-5">{">>"}</span>
            {progress}
          </div>

          {currentTool && (
            <div className="py-10">
              <span className="mr-5">{`--- [Current Tool] --- `}</span>
              {currentTool}
            </div>
          )}

          {runStarted && (
            <div>
              <span className="mr-5 animate-in">{`--- [AI Storyteller Has Started!] --- `}</span>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
export default Storywriter;
