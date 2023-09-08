import { db } from "./db";
import { $, list } from "./common";
import deleteItem from "./deleteItem";

function download(url, name) {
    var link = document.createElement("a");
    link.download = name;
    link.href = url;
    $("body").appendChild(link);
    link.click();
    $("body").removeChild(link);
    //delete link;
}

export default function displayData() {
    // Here we empty the contents of the list element each time the display is updated
    // If you didn't do this, you'd get duplicates listed each time a new note is added
    while (list.firstChild) {
        list.removeChild(list.firstChild);
    }

    // Open our object store and then get a cursor - which iterates through all the
    // different data items in the store
    const objectStore = db.transaction("notes_os").objectStore("notes_os");
    var data = [];
    objectStore.openCursor().addEventListener("success", e => {
        // Get a reference to the cursor
        const cursor = e.target.result;

        // If there is still another data item to iterate through, keep running this code
        if (cursor) {
            data.push(cursor.value);
            // Create a list item, h3, and p to put each data item inside when displaying it
            // structure the HTML fragment, and append it inside the list
            const listItem = document.createElement("li");
            const h3 = document.createElement("h3");
            const para = document.createElement("p");

            if (cursor.value.title.trim() !== "") listItem.appendChild(h3);
            listItem.appendChild(para);
            list.appendChild(listItem);

            // Put the data from the cursor inside the h3 and para
            h3.textContent = cursor.value.title;
            para.textContent = cursor.value.body;

            // Store the ID of the data item inside an attribute on the listItem, so we know
            // which item it corresponds to. This will be useful later when we want to delete items
            listItem.setAttribute("data-note-id", cursor.value.id);

            // Create a button and place it inside each listItem
            const deleteBtn = document.createElement("button");
            listItem.appendChild(deleteBtn);
            deleteBtn.textContent = "x";
            deleteBtn.className = "delete-button";

            // Set an event handler so that when the button is clicked, the deleteItem()
            // function is run
            deleteBtn.addEventListener("click", deleteItem);

            // Iterate to the next item in the cursor
            cursor.continue();
        } else {
            // Again, if list item is empty, display a 'No notes stored' message
            if (!list.firstChild) {
                const listItem = document.createElement("li");
                listItem.textContent = "No notes stored.";
                list.appendChild(listItem);
            }
            // if there are no more cursor items to iterate through, say so
            //console.log("Notes all displayed");
        }
        const dataString = JSON.stringify(data);
        $("#download-link").onclick = () =>
            download("data:application/json," + dataString, "notes.json");
    });
}
