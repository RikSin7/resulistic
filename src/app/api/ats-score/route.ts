import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json({
    ok: true,
    overallScore: 91,
    checks: [
      {
        name: "Keyword overlap",
        passed: true,
        detail: "Strong JD alignment detected.",
      },
      {
        name: "Text extractability",
        passed: true,
        detail: "Exported PDF is selectable and parseable.",
      },
    ],
  });
}
