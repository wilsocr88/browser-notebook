import { db } from "./db";
import { $, list } from "./common";
import displayData from "./displayData";
import { strings } from "./strings";

export default function deleteItem(e) {
    const noteId = Number(sessionStorage.getItem("noteId"));
    sessionStorage.removeItem("noteId");
    const transaction = db.transaction(["notes_os"], "readwrite");
    const objectStore = transaction.objectStore("notes_os");
    objectStore.delete(noteId);
    transaction.oncomplete = () => {
        // delete the list item
        e.target.parentNode.parentNode.removeChild(e.target.parentNode);

        if (!list.firstChild) {
            const listItem = document.createElement("li");
            listItem.textContent = strings.noNotes;
            list.appendChild(listItem);
        }
        displayData();
    };
}

export function showModal(e) {
    $("#modal-delete").onclick = () => deleteItem(e);
    const noteId = Number(e.target.parentNode.id);
    sessionStorage.setItem("noteId", noteId);
    $("#modal").showModal();
}
