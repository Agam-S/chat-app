import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
import { Button } from "react-bootstrap";
import PinkButton from "../theme/PinkButton";

const Chatting = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  const [dmList, setDmList] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [currentIdLoaded, setCurrentIdLoaded] = useState(false);
  const auth = getAuth();
  const chatAreaRef = useRef(null);

  useEffect(() => {
    if (messages && messages.length > 0 && chatAreaRef.current) {
      chatAreaRef.current.scrollTop = chatAreaRef.current.scrollHeight;
    }
  }, [id, messages]);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        const currentID = user.uid;
        setCurrentUserId(currentID);
        setCurrentIdLoaded(true);
      } else {
        setCurrentUserId(null);
        setCurrentIdLoaded(true);
        navigate("/login");
      }
    });

    return () => unsubscribeAuth();
  }, [auth, navigate]);

  useEffect(() => {
    if (currentIdLoaded) {
      const fetchDmList = async () => {
        try {
          const db = getFirestore();
          const dmRef = collection(db, "conversations");

          if (currentUserId) {
            const q = query(
              dmRef,
              where("participants", "array-contains", currentUserId)
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
          }
        } catch (error) {
          console.error("Error fetching DM data:", error.message);
        }
      };

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
            const messagesData = querySnapshot.docs.map((doc) => {
              const data = doc.data();
              const timestampInSeconds =
                data.timestamp && typeof data.timestamp === "object"
                  ? data.timestamp.seconds || 0
                  : 0;
              return {
                ...data,
                formattedDate: convertTimestampToDate(timestampInSeconds),
              };
            });
            setMessages(messagesData);
          });

          return () => unsubscribe();
        } catch (error) {
          console.error("Error fetching messages:", error.message);
        }
      };

      fetchDmList();
      fetchMessages();
    } else {
      console.log("Loading");
    }
  }, [id, currentUserId, currentIdLoaded]);

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

  let otherParticipantDisplayName = "";
  const getOtherParticipantDisplayName = (conversation, currentUserID) => {
    const [participant1, participant2] = conversation.participants;
    const [displayName1, displayName2] = conversation.displayNames;

    otherParticipantDisplayName =
      currentUserID === participant1 ? displayName2 : displayName1;

    return otherParticipantDisplayName;
  };

  const convertTimestampToDate = (timestampInSeconds) => {
    const timestampInMilliseconds = timestampInSeconds * 1000;
    const date = new Date(timestampInMilliseconds);

    const options = {
      hour: "numeric",
      minute: "numeric",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return date.toLocaleString("en-US", options);
  };

  return (
    <>
      <PinkButton />
      <div className="container">
        <div className="chat-area">
          <h2>
            Chatting with{" "}
            {dmList.map((conversation) =>
              conversation.id === id
                ? getOtherParticipantDisplayName(conversation, currentUserId)
                : null
            )}
          </h2>
          {messages.length === 0 ? (
            <p>No messages found.</p>
          ) : (
            <div className="messages-container" ref={chatAreaRef}>
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
                    {message.senderId === currentUserId
                      ? "You"
                      : otherParticipantDisplayName}
                  </strong>
                  <br />
                  {message.text}
                  <br />
                  <div className="time">{message.formattedDate}</div>
                </div>
              ))}
            </div>
          )}
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

export default Chatting;
