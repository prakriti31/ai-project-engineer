import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8000";

export const analyzeDocument = async (file) => {
  const fd = new FormData();
  fd.append("file", file);
  const resp = await axios.post(`${API_BASE}/analyze`, fd, {
    headers: { "Content-Type": "multipart/form-data" },
    timeout: 600000
  });
  return resp.data;
};
