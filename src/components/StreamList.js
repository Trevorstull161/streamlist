import React, { useEffect, useState } from "react";

import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import UndoIcon from "@mui/icons-material/Undo";
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";

const STORAGE_KEY = "streamlist_items";

export default function StreamList() {
  const [inputValue, setInputValue] = useState("");
  const [items, setItems] = useState([]);

  // Load from localStorage on first render
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return;

    try {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) {
        setItems(parsed);
      }
    } catch (err) {
      console.error("Failed to parse StreamList items from localStorage:", err);
    }
  }, []);

  // Save to localStorage whenever items change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const trimmed = inputValue.trim();
    if (!trimmed) return;

    const newItem = {
      id: crypto.randomUUID(),
      text: trimmed,
      isCompleted: false,
      isEditing: false,
      editText: trimmed,
    };

    setItems((prev) => [newItem, ...prev]);

    console.log("StreamList item added:", trimmed);

    setInputValue("");
  };

  const handleDelete = (id) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleToggleComplete = (id) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, isCompleted: !item.isCompleted } : item
      )
    );
  };

  const handleStartEdit = (id) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, isEditing: true, editText: item.text }
          : item
      )
    );
  };

  const handleCancelEdit = (id) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, isEditing: false, editText: item.text }
          : item
      )
    );
  };

  const handleEditChange = (id, value) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, editText: value } : item))
    );
  };

  const handleSaveEdit = (id) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;

        const trimmed = item.editText.trim();
        if (!trimmed) {
          return { ...item, isEditing: false, editText: item.text };
        }

        return {
          ...item,
          text: trimmed,
          editText: trimmed,
          isEditing: false,
        };
      })
    );
  };

  return (
    <div style={{ maxWidth: 850, margin: "0 auto", padding: 16 }}>
      <h2>StreamList</h2>
      <p>Add a movie or show, then mark it complete, edit it, or delete it.</p>

      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", gap: 12, marginBottom: 16 }}
      >
        <TextField
          label="Add to your StreamList"
          variant="outlined"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          fullWidth
        />
        <Button type="submit" variant="contained">
          Submit
        </Button>
      </form>

      {items.length === 0 ? (
        <p>No items yet. Add your first one above.</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0, display: "grid", gap: 10 }}>
          {items.map((item) => (
            <li
              key={item.id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: 12,
                border: "1px solid #ddd",
                borderRadius: 8,
              }}
            >
              <div style={{ flex: 1 }}>
                {item.isEditing ? (
                  <TextField
                    label="Edit item"
                    variant="outlined"
                    value={item.editText}
                    onChange={(e) => handleEditChange(item.id, e.target.value)}
                    fullWidth
                  />
                ) : (
                  <span
                    style={{
                      fontSize: 16,
                      textDecoration: item.isCompleted ? "line-through" : "none",
                      opacity: item.isCompleted ? 0.6 : 1,
                    }}
                  >
                    {item.text}
                  </span>
                )}
              </div>

              {item.isEditing ? (
                <>
                  <IconButton
                    aria-label="save"
                    onClick={() => handleSaveEdit(item.id)}
                  >
                    <SaveIcon />
                  </IconButton>
                  <IconButton
                    aria-label="cancel"
                    onClick={() => handleCancelEdit(item.id)}
                  >
                    <CloseIcon />
                  </IconButton>
                </>
              ) : (
                <>
                  <IconButton
                    aria-label="complete"
                    onClick={() => handleToggleComplete(item.id)}
                  >
                    {item.isCompleted ? <UndoIcon /> : <CheckCircleIcon />}
                  </IconButton>
                  <IconButton
                    aria-label="edit"
                    onClick={() => handleStartEdit(item.id)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    aria-label="delete"
                    onClick={() => handleDelete(item.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

