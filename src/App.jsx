import { useState } from "react";
import { open } from "@tauri-apps/plugin-dialog";
import { invoke } from "@tauri-apps/api/core";
import { RUST_COMMANDS } from "./constant";

export default function DuplicateScanner() {
  const [folder, setFolder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const selectFolder = async () => {
    try {
      setError(null);

      const selected = await open({
        directory: true,
        multiple: false,
        title: "Select folder to scan for duplicates",
      });

      if (!selected) return;

      setFolder(selected);
      setLoading(true);
      setResult(null);

      const res = await invoke(RUST_COMMANDS.SCAN_DUPLICATES, {
        path: selected,
      });
      console.log('kkks')

      setResult(res);
    } catch (err) {
      console.log(err)
      setError(err?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 20, fontFamily: "sans-serif" }}>
      <h1>Duplicate File Scanner</h1>

      <button onClick={selectFolder} style={{ padding: "10px 15px" }}>
        Select Folder
      </button>

      {folder && (
        <p>
          <b>Selected:</b> {folder}
        </p>
      )}

      {loading && <p>Scanning files... ⏳</p>}

      {error && <p style={{ color: "red" }}>{error}</p>}

      {result && (
        <div style={{ marginTop: 20 }}>
          <h3>Result</h3>
          <pre style={{ background: "#111", color: "#0f0", padding: 10 }}>
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}