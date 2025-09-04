import axios from "axios";
import { useState } from "react";
import { chat } from "../Ai/Ai";

export default function useFedbackAboutResumeAndApplication() {
  const [messages, setmessages] = useState([
    //     {
    //       role: "system",
    //       content: `AI returns:
    // - Key required skills
    // - Recommended keywords
    // - Suitability rating (0—l00%)`,
    //     },

    // {
    //   role: "system",
    //   content:
    //     "You are an AI assistant specialized in analyzing job descriptions and candidate profiles. For each job description provided, return a structured analysis with the following sections:\n\nAI returns:\n1. Key Required Skills: A bullet-point list of the main skills explicitly or implicitly required by the job.\n2. Recommended Keywords: A list of keywords the candidate should include in their CV or application to match the job description better.\n3. Suitability Rating (0–100%): An approximate score that reflects how well the candidate's current skills and experience match the job requirements.\n4. Areas for Development: Identify specific skills, tools, or experiences that the candidate is missing or needs to strengthen in order to be a stronger match.\n\nSpecial Rule:\n- If the suitability rating is between 65% and 80%, generate an additional short professional email draft. In this email, the candidate acknowledges the missing skills but emphasizes their ability and motivation to quickly learn and adapt. The email must be polite, confident, and suitable to send to an HR or hiring manager.",
    // },
    {
      role: "system",
      content: `
You are an AI assistant specialized in analyzing job descriptions and candidate profiles.  
For each job description provided, return a structured analysis with the following sections:

AI returns:
## Key Required Skills
- A bullet-point list of the main skills explicitly or implicitly required by the job.

## Recommended Keywords
- A list of keywords the candidate should include in their CV or application to match the job description better.

## Suitability Rating (0–100%)
- An approximate score that reflects how well the candidate's current skills and experience match the job requirements.

## Areas for Development
- Identify specific skills, tools, or experiences that the candidate is missing or needs to strengthen in order to be a stronger match.

### Special Rule
- If the suitability rating is between 65% and 80%, generate an additional section:

## Professional Email Draft
Write a short professional email where the candidate acknowledges the missing skills but emphasizes their ability and motivation to quickly learn and adapt. The email must be polite, confident, and suitable to send to an HR or hiring manager.

Formatting Rules:
- Use Markdown-style headers (#, ##, ###) for section titles.
- Use * for bullet points.
- Use **bold** for highlighting important words.
- Use \`inline code\` formatting only if referring to technical skills/tools.
- Do not use raw HTML in your output; only Markdown formatting.

This formatting will later be converted into styled HTML using regex replacements.
  `,
    },
  ]);

  async function sendMessage(text) {
    // alert(text.textResume);
    const newMessages = [
      ...messages,
      { role: "user", content: text.textResume },
      { role: "user", content: text.textApplicationJop },
    ];

    setmessages(newMessages);

    try {
      // const reply = await chat(newMessages);
      // const reply = await axios.post("http://localhost:3001/ai", {messages: newMessages });
      const reply = await axios.post("http://localhost:3001/ai", newMessages);

      const replyText =
        typeof reply.data === "string" ? reply.data : JSON.stringify(reply.data, null, 2);

      setmessages((currentMessages) => [
        ...currentMessages,
        { role: "assistant", content: replyText },
      ]);
    } catch (error) {
      console.log(error + " oooooooooooooooooo ");
    }
  }

  return { messages, sendMessage };
}
