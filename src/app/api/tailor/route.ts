import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();

  return NextResponse.json({
    ok: true,
    suggestions: [{
      id: "suggestion-1",
      target: "experience",
      currentText: "Improved conversion rates through UX changes.",
      suggestedText: "Improved conversion rates by 18% through data-informed UX changes.",
      reason: "Adds measurable impact to align with the JD.",
      ...body,
    }],
  });
}
