import React from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneLight } from "react-syntax-highlighter/dist/cjs/styles/prism";
import { ClipboardIcon } from "@phosphor-icons/react/dist/csr/Clipboard";
import copyTextToClipboard from "@/lib/copyToClipboard";
import { toast } from "react-toastify";

interface HighlightComponentProps {
  code: string;
  language: string;
}

export default function HighlightComponent(props: HighlightComponentProps) {
  const handleCopy = () => {
    copyTextToClipboard(
      props.code,
      (err) => {
        toast.error("Fehler beim Kopieren!");
        console.error(err);
      },
      () => {
        toast.success("In Zwischenablage kopiert!");
      },
    );
  };

  return (
    <div style={{ position: "relative" }}>
      <button
        onClick={handleCopy}
        style={{
          position: "absolute",
          top: "5px",
          right: "5px",
          zIndex: 10,
          background: "rgba(255, 255, 255, 0.8)",
          border: "1px solid #ddd",
          borderRadius: "4px",
          padding: "2px 5px",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: "4px",
          fontSize: "0.7rem",
        }}
        title="Kopieren"
      >
        <ClipboardIcon size={14} />
        Kopieren
      </button>
      <SyntaxHighlighter
        language={props.language}
        style={oneLight}
        showLineNumbers={true}
        wrapLongLines={true}
        customStyle={{
          height: "400px",
          margin: 0,
          fontSize: "0.8rem",
          borderRadius: "4px",
        }}
      >
        {props.code}
      </SyntaxHighlighter>
    </div>
  );
}
