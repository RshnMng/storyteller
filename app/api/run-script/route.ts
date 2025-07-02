import { NextRequest } from "next/server";
import { RunEventType, RunOpts } from "@gptscript-ai/gptscript";
import g from "@/lib/gptScriptsInstance";
import path from "path";
import fs from "fs";

const script = "app/api/run-script/story-book.gpt";

export async function POST(request: NextRequest) {
  const { story, pages, path: relativePath } = await request.json();

  function sanitizeForFilename(input: string): string {
    return input.replace(/[<>:"/\\|?*\x00-\x1F]/g, "").trim();
  }

  const safeStory = sanitizeForFilename(story);

  const absolutepath = path.resolve(process.cwd(), relativePath);

  console.log("Resolved path:", absolutepath);

  if (!fs.existsSync(absolutepath)) {
    try {
      fs.mkdirSync(absolutepath, { recursive: true });
      console.log("✅ Created manually from backend");
    } catch (err) {
      console.error("❌ Manual mkdir failed:", err);
    }
  }

  console.log(safeStory, "safe story");

  const opts: RunOpts = {
    input: `--story ${safeStory} --pages ${pages} --path ${absolutepath}`,
  };

  try {
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          console.log("Resolved path:", absolutepath);

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
