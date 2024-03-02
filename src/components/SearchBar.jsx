import React, { useState, useEffect } from "react";
import {
  getFirestore,
  collection,
  getDocs,
  setDoc,
  getDoc,
  serverTimestamp,
  doc,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { Link } from "react-router-dom";

const SearchBar = () => {
  const [usernames, setUsernames] = useState([]);
  const [filteredUsernames, setFilteredUsernames] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const auth = getAuth();
  const db = getFirestore();

  useEffect(() => {
    const fetchUsernames = async () => {
      try {
        const usersCollection = collection(db, "users");
        const usersSnapshot = await getDocs(usersCollection);
        const usernamesData = usersSnapshot.docs.map((doc) => doc.data());
        setUsernames(usernamesData);
      } catch (error) {
        console.error("Error fetching usernames:", error.message);
      }
    };
    fetchUsernames();
  }, [db]);

  const handleSearch = (event) => {
    const searchTerm = event.target.value;
    setSearchTerm(searchTerm);

    if (searchTerm === "") {
      setFilteredUsernames([]);
    } else {
      const filteredList = usernames.filter((user) =>
        user.displayName.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredUsernames(filteredList);
    }
  };

  const userListClick = async (uid) => {
    const auth = getAuth();
    const currentID = auth.currentUser.uid;
    try {
      const userDoc1 = await getDoc(doc(db, "users", uid));
      const userDoc2 = await getDoc(doc(db, "users", currentID));

      if (userDoc1.exists() && userDoc2.exists()) {
        const displayName1 = userDoc1.data().displayName;
        const displayName2 = userDoc2.data().displayName;

        const conversationId = [uid, currentID].sort().join("_");
        const convCollection = doc(db, "conversations", conversationId);
        await setDoc(convCollection, {
          participants: [uid, currentID],
          displayNames: [displayName1, displayName2],
          timestamp: serverTimestamp(),
          id: conversationId,
        });
        alert("conversation added");
      } else alert("User not found");
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Search for a username..."
        value={searchTerm}
        onChange={handleSearch}
      />
      <ul className="list">
        {filteredUsernames.length === 0 && searchTerm.trim() !== "" ? (
          <p>No users found...</p>
        ) : (
          filteredUsernames.map((user, index) => (
            <li key={index}>
              <Link onClick={() => userListClick(user.uid)}>
                {user.displayName}
                <br />
              </Link>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default SearchBar;
