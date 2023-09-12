import { db } from "./db";
import { list } from "./common";

export default function deleteItem(e) {
    // retrieve the name of the task we want to delete. We need
    // to convert it to a number before trying to use it with IDB; IDB key
    // values are type-sensitive.
    const noteId = Number(e.target.parentNode.id);

    // open a database transaction and delete the task, finding it using the id we retrieved above
    const transaction = db.transaction(["notes_os"], "readwrite");
    const objectStore = transaction.objectStore("notes_os");
    objectStore.delete(noteId);

    // report that the data item has been deleted
    transaction.addEventListener("complete", () => {
        // delete the parent of the button
        // which is the list item, so it is no longer displayed
        e.target.parentNode.parentNode.removeChild(e.target.parentNode);
        //console.log(`Note ${noteId} deleted.`);

        // Again, if list item is empty, display a 'No notes' message
        if (!list.firstChild) {
            const listItem = document.createElement("li");
            listItem.textContent = "No notes yet";
            list.appendChild(listItem);
        }
    });
}
