import { createUIMessageStream, JsonToSseTransformStream } from "ai";
import { getLatestStreamId } from "@/lib/redis/client";
import { getStreamContext } from "../../route";

export async function GET(
  _: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id: chatId } = await params;

  const streamContext = getStreamContext();

  if (!streamContext) {
    return new Response(null, { status: 204 });
  }

  if (!chatId) {
    return new Response(null, { status: 204 });
  }

  const recentStreamId = await getLatestStreamId(chatId);

  if (!recentStreamId) {
    return new Response(null, { status: 204 });
  }

  const emptyDataStream = createUIMessageStream({
    execute: () => {},
  });

  const stream = await streamContext.resumableStream(recentStreamId, () =>
    emptyDataStream.pipeThrough(new JsonToSseTransformStream()),
  );

  if (!stream) {
    return new Response(null, { status: 204 });
  }

  return new Response(stream, { status: 200 });
}
