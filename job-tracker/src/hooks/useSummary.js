import axios from "axios";
import { useState } from "react";

export default function useSummary() {
  const [messages, setmessages] = useState([
    {
      role: "system",
      content: `
You are a helpful assistant.
Your task:
- Count how many applications fall under each status (Applied, Interview, Rejected, Hired).
- Provide the results in a clear summary (example: Applied: 7, Interview: 3, Rejected: 2, Hired: 1).
- If a status does not exist, return 0.
- Add a motivational summary at the end based on the counts (example: "You applied to 7 jobs this month and got 3 interviews! Keep pushing forward — you're making progress.").
- Always start the message with: "Analysis using AI:".
- Keep the output concise and encouraging.
`,
    },
  ]);

  async function sendMessage(text) {
    const status = text.map((st, index) => ({
      status: st.status,
      createdTime: st.createdTime,
    }));
    const userMessage = JSON.stringify(status, null, 2);

    // alert(status);

    const newMessages = [...messages, { role: "user", content: userMessage }];

    setmessages(newMessages);
    console.log("llllllllllllllllll");

    console.log(messages);
    console.log("llllllllllllllllll");

    try {
      // const reply = await chat(newMessages);
      const reply = await axios.post("http://localhost:3001/ai", newMessages);

      const replyText =
        typeof reply.data === "string"
          ? reply.data
          : JSON.stringify(reply.data, null, 2);

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
