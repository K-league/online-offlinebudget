const indexedDB = 
window.indexedDB ||
window.mozIndexedDB ||
window.webKitIndexedDB ||
window.msIndexedDB ||
window.shimIndexedDB;


let db;
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
    return new Promise((resolve, reject) => {
      const request = window.indexedDB.open(databaseName, 1);
      let db,
        tx,
        store;
  
      request.onupgradeneeded = function(e) {
        const db = request.result;
        db.createObjectStore(storeName, { keyPath: "_id" });
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
  function checkDatabase(){
    const transaction = db.transaction(["pending"], "readwrite")
    const store = transaction.objectStore("pending")
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
          const transaction = db.transaction(["pending"], "readwrite")
          const store = transaction.objectStore("pending")
          store.clear()
        })
      }
    }
  }
  window.addEventListener("online", checkDatabase)
  //saverecord activity to save a record in activity or online tutorial 
  //pending transaction
