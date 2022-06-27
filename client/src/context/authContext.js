import { createContext, useContext, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  updateProfile,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
} from "firebase/auth";
import { auth } from "../firebase";

export const authContext = createContext();

export const useAuth = () => {
  const context = useContext(authContext);
  if (!context) throw new Error("There is no Auth provider");
  return context;
};

export function AuthProvider({ children }) {
  const serverBaseUrl = "http://localhost:5000/api/";
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [myMessages, setMyMessages] = useState([]);
  const [myPhoneLists, setMyPhoneLists] = useState([]);

  const signup = (email, password, name, lastName) =>
    /* Crea la cuenta con correo y contraseña */
    createUserWithEmailAndPassword(auth, email, password).then(
      /* Añade Nombre y apellido al momento de crear la cuenta */
      async function (result) {
        return await updateProfile(auth.currentUser, {
          displayName: name + " " + lastName,
        });
      }
    );

  const login = async (email, password) =>
    signInWithEmailAndPassword(auth, email, password);

  const logout = () => signOut(auth);

  const loginWithGoogle = () => {
    const googleProvider = new GoogleAuthProvider();
    return signInWithPopup(auth, googleProvider);
  };

  const resetPassword = (email) => {
    sendPasswordResetEmail(auth, email);
  };

  const changeName = async (newName) => {
    return await updateProfile(auth.currentUser, { displayName: newName });
  };

  const getMessages = async () => {
    setMyMessages([]);
    await fetch(serverBaseUrl + "getMessages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: user.email,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        data.messages.forEach((receivedMessage) => {
          setMyMessages((tableDataSource) => [
            ...tableDataSource,
            receivedMessage,
          ]);
        });
      });
  };
  const getPhoneLists = async () => {
    setMyPhoneLists([]);
    await fetch(serverBaseUrl + "getPhoneLists", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: user.email,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        data.phoneLists.forEach((receivedPhoneList) => {
          setMyPhoneLists((tableDataSource) => [
            ...tableDataSource,
            receivedPhoneList,
          ]);
        });
      });
  };
  const updateMessage = async (idToUpdate, newTitle, newBody) => {
    setMyMessages([]);
    await fetch(serverBaseUrl + "updateMessage", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: idToUpdate,
        title: newTitle,
        message: newBody
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
      });
  };
  const updatePhoneList = async (idToUpdate, newTitle, newPhoneList) => {
    setMyMessages([]);
    await fetch(serverBaseUrl + "updatePhoneList", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: idToUpdate,
        title: newTitle,
        phoneList: newPhoneList
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
      });
  };
  const deleteMessage = async (idToDelete) => {
    setMyMessages([]);
    await fetch(serverBaseUrl + "deleteMessage", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: idToDelete,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
      });
  };
  const deletePhoneList = async (idToDelete) => {
    setMyPhoneLists([]);
    await fetch(serverBaseUrl + "deletePhoneList", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: idToDelete,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
      });
  };

  useEffect(() => {
    const unsubuscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
      setMyMessages([]);
      setMyPhoneLists([]);
    });
    return () => unsubuscribe();
  }, []);

  useEffect(() => {
    getMessages();
    getPhoneLists();
  }, [user]);

  return (
    <authContext.Provider
      value={{
        signup,
        login,
        logout,
        user,
        loading,
        loginWithGoogle,
        resetPassword,
        changeName,
        myMessages,
        myPhoneLists,
        getMessages,
        getPhoneLists,
        updateMessage,
        updatePhoneList,
        deleteMessage,
        deletePhoneList
      }}
    >
      {children}
    </authContext.Provider>
  );
}
