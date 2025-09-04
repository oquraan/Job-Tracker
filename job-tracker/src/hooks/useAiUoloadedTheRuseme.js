import axios from "axios";
import { useState } from "react";

export default function useChat() {
  //   const [messages, setmessages] = useState([
  //     {
  //       role: "system",
  //       content: `display suggestions as the following:
  // - Grammar improvements
  // - Strong/weak points
  // ° Keywords to add`,
  //     },
  //   ]);
  const [messages, setmessages] = useState([
    {
      role: "system",
      content: `You are a professional CV assistant. 
Your task: 
- Correct grammar mistakes
- Identify strong and weak points
- Suggest keywords to add`,
    },
  ]);

  async function sendMessage(text) {
    console.log(text);
    const newMessages = [...messages, { role: "user", content: text }];

    setmessages(newMessages);

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
