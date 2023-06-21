import React, { useEffect, useRef, useState } from "react";
import "./ChatComponent.css";
import InsertEmoticonIcon from "@mui/icons-material/InsertEmoticon";
import EmojiPicker from "emoji-picker-react";
import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt";
import { Avatar } from "@mui/material";

const user_list = ["Alan", "Bob", "Carol", "Dean", "Elin"];

const ChatComponent = () => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [showPicker, setShowPicker] = useState(false);
  const [showUserList, setShowUserList] = useState(false);
  const messagesEndRef = useRef(null);
  const [mentionIndex, setMentionIndex] = useState(0);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const onEmojiClick = (e) => {
    let sym = e.unified.split("-");
    let codesArray = [];
    sym.forEach((el) => codesArray.push("0x" + el));
    let emoji = String.fromCodePoint(...codesArray);
    setInputValue((prev) => prev + emoji);
  };

  const handleLikeClick = (index) => {
    const updatedMessages = [...messages];
    updatedMessages[index].likeCount += 1;
    setMessages(updatedMessages);
  };

  const handleInputKeyPress = (e) => {
    if (e.key === "@") {
      setShowUserList(true);
      setMentionIndex(inputValue.length);
    }
    if (e.key === "Backspace") {
      setShowUserList(false);
    }
  };

  const handleUserClick = (user) => {
    setInputValue(inputValue + `${user} `);
    setShowUserList(false);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendClick = (e) => {
    e.preventDefault();
    if (inputValue.trim() !== "") {
      const randomUser =
        user_list[Math.floor(Math.random() * user_list.length)];
      const newMessage = {
        user: randomUser,
        text: inputValue.trim(),
        likeCount: 0,
      };
      setMessages([...messages, newMessage]);
      setInputValue("");
      setShowPicker(false);
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="chat">
      <div className="chat_header">
        <Avatar />

        <div className="chat_headerInfo">
          <h3> Introductions </h3>
          <p> This Channel Is For Company Wide Chatter</p>
        </div>
      </div>

      <div className="chat_body">
        {messages.map((message, index) => (
          <div className="chat_like" key={index}>
            <p className="chat_message">
              <span className="chat_name">
                {`${message.user}`}{" "}
                <span className="chat_timestamp">
                  {new Date().getHours()}:{new Date().getMinutes()}
                </span>
              </span>
              {`${message.text}`}
            </p>
            {<ThumbUpOffAltIcon onClick={() => handleLikeClick(index)} />}{" "}
            {message.likeCount}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      {showPicker && (
        <EmojiPicker height={500} width={400} onEmojiClick={onEmojiClick} />
      )}
      {showUserList && (
        <div className="user-list" style={{ position: "relative" }}>
          {user_list.map((user, index) => (
            <div
              key={index}
              onClick={() => handleUserClick(user)}
              style={{
                cursor: "pointer",
              }}
            >
              {user}
            </div>
          ))}
        </div>
      )}
      <div className="chat_footer">
        <InsertEmoticonIcon onClick={() => setShowPicker(!showPicker)} />

        <form>
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleInputKeyPress}
            placeholder="Type your message..."
          />

          <button type="submit" onClick={handleSendClick}>
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatComponent;
