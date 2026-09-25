"use client";

import BasicsEditor from "./BasicsEditor";
import SectionEditor from "./SectionEditor";

export default function ResumeEditor() {
  return (
    <div>
      <BasicsEditor />
      <div className="mt-6">
        <SectionEditor />
      </div>
    </div>
  );
}
