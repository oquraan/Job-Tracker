import { FileText, Loader2, Send, Sparkles } from "lucide-react";
import { useState } from "react";
import "./JobAnalyzer.css";
import MarkdownRenderer from "./MarkdownRenderer";
import useFedbackAboutResumeAndApplication from "../hooks/useAiSendTheApplicaiton";

export default function JobAnalyzer({ textContent }) {
  const [text, setText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { messages, sendMessage } = useFedbackAboutResumeAndApplication();

  const handleSend = async () => {
    if (!text.trim()) return;

    setIsLoading(true);
    try {
      await sendMessage({ textResume: textContent, textApplicationJop: text });
      setText("");
    } catch (error) {
      console.error("Error sending text:", error);
    } finally {
      setIsLoading(false);
    }
  };

  function handleKeyDown(e) {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handleSend();
    }
  }

  const assistantMessages = messages.filter((msg) => msg.role === "assistant");

  return (
    <div className="job-analyzer-container">
      {/* Header */}
      <div className="header">
        <div className="header-title">
          <Sparkles className="icon" />
          <h1>Job Application Analyzer</h1>
        </div>
        <p className="subtext">
          Get AI-powered feedback on your resume and job application
        </p>
      </div>

      {/* Input Section */}
      <div className="card">
        <div className="card-header">
          <FileText className="icon" />
          <span>Job Description</span>
        </div>
        <div className="card-content">
          <label htmlFor="message">
            Paste the job description or requirements here
          </label>
          <textarea
            id="message"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Paste the job description, requirements, or any specific questions about your application..."
            disabled={isLoading}
          />

          <div className="footer">
            <span className="char-count">{text.length} characters</span>
            <div className="send-section">
              <span className="tip">Press Ctrl+Enter to send</span>
              <button onClick={handleSend} disabled={!text.trim() || isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="loader" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Send className="icon-small" />
                    Analyze
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Results Section */}
      {assistantMessages.length > 0 ? (
        <div className="card results-card">
          <div className="card-header">
            <Sparkles className="icon" />
            <span>AI Analysis Results</span>
          </div>
          <div className="card-content">
            {assistantMessages.map((msg, i) => {
              const lines = msg.content
                .split("\n")
                .filter((line) => line.trim());
              return (
                <div key={i} className="result-item">
                  {lines.map((line, index) => (
                    // <p key={index}>{line}</p>
                    <MarkdownRenderer content={line}></MarkdownRenderer>
                  ))}
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        !isLoading && (
          <div className="card empty-card">
            <div className="card-content empty-content">
              <FileText className="icon-large" />
              <h3>Ready to Analyze</h3>
              <p>
                Paste a job description above and get personalized feedback on
                how well your resume matches the requirements.
              </p>
            </div>
          </div>
        )
      )}
    </div>
  );
}
