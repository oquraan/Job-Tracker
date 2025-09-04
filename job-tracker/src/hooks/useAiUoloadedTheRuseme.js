import { useState } from "react";
import { chat } from "../Ai/Ai";
import axios from "axios";

export default function useChat() {
  const [messages, setmessages] = useState([
    {
      role: "system",
      content: `You are a helpful assistant. 
- Improve grammar.
- Highlight strong and weak points.
- Suggest essential keywords to add for my resume that are in high demand in the job market, such as: Problem-Solving, Communication, Teamwork, Leadership, Time Management, Adaptability, Critical Thinking, Project Management, Creativity, Analytical Skills, Collaboration, Innovation, Agile, SQL, C#, ASP.NET, React, JavaScript, Cloud Computing, and Data Analysis.`,
    },
  ]);

  async function sendMessage(text) {
    const newMessages = [...messages, { role: "user", content: text }];

    setmessages(newMessages);

    try {
      // const reply = await chat(newMessages);
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
