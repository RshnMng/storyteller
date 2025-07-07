"use client";
import { useEffect, useState } from "react";
import { Textarea } from "./ui/textarea";
import { toast } from "sonner";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "./ui/select";
import { Button } from "./ui/button";
import { Frame } from "@gptscript-ai/gptscript";
import renderEventMessage from "@/lib/renderEventMessage";
import { v4 as uuidv4 } from "uuid";
import { useRouter } from "next/navigation";

const storiesPath = "./public/stories";

function Storywriter() {
  const [story, setStory] = useState<string>("");
  const [pages, setPages] = useState<number>(0);
  const [progress, setProgress] = useState<string>("");
  const [runStarted, setRunStarted] = useState<boolean>(false);
  const [runFinished, setRunFinished] = useState<boolean | null>(null);
  const [currentTool, setCurrentTool] = useState("");
  const [events, setEvents] = useState<Frame[]>([]);
  const router = useRouter();

  async function runScript() {
    setRunStarted(true);
    setRunFinished(false);

    const response = await fetch("/api/run-script", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ story, pages, path: storiesPath }),
    });

    if (response.ok && response.body) {
      console.log("streaming started");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      handleStream(reader, decoder);
    } else {
      setRunFinished(true);
      setRunStarted(false);
      console.error("failed to start stream");
    }
  }

  async function handleStream(
    reader: ReadableStreamDefaultReader<Uint8Array>,
    decoder: TextDecoder
  ) {
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });

      const events = buffer.split("\n\n");

      // Process all complete events except possibly incomplete last one
      for (let i = 0; i < events.length - 1; i++) {
        let eventStr = events[i];
        if (eventStr.startsWith("event: ")) {
          eventStr = eventStr.replace(/^event: /, "");
        }
        try {
          const parsedData = JSON.parse(eventStr);
          handleParsedData(parsedData);
        } catch (e) {
          console.error("Failed to parse JSON:", e);
        }
      }

      // Keep the last chunk (likely incomplete) in buffer
      buffer = events[events.length - 1];
    }

    // After done, try to parse the remaining buffer if not empty
    if (buffer.trim() !== "") {
      let eventStr = buffer;
      if (eventStr.startsWith("event: ")) {
        eventStr = eventStr.replace(/^event: /, "");
      }
      try {
        const parsedData = JSON.parse(eventStr);
        handleParsedData(parsedData);
      } catch (e) {
        console.error("Failed to parse JSON at end of stream:", e);
      }
    }

    function handleParsedData(parsedData: any) {
      if (parsedData.type === "callProgress") {
        setProgress(parsedData.output[parsedData.output.length - 1].content);
        setCurrentTool(parsedData.tool?.description || "");
      } else if (parsedData.type === "callStart") {
        setCurrentTool(parsedData.tool?.description || "");
      } else if (parsedData.type === "runFinished") {
        setRunFinished(true);
        setRunStarted(false);
      } else {
        const id = uuidv4();
        setEvents((prevEvents) => [...prevEvents, { ...parsedData, id }]);
      }
    }
  }

  useEffect(() => {
    if (runFinished) {
      toast.success("Story generated successfully", {
        action: (
          <Button
            className="bg-purple-500 ml-auto"
            onClick={() => router.push("/stories")}
          >
            View Stories
          </Button>
        ),
      });
    }
  }, [runFinished, router]);

  return (
    <div className="flex flex-col container mx-auto">
      <section className="flex-1 flex flex-col rounded-md p-10 space-y-2">
        <Textarea
          onChange={(e) => setStory(e.target.value)}
          value={story}
          className="flex-1 text-black"
          placeholder="Write a story about a robot and a human who become friends..."
        />
        <Select onValueChange={(value) => setPages(parseInt(value))}>
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
          disabled={!story || !pages || runStarted}
          className="w-full"
          size="lg"
          onClick={runScript}
        >
          Generate Story
        </Button>
      </section>
      <section className="flex-1 pb-5 mt-5 bg-pink-200">
        <div className="flex flex-col-reverse w-full space-y-2 bg-gray-800 rounded-md text-gray-200 font-mono p-10 h-96 overflow-y-scroll ">
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
          ;
          <div className="space-y-5">
            {events.map((event) => (
              <div key={uuidv4()}>
                <span className="mr-5">{">>"}</span>
                {renderEventMessage(event)}
              </div>
            ))}
          </div>
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
