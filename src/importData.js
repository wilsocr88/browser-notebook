import { db } from "./db";
import displayData from "./displayData";

export default function importData(json) {
    const data = JSON.parse(json);
    var transaction;
    var addRequest;
    var done = false;
    for (let i = 0; i < data.length; i++) {
        const e = data[i];
        const newItem = { title: e.title, body: e.body };
        transaction = db.transaction(["notes_os"], "readwrite");
        const objectStore = transaction.objectStore("notes_os");
        addRequest = objectStore.add(newItem);
        if (i === data.length - 1) done = true;
    }
    addRequest.onsuccess = displayData;
    addRequest.onerror = () => console.log("Request error");
    transaction.onerror = () => console.log("Transaction error");
}
