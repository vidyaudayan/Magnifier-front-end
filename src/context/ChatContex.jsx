import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { server } from "../main";

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
   const ElectoAI = import.meta.env.VITE_ELECTOAI_URL;
  const [messages, setMessages] = useState([]);
  const [prompt, setPrompt] = useState("");
  const [newRequestLoading, setNewRequestLoading] = useState(false);
  const [chats, setChats] = useState([]);
  const [selected, setSelected] = useState(null);
  const [createlod, setCreatelod] = useState(false);
  const [loading, setLoading] = useState(false);

  // ✅ Safe user parsing from localStorage
  const getStoredUser = () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      return {
        username: user?.username || user?.userName || "",
        state: user?.state || "",
      };
    } catch {
      return {
        username: "",
        state: "",
      };
    }
  };

  const [userInfo, setUserInfo] = useState(getStoredUser);

  // ✅ Refresh user info (can be called after login)
  const refreshUserInfo = () => {
    setUserInfo(getStoredUser());
  };

  // 🧠 Fetch response from Flask Gemini backend
  async function fetchResponse() {
    if (!prompt.trim()) return alert("Please enter a prompt");
    setNewRequestLoading(true);
    const currentPrompt = prompt;
    setPrompt("");

    try {
      const response = await axios.post(ElectoAI, {
        input: currentPrompt,
        username: userInfo.username,
        state: userInfo.state,
      });

      const message = {
        question: currentPrompt,
        answer: response.data.output,
      };

      setMessages((prev) => [...prev, message]);
    } catch (error) {
      console.error("Error fetching response from Gemini:", error);
      alert("Something went wrong while contacting Gemini");
    } finally {
      setNewRequestLoading(false);
    }
  }

  async function fetchChats() {
    try {
      const { data } = await axios.get(`${server}/api/chat/all`, {
        headers: {
          token: localStorage.getItem("token"),
        },
      });

      setChats(data);
      setSelected(data[0]?._id || null);
    } catch (error) {
      console.log(error);
    }
  }

  async function createChat() {
    setCreatelod(true);
    try {
      await axios.post(`${server}/api/chat/new`, {}, {
        headers: {
          token: localStorage.getItem("token"),
        },
      });
      fetchChats();
    } catch (error) {
      console.error("Error creating chat:", error);
      alert("Something went wrong while creating chat");
    } finally {
      setCreatelod(false);
    }
  }

  async function fetchMessages() {
    if (!selected) return;
    setLoading(true);
    try {
      const { data } = await axios.get(`${server}/api/chat/${selected}`, {
        headers: {
          token: localStorage.getItem("token"),
        },
      });
      setMessages(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  async function deleteChat(id) {
    try {
      const { data } = await axios.delete(`${server}/api/chat/${id}`, {
        headers: {
          token: localStorage.getItem("token"),
        },
      });
      alert(data.message);
      fetchChats();
    } catch (error) {
      console.log(error);
      alert("Something went wrong while deleting chat");
    }
  }

  useEffect(() => {
    fetchChats();
  }, []);

  useEffect(() => {
    fetchMessages();
  }, [selected]);

  return (
    <ChatContext.Provider
      value={{
        fetchResponse,
        messages,
        setMessages,
        prompt,
        setPrompt,
        newRequestLoading,
        chats,
        createChat,
        createlod,
        selected,
        setSelected,
        loading,
        setLoading,
        deleteChat,
        fetchChats,
        userInfo,
        refreshUserInfo, // 🔁 Exposed for components to use after login
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const ChatData = () => useContext(ChatContext);
