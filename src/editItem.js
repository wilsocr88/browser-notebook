import { db } from "./db";
import { titleInput, bodyInput } from "./common";
import displayData from "./displayData";

export default function editItem(e) {
    e.preventDefault();

    // grab the values entered into the form fields and store them in an object ready for being inserted into the DB
    const newItem = {
        title: e.target.parentElement.childNodes,
        body: bodyInput.value,
    };

    // open a read/write db transaction, ready for adding the data
    const transaction = db.transaction(["notes_os"], "readwrite");

    // call an object store that's already been added to the database
    const objectStore = transaction.objectStore("notes_os");

    // Make a request to add our newItem object to the object store
    const addRequest = objectStore.put(newItem, e.target.parentElement.id);

    addRequest.addEventListener("success", () => {
        // Clear the form, ready for adding the next entry
        titleInput.value = "";
        bodyInput.value = "";
    });

    // Report on the success of the transaction completing, when everything is done
    transaction.addEventListener("complete", () => {
        //console.log("Transaction completed: database modification finished.");

        // update the display of data to show the newly added item, by running displayData() again.
        displayData();
    });

    transaction.addEventListener("error", () =>
        console.log("Transaction not opened due to error")
    );
}
