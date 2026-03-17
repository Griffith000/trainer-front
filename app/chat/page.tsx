import { redirect } from "next/navigation";

import { createSession, getSessions } from "@/app/chat/actions";

export default async function ChatPage() {
  const sessions = await getSessions();

  if (sessions.length > 0) {
    redirect(`/chat/${sessions[0].id}`);
  }

  const newSession = await createSession();
  if (!newSession) redirect("/login");

  redirect(`/chat/${newSession.id}`);
}
