import React from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneLight } from "react-syntax-highlighter/dist/cjs/styles/prism";
import { ClipboardIcon } from "@phosphor-icons/react/dist/csr/Clipboard";
import { FloppyDiskIcon } from "@phosphor-icons/react/dist/csr/FloppyDisk";
import copyTextToClipboard from "@/lib/copyToClipboard";
import { toast } from "react-toastify";
import { Button } from "react-bootstrap";

export type JsonString = string;

interface HighlightComponentProps {
  code: JsonString;
  language: string;
  filename?: string;
}

export function isValidJson(jsonString: string): boolean {
  if (typeof jsonString !== "string" || !jsonString.trim()) {
    return false;
  }
  try {
    JSON.parse(jsonString);
    return true;
  } catch {
    return false;
  }
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

  const handleSave = () => {
    if (!props.code || !isValidJson(props.code)) {
      toast.error("Der Code ist kein gültiges JSON!");
      return;
    }

    try {
      const rawFileName = props.filename || "code.json";
      const finalFileName = rawFileName.endsWith(".json")
        ? rawFileName
        : `${rawFileName}.json`;

      const blob = new Blob([props.code], {
        type: "application/json;charset=utf-8;",
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", finalFileName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      toast.success("JSON-Datei heruntergeladen!");
    } catch (err) {
      toast.error("Fehler beim Herunterladen der Datei!");
      console.error(err);
    }
  };

  return (
    <div style={{ position: "relative" }}>
      <div
        style={{
          position: "absolute",
          top: "5px",
          right: "5px",
          zIndex: 10,
          display: "flex",
          gap: "4px",
        }}
      >
        <Button
          variant="outline-secondary"
          size="sm"
          onClick={handleSave}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "4px",
            fontSize: "0.7rem",
            padding: "2px 5px",
          }}
          title="Speichern"
        >
          <FloppyDiskIcon size={14} />
          Speichern
        </Button>
        <Button
          variant="outline-secondary"
          size="sm"
          onClick={handleCopy}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "4px",
            fontSize: "0.7rem",
            padding: "2px 5px",
          }}
          title="Kopieren"
        >
          <ClipboardIcon size={14} />
          Kopieren
        </Button>
      </div>
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
