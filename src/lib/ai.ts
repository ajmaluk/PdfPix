"use client";

export async function callNvidiaAI(
  prompt: string,
  systemPrompt?: string,
  model?: string
): Promise<string> {
  const apiKey = process.env.NEXT_PUBLIC_NVIDIA_API_KEY || "";
  if (!apiKey) {
    throw new Error("NVIDIA API key not configured. Please add NEXT_PUBLIC_NVIDIA_API_KEY to your .env.local file.");
  }

  const res = await fetch(
    "https://integrate.api.nvidia.com/v1/chat/completions",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: model || "mistralai/mistral-large-3-675b-instruct-2512",
        messages: [
          ...(systemPrompt
            ? [{ role: "system" as const, content: systemPrompt }]
            : []),
          { role: "user", content: prompt },
        ],
        max_tokens: 4096,
        temperature: 0.15,
        top_p: 1.0,
      }),
    }
  );

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`NVIDIA API error (${res.status}): ${err}`);
  }

  const data = await res.json();
  return data.choices?.[0]?.message?.content || "";
}

export async function callNvidiaAIWithImage(
  prompt: string,
  imageBase64: string,
  systemPrompt?: string,
  model?: string
): Promise<string> {
  const apiKey = process.env.NEXT_PUBLIC_NVIDIA_API_KEY || "";
  if (!apiKey) {
    throw new Error("NVIDIA API key not configured.");
  }

  const res = await fetch(
    "https://integrate.api.nvidia.com/v1/chat/completions",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: model || "mistralai/mistral-large-3-675b-instruct-2512",
        messages: [
          ...(systemPrompt
            ? [{ role: "system" as const, content: systemPrompt }]
            : []),
          {
            role: "user",
            content: `<img src="data:image/png;base64,${imageBase64}" />\n${prompt}`,
          },
        ],
        max_tokens: 4096,
        temperature: 0.15,
        top_p: 1.0,
      }),
    }
  );

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`NVIDIA API error (${res.status}): ${err}`);
  }

  const data = await res.json();
  return data.choices?.[0]?.message?.content || "";
}
