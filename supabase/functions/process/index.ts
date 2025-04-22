import { createClient } from "jsr:@supabase/supabase-js@2";
import { GoogleGenerativeAI } from "npm:@google/generative-ai";

console.log("Starting process function...");
const genAI = new GoogleGenerativeAI(Deno.env.get("GEMINI_API_KEY"));

Deno.serve(async (req) => {
  const { document_id } = await req.json();

  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_ANON_KEY") ?? ""
  );

  const authHeader = req.headers.get("Authorization");

  if (!authHeader) {
    return new Response(
      JSON.stringify({ error: `No authorization header passed` }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
  const token = authHeader.replace("Bearer ", "");
  const { data } = await supabaseClient.auth.getUser(token);
  const user = data.user;

  if (!user) {
    return new Response(JSON.stringify({ error: "User not found" }), {
      headers: { "Content-Type": "application/json" },
      status: 400,
    });
  }

  const { data: document, error: docError } = await supabaseClient
    .from("documents_with_storage_path")
    .select()
    .eq("id", document_id)
    .maybeSingle();

  if (!document?.storage_object_path || docError || !document) {
    console.log(
      "Error fetching document:",
      docError?.message || "No document found"
    );

    return new Response(JSON.stringify({ error: "Document not found" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }

  const { data: file, error: fileError } = await supabaseClient.storage
    .from("files")
    .download(document.storage_object_path);

  if (fileError || !file) {
    console.log(
      "Error downloading file:",
      fileError?.message || "No file found"
    );
    return new Response(JSON.stringify({ error: "Failed to download file" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  const fileContents = await file.text();

  const model = genAI.getGenerativeModel(
    { model: "gemini-2.0-flash-001" },
    {
      generationConfig: {
        temperature: 0.4,
        topP: 0.9,
        responseMimeType: "application/json",
      },
    }
  );

  const studyPlanPrompt = `
You are a study material analyzer. Read the provided content and generate a structured JSON output for a single chapter with the following format.

Strictly ensure the JSON is valid and complete. Do NOT include any Markdown or extra commentary. Return only the JSON object.

Input content: "${fileContents}"

Then, create a detailed, structured JSON object that breaks the content down chapter by chapter. For each chapter, include:

1. A clear title and summary.
2. Key concepts, each with a term, definition, and example.
3. A list of 3 to 5 important points.
4. At least 3 to 5 review questions (can be short answer, interview answer, long answer).

Also include:
- A glossary at the end of the full document with all key terms and their definitions.
- A list of at least 2 recommended readings (articles) with links if possible.

### JSON Output Format:
Only return the JSON object. Do not wrap in Markdown or add explanation.

{
  "title": string,
  "chapters": [
    {
      "title": string,
      "summary": string,
      "concepts": [
        {
          "term": string,
          "definition": string,
          "example": string
        }
      ],
      "important_points": string[],
      "questions": [
        {
          "question": string,
          "answer": string
        }
      ]
    }
  ],
  "glossary": [
    {
      "term": string,
      "definition": string
    }
  ],
  "recommended_reading": [
    {
      "title": string,
      "type": "article",
      "url": string
    }
  ]
}

### Rules:
- Use clear language suitable for learners.
- Do not wrap output in backticks or Markdown formatting.
- Ensure the result is valid JSON, directly parsable.
  `;

  const result = await model.generateContent(studyPlanPrompt);
  const content = result.response.text();
  
  let studyGuide;
  let cleaned = content.trim();

  // Strip Markdown-style code block if present
  if (cleaned.startsWith("```json") || cleaned.startsWith("```")) {
    cleaned = cleaned
      .replace(/^```json\n?/, "")
      .replace(/```$/, "")
      .trim();
  }

  try {
    studyGuide = JSON.parse(cleaned);
    if (Array.isArray(studyGuide)) studyGuide = studyGuide[0];
  } catch (e) {
    console.error("Failed to parse Gemini output:", cleaned);
    return new Response(
      JSON.stringify({ error: "Failed to parse study guide" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  // Store the generated content
  const { error: insertError } = await supabaseClient
    .from("generated_content")
    .insert({
      document_id: document_id,
      content: studyGuide,
      user_id: user.id,
    });

  if (insertError) {
    console.error("Error inserting generated content:", insertError.message);
  }

  console.log("Content generated successfully");

  return new Response("Content generated", { status: 200 });
});
