import { db } from "./db";
import { titleInput, bodyInput } from "./common";
import displayData from "./displayData";

export default function addData(e) {
    e.preventDefault();
    if (bodyInput.value.trim() === "") return;

    const newItem = { title: titleInput.value, body: bodyInput.value };
    const transaction = db.transaction(["notes_os"], "readwrite");
    const objectStore = transaction.objectStore("notes_os");
    const addRequest = objectStore.add(newItem);

    addRequest.addEventListener("success", () => {
        titleInput.value = "";
        bodyInput.value = "";
        bodyInput.style.height = "unset";
    });

    // Report on the success of the transaction completing, when everything is done
    transaction.addEventListener("complete", displayData);

    transaction.addEventListener("error", () =>
        console.log("Transaction not opened due to error")
    );
}
