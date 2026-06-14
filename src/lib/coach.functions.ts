import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const Input = z.object({
  messages: z.array(z.object({ role: z.enum(["user", "assistant", "system"]), content: z.string() })),
  profile: z
    .object({
      name: z.string().nullable().optional(),
      goal: z.string().nullable().optional(),
      diet: z.string().nullable().optional(),
      experience: z.string().nullable().optional(),
    })
    .optional(),
});

export const askCoach = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => Input.parse(d))
  .handler(async ({ data }) => {
    const key = process.env.LOVABLE_API_KEY;
    if (!key) throw new Error("Missing LOVABLE_API_KEY");

    const system = `You are ATHLYT, a world-class AI fitness and nutrition coach. You are warm, direct, motivating — like a calm elite trainer.
Rules:
- Keep responses short (2-5 sentences) unless asked for detail.
- Use markdown lightly (bold for key numbers).
- Personalize using the user's profile when relevant.
- For workouts, suggest concrete sets x reps.
- For nutrition, give concrete kcal/protein numbers.
- Never recommend unsafe practices.
User profile: ${JSON.stringify(data.profile ?? {})}.`;

    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [{ role: "system", content: system }, ...data.messages],
      }),
    });

    if (res.status === 429) return { text: "I'm getting a lot of requests right now — try again in a moment.", error: "rate_limit" };
    if (res.status === 402) return { text: "AI credits are exhausted. Please add credits to keep coaching.", error: "no_credits" };
    if (!res.ok) return { text: "Coach is offline for a second. Try again.", error: "unknown" };

    const json = (await res.json()) as { choices?: { message?: { content?: string } }[] };
    return { text: json.choices?.[0]?.message?.content ?? "…", error: null as string | null };
  });
