export async function parseUploadedFile(file: File) {
  return {
    ok: true,
    fileName: file.name,
    rawText: "Parsed resume text placeholder.",
  };
}
