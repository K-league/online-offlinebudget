const indexedDB = 
window.indexedDB ||
window.mozIndexedDB ||
window.webKitIndexedDB ||
window.msIndexedDB ||
window.shimIndexedDB;

console.log("indexeddb")
let db, tx, store;
function checkForIndexedDb() {
    if (!window.indexedDB) {
      console.log("Your browser doesn't support a stable version of IndexedDB.");
      return false;
    }
    return true;
  }
  //event listener for buttons
  //transaction tracker for offline, save transaction
 function useIndexedDb(databaseName, storeName, method, object) {
   console.log("use index db:" + databaseName + " " + storeName);
    return new Promise((resolve, reject) => {
      const request = window.indexedDB.open(databaseName, 1);
  
      request.onupgradeneeded = function(e) {
        const db = request.result;
        db.createObjectStore(storeName, { autoIncrement: true });
      };
  
      request.onerror = function(e) {
        console.log("There was an error");
      };
  
      request.onsuccess = function(e) {
        db = request.result;
        tx = db.transaction(storeName, "readwrite");
        store = tx.objectStore(storeName);
  
        db.onerror = function(e) {
          console.log("error");
        };
        if (method === "put") {
          store.put(object);
        } else if (method === "get") {
          const all = store.getAll();
          all.onsuccess = function() {
            resolve(all.result);
          };
        } else if (method === "delete") {
          store.delete(object._id);
        }
        tx.oncomplete = function() {
          db.close();
        };
      };
    });
  }
  function checkDatabase(databaseName){
    console.log("Checking database, will bulk upload if entries present");
    const request = window.indexedDB.open(databaseName, 1);
    request.onsuccess = function(e) {
      const db = request.result;
      const transaction = db.transaction(["pendingEntries"], "readwrite")
      const store = transaction.objectStore("pendingEntries")
      const getAll = store.getAll()

      getAll.onsuccess = function () {
        if (getAll.result.length > 0 ) {
          fetch("/api/transaction/bulk", {
            method: "POST",
            body: JSON.stringify(getAll.result),
            headers: {
              Accept: "application/json, text/plain, */*", "content-type": "application/json"
            }
          }) 
          .then(response => {
            return response.json()
          })
          .then(() => {
            const transaction = db.transaction(["pendingEntries"], "readwrite")
            const store = transaction.objectStore("pendingEntries")
            store.clear()
          })
        }
      }
    }
  }
  window.addEventListener("online", () => checkDatabase("budgetTracker"))
  //saverecord activity to save a record in activity or online tutorial 
  //pending transaction
  function saveRecord(transaction) {
    // useIndexedDb("budgetTracker", "transaction", "put", {name: "kay", value: 3, date: "2021-04-30T14:20:05.299Z"}) 
    useIndexedDb("budgetTracker", "pendingEntries", "put", transaction)
  }
