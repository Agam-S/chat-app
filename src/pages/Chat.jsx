import React, { useState, useEffect } from "react";
import SearchBar from "../components/SearchBar";
import { useNavigate } from "react-router-dom";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  where,
  collection,
  query,
  getDocs,
} from "firebase/firestore";

import { getAuth, onAuthStateChanged } from "firebase/auth";

const Chat = () => {
  const navigate = useNavigate();
  // const { id } = useParams();
  // const [user, setUser] = useState({});
  const [dmList, setDmList] = useState();
  const [message, setMessage] = useState("");

  // useEffect(() => {
  //   const fetchDmData = async () => {
  //     if (id !== undefined) {
  //       try {
  //         const db = getFirestore();
  //         const userRef = doc(db, "conversations", id);
  //         const userSnap = await getDoc(userRef);

  //         if (userSnap.exists()) {
  //           setDmList({ ...userSnap.data() });
  //           console.log(dmList);
  //         } else {
  //           alert("DM not found");
  //         }
  //       } catch (error) {
  //         alert("Error fetching user data:", error.message);
  //       }
  //     }
  //   };

  //   fetchDmData();
  // }, [id]);

  useEffect(() => {
    const auth = getAuth();

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
        if (user) {
          const currentID = user.uid;

          const db = getFirestore();
          const dmRef = collection(db, "conversations");

          const q = query(
            dmRef,
            where("participants", "array-contains", currentID)
          );

          const querySnapshot = await getDocs(q);

          if (!querySnapshot.empty) {
            const dmListData = querySnapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }));
            setDmList(dmListData);
            console.log(dmListData);
          } else {
            alert("No DMs found");
          }
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

  const handleChange = (event) => {
    setMessage(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    console.log(`Sending message: ${message}`);

    // save message in db
    const db = getFirestore();
    // const chatRef = doc(db, "chats");
    // await setDoc(chatRef, {
    //   chat: userName,
    //   email: user.email,
    //   uid: user.uid,
    //   timestamp: serverTimestamp(),
    // });

    setMessage("");
  };

  return (
    <>
      <h1>Chat Page</h1>
      <p>Search for a user</p>
      <SearchBar />

      <div>
        <h1>Your DM List</h1>
      </div>

      <div>
        {/* <h1>Chatting with {user.displayName}</h1> */}
        <p>Messages will go here</p>
        {/* past messages */}
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={message}
            onChange={handleChange}
            placeholder="Type your message..."
          />
          <button type="submit">Send</button>
        </form>
      </div>
    </>
  );
};

export default Chat;
