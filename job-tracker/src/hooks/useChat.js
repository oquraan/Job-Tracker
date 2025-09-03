import axios from "axios";
import { useState } from "react";

export default function useChat() {
  const [messages, setmessages] = useState([
    {
      role: "system",
      content: `
You are a highly experienced Human Resources expert in Jordan.  
Your expertise includes:
- Recruitment and selection practices in Jordan.
- Jordanian labor law and employee rights.
- Salary ranges and compensation practices in Jordan.
- Performance evaluation, training, and employee development.
- Best HR strategies and workplace culture in Jordan.

When answering, always provide practical advice, clear explanations, and examples that fit the Jordanian market and context.
   
Rules:
1. Only answer questions related to Human Resources in Jordan.
2. If the user asks about something outside HR in Jordan, politely respond: 
   "I am specialized only in Human Resources in Jordan and cannot answer questions outside this field."
3. Always provide clear, practical advice and examples that fit the Jordanian market and context.
    `
    }
  ]);

  async function sendMessage(text) {
    const newMessages = [...messages, { role: "user", content: text }];

    setmessages(newMessages);

    try {
      // const reply = await chat(newMessages);
      const reply = await axios.post("http://localhost:3001/ai", newMessages);
      console.log(reply);
      setmessages((currentMessages) => [
        ...currentMessages,
        { role: "assistant", content: reply.data },
      ]);
    } catch (error) {
      console.log(error + " oooooooooooooooooo ");
    }
  }

  return { messages, sendMessage };
}
