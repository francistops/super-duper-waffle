const BASE_URL = "https://api.ft.ca/";

export async function getTasks() {
  let result = false;
  try {
    const response = await fetch(`${BASE_URL}task`, {});
    if (!response.ok || response.status >= 500) throw new Error("Server error");
    else if (!response.ok || response.status >= 400)
      throw new Error("Client error");
    else if (!response.ok) throw new Error("Arcane error");
    result = await response.json();
    return result;
  } catch (error) {
    return { status: "offline", error };
  }
}
