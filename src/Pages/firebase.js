import { initializeApp } from 'firebase/app';
import { getDatabase, ref, get, set, update, remove } from 'firebase/database';
import { getAuth } from 'firebase/auth'; 

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export const getUserData = async (path) => {
  try {
    const dbRef = ref(database, path);
    const snapshot = await get(dbRef);
    return snapshot.exists() ? snapshot.val() : null;
  } catch (error) {
    console.error("Error getting user data:", error);
    throw error;
  }
};

export const updateUserData = async (path, data) => {
  try {
    const dbRef = ref(database, path);
    await update(dbRef, data);
    return true;
  } catch (error) {
    console.error("Error updating user data:", error);
    throw error;
  }
};

export const sendMultiUserData = async (input) => {
  try {
    const lines = input.split('\n').map(line => line.trim()).filter(line => line);
    
    const updatePromises = lines.map(async (line) => {
      const [username, balance, warnings, bagage] = line.split('|').map(item => item.trim());
      
      const userData = {
        username,
        balance,
        warnings,
        bagage
      };

      await updateUserData(`planets/defaultPlanet/${username}`, userData);
    });

    await Promise.all(updatePromises);
    return true;
  } catch (error) {
    console.error("Error sending multi-user data:", error);
    throw error;
  }
};

export const deleteUser = async (path) => {
  try {
    const dbRef = ref(database, path);
    await remove(dbRef);
    return true;
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
};

export const getShopData = async (path) => {
  try {
    const dbRef = ref(database, path);
    const snapshot = await get(dbRef);
    return snapshot.exists() ? snapshot.val() : null;
  } catch (error) {
    console.error("Error getting shop data:", error);
    throw error;
  }
};

export const updateShopItem = async (path, itemData) => {
  try {
    const dbRef = ref(database, path);
    await update(dbRef, itemData);
    return true;
  } catch (error) {
    console.error("Error updating shop item:", error);
    throw error;
  }
};

export const addShopItem = async (path, itemData) => {
  try {
    const dbRef = ref(database, path);
    await set(dbRef, itemData);
    return true;
  } catch (error) {
    console.error("Error adding shop item:", error);
    throw error;
  }
};

export const deleteShopItem = async (path) => {
  try {
    const dbRef = ref(database, path);
    await remove(dbRef);
    return true;
  } catch (error) {
    console.error("Error deleting shop item:", error);
    throw error;
  }
};

export const auth = getAuth(app);
export { database };