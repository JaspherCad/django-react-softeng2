import React, { useRef } from "react";

const DatabaseBackup = () => {
  const fileInputRef = useRef(null);

  const handleExport = async () => {
    const datetime = new Date()
      .toISOString()
      .replace(/[:T]/g, "-")
      .split(".")[0];
    const filename = `${datetime}_backup.sql`;

    try {
      const response = await fetch(
        "http://172.30.8.55/:8000/api/backup/export"
      );
      if (!response.ok) throw new Error("Failed to export database");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert(`Export failed: ${err.message}`);
    }
  };

  const handleImportClick = () => {
    fileInputRef.current.click();
  };

  const handleImportFile = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("sql_file", file); // ⬅ Changed key to match Django view

    try {
      const response = await fetch("/api/backup/import", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Import failed");

      alert("Import successful!");
    } catch (err) {
      alert(`Import failed: ${err.message}`);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Database Backup</h2>
      <div className="flex gap-4">
        <button
          onClick={handleExport}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Export DB
        </button>
        <button
          onClick={handleImportClick}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Import DB
        </button>
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: "none" }}
          accept=".sql"
          onChange={handleImportFile}
        />
      </div>
    </div>
  );
};

export default DatabaseBackup;
