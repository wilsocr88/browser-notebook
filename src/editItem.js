import { db } from "./db";
import displayData from "./displayData";

export default function editItem(e) {
    e.preventDefault();
    const id = Number.parseInt(e.target.parentElement.id);
    const title = e.target.parentElement.childNodes[0].value;
    const body = e.target.parentElement.childNodes[1].value;

    const newItem = {
        id: id,
        title: title,
        body: body,
    };

    const transaction = db.transaction(["notes_os"], "readwrite");
    const objectStore = transaction.objectStore("notes_os");
    const addRequest = objectStore.put(newItem);

    //addRequest.addEventListener("success", e => console.log(e));

    // Report on the success of the transaction completing, when everything is done
    transaction.addEventListener("complete", displayData);

    transaction.addEventListener("error", () =>
        console.log("Transaction not opened due to error")
    );
}
