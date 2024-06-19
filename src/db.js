import displayData from "./displayData";

export var db;

const openRequest = window.indexedDB.open("notes_db", 1);
openRequest.onerror = () => console.error("Database failed to open");
openRequest.onsuccess = () => {
    db = openRequest.result;
    displayData();
};

// Set up the database tables if this has not already been done
openRequest.onupgradeneeded = e => {
    db = e.target.result;
    const objectStore = db.createObjectStore("notes_os", {
        keyPath: "id",
        autoIncrement: true,
    });
    objectStore.createIndex("title", "title", { unique: false });
    objectStore.createIndex("body", "body", { unique: false });
};
