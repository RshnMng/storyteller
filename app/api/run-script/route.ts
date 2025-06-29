import { NextRequest } from "next/server";
import { RunEventType, RunOpts } from "@gptscript-ai/gptscript";
import g from "@/lib/gptScriptsInstance";

const script = "app/api/run-script/story-book.gpt";

export async function POST(request: NextRequest) {
  const { story, pages, path } = await request.json();

  const safeStory = story.replace(/"/g, '\\"');

  const opts: RunOpts = {
    input: `--story ${safeStory} --pages ${pages} --path ${path}`,
  };

  try {
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          const run = await g.run(script, opts);

          run.on(RunEventType.Event, (data) => {
            controller.enqueue(
              encoder.encode(`event: ${JSON.stringify(data)}\n\n`)
            );
          });

          console.log("Starting run...");
          await run.text();
          console.log("Run finished.");

          controller.enqueue(
            encoder.encode(
              `event: ${JSON.stringify({ type: "runFinished" })}\n\n`
            )
          );
          controller.close();
        } catch (error) {
          controller.error(error);
          console.log(error, "error");
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.log(error, "error ");
    return new Response(JSON.stringify({ error: error }), {
      status: 500,
    });
  }
}
