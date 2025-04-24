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
  console.log("File contents:", fileContents);

  const model = genAI.getGenerativeModel(
    { model: "gemini-2.0-flash-001" },
    {
      generationConfig: {
        temperature: 0,
        topP: 0.9,
        responseMimeType: "application/json",
      },
    }
  );

  const studyPlanPrompt = `
You are a study material processor and content analyzer.
Your task is to read the provided plain text content and convert it into a fully structured and comprehensive study material in strict JSON format.

Instructions:
Analyze the text content provided in the variable "${fileContents}" and generate a complete and structured JSON object representing the study material. The output must follow the format below and include all relevant information found in the text.

Output Format:
Return only the following JSON structure. Do not include any extra explanation, markdown, or commentary — only the final valid JSON object.

{
  "title": string, // The main title of the study material or subject
  "chapters": [
    {
      "title": string, // Chapter title
      "summary": string, // A short summary of the chapter
      "concepts": [
        {
          "term": string,
          "definition": string,
          "example": string
        }
      ],
      "important_points": string[], // 3 to 5 major highlights or takeaways
      "questions": [
        {
          "question": string,
          "answer": string // Can be short answer, interview-style, or long form
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

Guidelines:
- Carefully read and interpret the text content.
- Organize the information by chapters if present, or break the content into logical chapter-like sections.
- Extract and create clearly defined concepts, important points, and questions per section. Each question's answer must be between 50 and 200 characters, no more, no less.
- Include a glossary of terms with simple easy definitions.
- Provide a list of recommended readings with titles and URLs (at least 2 articles).
- Language must be clear, instructional, and suitable for learners at high school or early college level.
- Output must be valid JSON — directly usable by parsers without modification.
- Do not wrap anything in Markdown or code formatting.
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
