import { Send, X } from "lucide-react";
import { useState } from "react";
import useChat from "../hooks/useChat";
import ChatMessage from "./chatMessage";

export default function ChatBox({ isOpen, setIsOpen }) {
  const { messages, sendMessage } = useChat();
  const [input, setInput] = useState("");
  // const [isOpen, setIsOpen] = useState(false);

  async function handleSend() {
    if (!input.trim()) return;

    let inputM = input;
    setInput("");
    await sendMessage(inputM);
    setInput("");
  }

  return (
    <div className={`chat-window ${isOpen ? "open" : "closed"}`}>
      <div className="chat-card">
        <div className="chat-header">
          <h3 className="chat-title">HR&AI Chat</h3>
          <button className="chat-close" onClick={() => setIsOpen(false)}>
            <X size={16} />
          </button>
        </div>

        <div className="chat-messages">
          {messages
            .filter((msgArr) => msgArr.role !== "system")
            .map((msg, i) => (
              <ChatMessage key={i} role={msg.role} content={msg.content} />
            ))}
        </div>

        <div className="chat-input">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => (e.key === "Enter" ? handleSend() : null)}
            placeholder="Type your message..."
          />
          <button onClick={handleSend} className="send-button">
            <Send size={16} />
          </button>
        </div>
      </div>{" "}
    </div>
  );
}
