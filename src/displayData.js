import { db } from "./db";
import { $, list } from "./common";
import deleteItem from "./deleteItem";
import editItem from "./editItem";

const newNode = el => document.createElement(el);

function download(url, name) {
    var link = newNode("a");
    link.download = name;
    link.href = url;
    $("body").appendChild(link);
    link.click();
    $("body").removeChild(link);
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
            const listItem = newNode("li");
            const h3 = newNode("h3");
            const para = newNode("p");

            listItem.id = cursor.primaryKey;
            if (cursor.value.title.trim() !== "") listItem.appendChild(h3);
            listItem.appendChild(para);
            list.appendChild(listItem);

            // Put the data from the cursor inside the h3 and para
            h3.textContent = cursor.value.title;
            para.textContent = cursor.value.body;

            // Create a button and place it inside each listItem
            const deleteBtn = newNode("button");
            listItem.appendChild(deleteBtn);
            deleteBtn.textContent = "x";
            deleteBtn.className = "delete-button";
            deleteBtn.addEventListener("click", deleteItem);

            const editBtn = newNode("button");
            listItem.appendChild(editBtn);
            editBtn.textContent = "edit";
            editBtn.className = "edit-button";
            editBtn.addEventListener("click", e => {
                const item = e.target.parentNode;
                const id = item.id;
                const request = db
                    .transaction("notes_os")
                    .objectStore("notes_os")
                    .get(Number.parseInt(id));
                request.onsuccess = () => {
                    const record = request.result;

                    const titleField = newNode("input");
                    titleField.value = record.title;
                    titleField.className = "title-input";
                    titleField.placeholder = "Title (optional)";

                    const bodyField = newNode("textarea");
                    bodyField.textContent = record.body;
                    bodyField.className = "body-input";
                    bodyField.style = "border:1px solid #000";
                    bodyField.placeholder = "Note body";

                    const saveButton = newNode("button");
                    saveButton.textContent = "Save";
                    saveButton.className = "save-edit-button";
                    saveButton.onclick = editItem;

                    listItem.innerHTML = "";
                    listItem.appendChild(titleField);
                    listItem.appendChild(bodyField);
                    listItem.appendChild(saveButton);
                };
            });

            // Iterate to the next item in the cursor
            cursor.continue();
        } else {
            // Again, if list item is empty, display a 'No notes stored' message
            if (!list.firstChild) {
                const listItem = newNode("li");
                listItem.textContent = "No notes yet";
                list.appendChild(listItem);
            }
            // if there are no more cursor items to iterate through, say so
            //console.log("Notes all displayed");
        }
        if (data.length > 0) {
            const dataString = JSON.stringify(data);
            $("#download-link").style = "display:inline";
            $("#download-link").onclick = () =>
                download("data:application/json," + dataString, "notes.json");
        } else {
            $("#download-link").style = "display:none";
        }
    });
}
