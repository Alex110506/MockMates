import "highlight.js/styles/monokai-sublime.css";
import { useCallback, useEffect, useState, useRef } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import { io } from "socket.io-client";
import { useParams } from "react-router-dom";
import Editor from "@monaco-editor/react";

// Toolbar just for Quill
const TOOLBAR_OPTIONS = [
  [{ header: 1 }, { header: 2 }],
  [{ list: "ordered" }, { list: "bullet" }],
  ["clean"],
];

const SAVE_INTERVAL_MS = 5000;

export default function TextEditor() {
  const [socket, setSocket] = useState();
  const [quill, setQuill] = useState();
  const [editorType, setEditorType] = useState("quill"); // quill | monaco
  const [monacoCode, setMonacoCode] = useState("// Start typing...");
  const [language, setLanguage] = useState("javascript");
  const { id: documentId } = useParams();
  const monacoRef = useRef(null);

  // Set up socket
  useEffect(() => {
    const s = io("http://localhost:5001");
    setSocket(s);
    return () => s.disconnect();
  }, []);

  // Load document
  useEffect(() => {
    if (!socket || !quill) return;

    socket.once("load-document", (document) => {
      quill.setContents(document);
      quill.enable();
    });

    socket.emit("get-document", documentId);
  }, [socket, quill, documentId]);

  // Save periodically
  useEffect(() => {
    if (!socket || !quill) return;

    const interval = setInterval(() => {
      socket.emit("save-document", quill.getContents());
    }, SAVE_INTERVAL_MS);

    return () => clearInterval(interval);
  }, [socket, quill]);

  // Send deltas
  useEffect(() => {
    if (!socket || !quill) return;

    const handler = (delta, oldDelta, source) => {
      if (source !== "user") return;
      socket.emit("send-changes", delta);
    };

    quill.on("text-change", handler);
    return () => quill.off("text-change", handler);
  }, [socket, quill]);

  // Receive deltas
  useEffect(() => {
    if (!socket || !quill) return;

    const handler = (delta) => quill.updateContents(delta);
    socket.on("recive-changes", handler);
    return () => socket.off("recive-changes", handler);
  }, [socket, quill]);

  // Set up Quill editor
  const wrapperRef = useCallback((wrapper) => {
    if (!wrapper) return;

    wrapper.innerHTML = "";
    const editor = document.createElement("div");
    wrapper.append(editor);

    const q = new Quill(editor, {
      theme: "snow",
      modules: { toolbar: TOOLBAR_OPTIONS },
    });

    q.root.style.fontFamily = `"Fira Code", monospace`;
    q.root.style.fontSize = "14px";
    q.root.style.backgroundColor = "#1e1e1e";
    q.root.style.color = "#dcdcdc";

    q.enable(false);
    q.setText("Loading...");
    setQuill(q);
  }, []);

  return (
    <div className="flex flex-col h-screen">
      {/* Header with switch button */}
      <div className="flex items-center bg-gray-800 text-white p-2 gap-2">
        <button
          className="bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded"
          onClick={() => setEditorType("quill")}
        >
          Quill Editor
        </button>
        <button
          className="bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded"
          onClick={() => setEditorType("monaco")}
        >
          Monaco Editor
        </button>
      </div>

      {/* Editors */}
      <div className="flex-1 relative">
        {/* Quill */}
        <div
          className={editorType === "quill" ? "h-full" : "hidden"}
          ref={wrapperRef}
        ></div>

        {/* Monaco */}
        <div className={editorType === "monaco" ? "h-full flex flex-col" : "hidden"}>
          {/* Language selector */}
          <div className="p-2 bg-gray-700 text-white flex items-center gap-2">
            <label htmlFor="language" className="text-sm">
              Language:
            </label>
            <select
              id="language"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="bg-gray-800 text-white px-2 py-1 rounded border border-gray-600"
            >
              <option value="cpp">C++</option>
              <option value="java">Java</option>
              <option value="python">Python</option>
              <option value="javascript">JavaScript</option>
              <option value="c">C</option>
              <option value="csharp">C#</option>
              <option value="go">Go</option>
              <option value="rust">Rust</option>
            </select>
          </div>

          <div style={{ minWidth: "40vw", maxWidth: "50vw", height: "100%" }}>
            <Editor
              height="100%"
              width="100%"   // fill the wrapper
              language={language}
              theme="vs-dark"
              value={monacoCode}
              onChange={(val) => setMonacoCode(val)}
              onMount={(editor) => (monacoRef.current = editor)}
              options={{
                fontFamily: "Fira Code, monospace",
                fontSize: 14,
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                automaticLayout: true,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
