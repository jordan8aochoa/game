import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { type, context } = body;

    if (!type) {
      return NextResponse.json({ error: "type is required" }, { status: 400 });
    }

    // In production, use the Anthropic SDK:
    // import Anthropic from "@anthropic-ai/sdk";
    // const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    //
    // const prompts: Record<string, string> = {
    //   summarize: `Summarize this construction change order in professional language: ${JSON.stringify(context)}`,
    //   suggest_pricing: `Analyze this pricing and suggest appropriate markups: ${JSON.stringify(context)}`,
    //   generate_wording: `Generate professional contract language for: ${JSON.stringify(context)}`,
    //   detect_duplicate: `Check if this work appears to be duplicate: ${JSON.stringify(context)}`,
    //   predict_overrun: `Analyze budget risk for this project: ${JSON.stringify(context)}`,
    // };
    //
    // const message = await client.messages.create({
    //   model: "claude-opus-4-7",
    //   max_tokens: 1024,
    //   messages: [{ role: "user", content: prompts[type] ?? `Help with: ${JSON.stringify(context)}` }],
    // });
    //
    // const result = message.content[0].type === "text" ? message.content[0].text : "";
    // return NextResponse.json({ result });

    // Mock responses for demo
    const mockResults: Record<string, string> = {
      summarize: "This change order addresses unforeseen site conditions requiring additional scope. Total value of $50,715 includes labor, materials, and a 15% markup. Recommend immediate approval to avoid schedule impact.",
      suggest_pricing: "Based on current market rates, your labor cost appears 8% below market. Consider adjusting the electrician rate from $95/hr to $102/hr. Material markup is appropriate at current pricing.",
      generate_wording: "ADDITIONAL WORK AUTHORIZATION: Contractor shall perform the following additional scope of work not included in the original Contract Documents...",
      detect_duplicate: "No duplicate work detected across your active change orders. However, CO-2026-0044 and CO-2026-0042 both reference floor 12 concrete work — recommend verifying scope boundaries.",
      predict_overrun: "Based on current CO trajectory (+$187K in 3 months) and remaining project duration (14 months), projected total CO exposure is $880K against a 10% contingency of $875K. Risk: MEDIUM-HIGH.",
    };

    const result = mockResults[type] ?? "Analysis complete. Please review the results above.";
    return NextResponse.json({ result });
  } catch (err) {
    console.error("POST /api/ai error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
