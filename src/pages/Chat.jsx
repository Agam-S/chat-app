import React, { useState, useEffect, useRef } from "react";
import SearchBar from "../components/SearchBar";
import { useNavigate, Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import {
  getFirestore,
  where,
  collection,
  query,
  orderBy,
  addDoc,
  serverTimestamp,
  onSnapshot,
} from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import "./Chat.css";
import { Button } from "react-bootstrap";
import PinkButton from "../theme/PinkButton";
import { auth } from "../config/firebase.config";

const Chat = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");

  const [dmList, setDmList] = useState([]);
  const [currentUserID, setCurrentID] = useState();
  const auth = getAuth();
  const currentUserId = auth.currentUser?.uid;
  const chatAreaRef = useRef(null);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
        if (user) {
          const currentID = user.uid;
          setCurrentID(currentID);
          const db = getFirestore();
          const dmRef = collection(db, "conversations");

          const q = query(
            dmRef,
            where("participants", "array-contains", currentID)
          );

          const unsubscribeDmList = onSnapshot(q, (querySnapshot) => {
            if (!querySnapshot.empty) {
              const dmListData = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
              }));
              setDmList(dmListData);
            } else {
              alert("No DMs found");
            }
          });

          return () => unsubscribeDmList();
        } else {
          console.log("User not authenticated");
          navigate("/login");
        }
      } catch (error) {
        console.error("Error fetching DM data:", error.message);
        alert("Error fetching DM data:", error.message);
      }
    });

    return () => unsubscribe();
  }, [setDmList]);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const db = getFirestore();
        const messagesRef = collection(db, "messages");
        const q = query(
          messagesRef,
          where("conversationId", "==", id),
          orderBy("timestamp")
        );

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
          const messagesData = querySnapshot.docs.map((doc) => doc.data());
          setMessages(messagesData);
        });

        return () => unsubscribe();
      } catch (error) {
        console.error("Error fetching messages:", error.message);
      }
    };

    fetchMessages();

    return () => clearInterval();
  }, [id]);

  const handleSendMessage = async () => {
    try {
      const db = getFirestore();
      const messagesRef = collection(db, "messages");
      await addDoc(messagesRef, {
        conversationId: id,
        senderId: currentUserId,
        text: messageInput,
        timestamp: serverTimestamp(),
      });
      setMessageInput("");
    } catch (error) {
      console.error("Error sending message:", error.message);
    }
  };

  const getOtherParticipantDisplayName = (conversation, currentUserID) => {
    const [participant1, participant2] = conversation.participants;
    const [displayName1, displayName2] = conversation.displayNames;

    const otherParticipantDisplayName =
      currentUserID === participant1 ? displayName2 : displayName1;

    return otherParticipantDisplayName;
  };

  useEffect(() => {
    chatAreaRef.current.scrollTop = chatAreaRef.current.scrollHeight;
  }, [id, messages]);

  return (
    <>
      <PinkButton />
      <div className="container">
        <div className="search-area">
          <h1>Chat Page</h1>
          <p>Search for a user</p>
          <SearchBar />
        </div>

        <div className="dm-list">
          <h1>Your DM List</h1>
          {dmList.map((conversation) => (
            <div key={conversation.id}>
              <p>
                <Link to={`/chat/${conversation.id}`}>
                  {getOtherParticipantDisplayName(conversation, currentUserID)}
                </Link>
              </p>
            </div>
          ))}
        </div>

        <div className="chat-area">
          <h2>
            Chatting with{" "}
            {dmList.map((conversation) =>
              conversation.id === id
                ? getOtherParticipantDisplayName(conversation, currentUserID)
                : null
            )}
          </h2>
          <div className="messages-container" ref={chatAreaRef}>
            {" "}
            {messages.map((message) => (
              <div
                key={message.id}
                className={`message ${
                  message.senderId === currentUserId
                    ? "sender-message"
                    : "recipient-message"
                }`}
              >
                <strong>
                  {message.senderId === currentUserId ? "You" : "Other"}:
                </strong>{" "}
                {message.text}
              </div>
            ))}
          </div>
          <div className="input-container">
            <input
              type="text"
              value={messageInput}
              placeholder="Send a message..."
              onChange={(e) => setMessageInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSendMessage();
                }
              }}
            />
            <Button variant="pink" onClick={handleSendMessage}>
              Send
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Chat;
