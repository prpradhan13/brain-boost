import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";
import { GoogleGenerativeAI } from "npm:@google/generative-ai";

console.log("Function started");
const genAI = new GoogleGenerativeAI(Deno.env.get("GEMINI_API_KEY"));

Deno.serve(async (req) => {
  try {
    const { subjectName } = await req.json();

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );
    // Get the session or user object
    const authHeader = req.headers.get("Authorization")!;
    const token = authHeader.replace("Bearer ", "");
    const { data } = await supabaseClient.auth.getUser(token);
    const user = data.user;

    if (!user) {
      return new Response(JSON.stringify({ error: "User not found" }), {
        headers: { "Content-Type": "application/json" },
        status: 400,
      });
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash-001",
      generationConfig: {
        temperature: 0.4,
        topP: 0.9,
        responseMimeType: "application/json",
      },
    });

    const studyPlanPrompt = `
    You are an expert tutor and curriculum designer. 
    Your task is to generate a detailed, beginner-friendly **JSON-formatted study guide** for the subject: "${subjectName}".
    
    Output Format:
    Return only a single JSON object, following this exact structure (no array wrapping):
    
    {
      "title": string,
      "summary": string,
      "sections": [
        {
          "title": string,
          "summary": string,
          "key_points": string[],
          "quiz": [
            {
              "question": string,
              "options": string[],
              "answer": string
            }
          ]
        }
      ],
      "resources": [
        {
          "type": "video" | "article" | "book",
          "title": string,
          "url": string
        }
      ]
    }
    
    Guidelines:
    - The "summary" fields should explain the section or guide in simple, clear language.
    - Include **exactly 5 sections**. Each section should focus on a distinct concept related to the subject.
    - Include a total of **10 quiz questions**, spread across the 5 sections (2 questions per section).
    - Keep key points **practical, concise, and focused on real understanding**.
    - Use examples in summaries and quiz options where helpful.
    - Include **at least 1 video, 1 article, and 1 book** in the resources.
    
    Output Rules:
    - Return only a single JSON object (do NOT wrap in an array).
    - Do not include any explanation or introductory text — only the pure JSON.
    - The result must be valid JSON and directly parsable with JSON.parse().
    
    Target Audience:
    This guide is designed for beginners, such as high school or college students, or adult learners looking for a foundational understanding.
    
    Start by planning the 5 main sections and build your study guide accordingly.
    `;
    

    const guideResult = await model.generateContent(studyPlanPrompt);
    const studyGuideText = guideResult.response.text();

    let studyGuide = JSON.parse(studyGuideText);

    if (Array.isArray(studyGuide)) {
      studyGuide = studyGuide[0];
    }

    const { error: insertError } = await supabaseClient
    .from('ai_generated_guide')
    .insert({
      user_id: user.id,
      subject_name: subjectName,
      study_guide: studyGuide
    })

    if (insertError) {
      console.error("Error inserting into Supabase:", insertError);
      return new Response("Failed to save workout plan", { status: 500 });
    }

    return new Response(JSON.stringify(studyGuide), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Function error:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : String(error),
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
});
