import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get("file");

  if (!file || typeof file === "string") {
    return NextResponse.json({ error: "Resume file is required." }, { status: 400 });
  }

  return NextResponse.json({
    ok: true,
    message: "Resume parsing is scaffolded and ready to connect to the parser layer.",
    fileName: file.name,
  });
}
