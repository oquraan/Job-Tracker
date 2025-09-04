import { jsPDF } from "jspdf";
import { Sparkles } from "lucide-react";
import mammoth from "mammoth";
import { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";
import useChat from "../hooks/useAiUoloadedTheRuseme";
import MarkdownRenderer from "./MarkdownRenderer";
import "./ResumeHeIper.css";
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

export default function ResumeHelper({ setTextContents, setIsUploadCV }) {
  const { messages, sendMessage } = useChat();

  const [file, setFile] = useState(null);
  const [fileType, setFileType] = useState("");
  const [textContent, setTextContent] = useState("");
  const [textAfterUpdateContent, setTextAfterUpdateContent] = useState("");
  const [isUplodedFile, setIsUplodedFile] = useState(false);
  const [isAskedAi, setIsAskedAi] = useState(false);
  const [numPages, setNumPages] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isChangeUplodedFile, setIsChangeUplodedFile] = useState(false);

  async function handleSend() {
    setIsLoading(true);
    setIsChangeUplodedFile(true);

    if (!textContent.trim()) return;
    console.log(textContent);
    await sendMessage(textContent);
    // setInput("");
    setIsAskedAi(true);
    setIsLoading(false);
  }

  function handleClick() {
    const text = messages
      .filter((msg) => msg.role === "assistant")
      .map((a) => a.content);
    console.log(text);
    if (!text) {
      alert("No assistant messages to export!");
      return;
    }
    const doc = new jsPDF();
    const pageWidth = 180; // عرض النص
    const lineHeight = 10; // ارتفاع السطر
    let y = 10; // البداية من أعلى الصفحة

    text.forEach((msg, index) => {
      const lines = doc.splitTextToSize(
        `Section ${index + 1}:\n${msg}`,
        pageWidth
      );

      lines.forEach((line) => {
        if (y > 280) {
          // نهاية الصفحة تقريباً
          doc.addPage(); // إضافة صفحة جديدة
          y = 10; // إعادة ضبط البداية
        }
        doc.text(line, 10, y);
        y += lineHeight;
      });

      y += lineHeight; // مسافة بين الأقسام
    });

    doc.save("resume.pdf");
  }
  const handleExportPDF = () => {
    // const text = [...messages]
    //   .reverse()
    //   .filter((msg) => msg.role === "assistant")
    //   .map((a) => a.content);
    // if (!text.length) return alert("No assistant messages to export!");
    // const doc = new jsPDF();
    // let y = 10;
    // const lineHeight = 10;
    // const pageWidth = 180;

    // text.forEach((msg, idx) => {

    //   const lines = doc.splitTextToSize(
    //     `Section ${idx + 1}:\n${msg}`,
    //     pageWidth
    //   );
    //   lines.forEach((line) => {
    //     if (y > 280) {
    //       doc.addPage();
    //       y = 10;
    //     }
    //     doc.text(line, 10, y);
    //     y += lineHeight;
    //   });
    //   y += lineHeight;
    // });
    // doc.save("resume.pdf");

    const text = [...messages]
      .reverse()
      .filter((msg) => msg.role === "assistant")[0]?.content;

    if (!text) return alert("No assistant messages to export!");

    const doc = new jsPDF();
    let y = 10;
    const lineHeight = 10;
    const pageWidth = 180;

    const lines = doc.splitTextToSize(text, pageWidth);
    lines.forEach((line) => {
      if (y > 280) {
        doc.addPage();
        y = 10;
      }
      doc.text(line, 10, y);
      y += lineHeight;
    });

    doc.save("resume.pdf");
  };

  const assistantMessages = messages.filter((msg) => msg.role === "assistant");

  const handleFileChange = async (e) => {
    const uploadedFile = e.target.files[0];
    if (!uploadedFile) return;

    setFile(uploadedFile);
    console.log(uploadedFile);
    // setTextContents( await uploadedFile.text());
    setFileType(uploadedFile.type);

    // TXT
    if (uploadedFile.type === "text/plain") {
      const text = await uploadedFile.text();
      // setTextContents(text);

      setTextContent(text);
      alert(text);
      console.log(text);
      setTextContents(text);
    }
    // DOCX
    else if (
      uploadedFile.type ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      const arrayBuffer = await uploadedFile.arrayBuffer();
      const result = await mammoth.extractRawText({ arrayBuffer });
      setTextContent(result.value);

      setTextContents(result.value);
    }
    // PDF
    else if (uploadedFile.type === "application/pdf") {
      const arrayBuffer = await uploadedFile.arrayBuffer();
      const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
      setNumPages(pdf.numPages);
      let text = "";
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        const strings = content.items.map((item) => item.str);
        text += strings.join(" ") + "\n";
      }
      setTextContent(text);
      setTextContents(text);

      setIsUplodedFile(true);
      setIsChangeUplodedFile(false);
      setIsUploadCV(true);
    }
  };

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };
  return (
    <div className="resume-helper-container">
      {/* Header */}
      <div className="header">
        <div className="header-title">
          <Sparkles className="icon" />
          <h1>Resume Helper</h1>
        </div>
      </div>

      {/* File Upload */}
      <div className="card upload-card">
        <label className="upload-btn">
          Upload Resume
          <input
            type="file"
            accept=".pdf,.txt,.docx"
            className="hidden"
            onChange={handleFileChange}
          />
        </label>

        <div className="file-preview">
          {!file && <p>No file uploaded yet.</p>}
          {file && <pre className="file-text">{textContent}</pre>}
        </div>
        {file && fileType === "application/pdf" && numPages && (
          <Document file={file} onLoadSuccess={onDocumentLoadSuccess}>
            {Array.from({ length: numPages }, (_, idx) => (
              <Page key={idx} pageNumber={idx + 1} className="pdf-page" />
            ))}
          </Document>
        )}
      </div>

      {/* Actions */}
      <div className="card actions-card">
        {isUplodedFile && (
          <label className="resume-label">
            Ask AI to evaluate my resume, improve grammar, highlight strengths &
            weaknesses, and suggest keywords.
            <button
              className="primary-btn"
              onClick={handleSend}
              disabled={isLoading || isChangeUplodedFile}
            >
              {isLoading
                ? "Loading..."
                : isChangeUplodedFile
                ? "Change the resume to evaluate"
                : "Resume AI Review"}
            </button>
            {isAskedAi && assistantMessages.length > 0 && (
              <button className="primary-btn" onClick={handleExportPDF}>
                Export AI Feedback as PDF
              </button>
            )}
          </label>
        )}
      </div>

      {/* AI Messages */}
      {assistantMessages.length > 0 && (
        <div className="card results-card">
          <div className="card-header">
            <Sparkles className="icon" />
            <span>AI Analysis Results</span>
          </div>
          <div className="card-content space-y-4">
            {[...assistantMessages].reverse().map((msg, idx) => (
              <div
                key={idx}
                className="result-item bg-gray-50 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                {msg.content
                  .split("\n")
                  .filter(Boolean)
                  .map((line, i) => (
                    <div key={i} className="mb-2 last:mb-0">
                      <MarkdownRenderer content={line} />
                    </div>
                  ))}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
