import { db } from "./db";
import { list } from "./common";
import displayData from "./displayData";

export default function deleteItem(e) {
    const noteId = Number(e.target.parentNode.id);
    const transaction = db.transaction(["notes_os"], "readwrite");
    const objectStore = transaction.objectStore("notes_os");
    objectStore.delete(noteId);
    transaction.addEventListener("complete", () => {
        // delete the list item
        e.target.parentNode.parentNode.removeChild(e.target.parentNode);

        if (!list.firstChild) {
            const listItem = document.createElement("li");
            listItem.textContent = "No notes yet";
            list.appendChild(listItem);
        }
        displayData();
    });
}
