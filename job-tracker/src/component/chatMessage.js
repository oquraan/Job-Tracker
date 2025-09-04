export default function ChatMessage({ role, content }) {
  // check if the msg is from the user or not
  const isUser = role === "user";

  return (
    <div className={`message-row ${isUser ? "user" : "bot"}`}>
      <div className={`message ${isUser ? "user" : "bot"}`}>
        {/* <span> {isUser ? "You " : "Ai "}</span> */}

        {content}
      </div>
    </div>
  );
}
