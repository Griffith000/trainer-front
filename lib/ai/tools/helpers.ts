import { cookies } from "next/headers";

export async function getAuthHeaders() {
  const cookieStore = await cookies();
  return {
    cookie: cookieStore.toString(),
    csrfToken: cookieStore.get("csrftoken")?.value ?? "",
  };
}
