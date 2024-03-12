import React, { useState, useEffect } from "react";
import SearchBar from "../components/SearchBar";
import { useNavigate, Link } from "react-router-dom";
import {
  getFirestore,
  where,
  collection,
  query,
  onSnapshot,
} from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import "./Chat.css";
import PinkButton from "../theme/PinkButton";
import { auth } from "../config/firebase.config";

const Chat = () => {
  const navigate = useNavigate();
  const [dmList, setDmList] = useState([]);
  const [currentUserID, setCurrentID] = useState();
  const auth = getAuth();

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
  }, [setDmList, navigate]);

  let otherParticipantDisplayName = "";
  const getOtherParticipantDisplayName = (conversation, currentUserID) => {
    const [participant1, participant2] = conversation.participants;
    const [displayName1, displayName2] = conversation.displayNames;

    otherParticipantDisplayName =
      currentUserID === participant1 ? displayName2 : displayName1;

    return otherParticipantDisplayName;
  };

  return (
    <>
      <PinkButton />
      <div className="container">
        <div className="search-area">
          <h1>Chat Page</h1>
          <p>Add a user</p>
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
      </div>
    </>
  );
};

export default Chat;
