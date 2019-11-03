
import firebase, { firestore, FirebaseError } from "firebase"
import { ListingItem } from "../model/app/ListingItem"


export interface DocListenerCallback {
    added: CallableFunction;
    removed?: CallableFunction;
    modified?: CallableFunction;
}

const db = firebase.firestore()
const collectionPath = "listingItems"

/** Adds new record and generates new id */
const add = (listingItem: ListingItem) => {
    return new Promise<firestore.DocumentReference>((resolve, reject) => {
        db.collection(collectionPath).add(listingItem)
            .then((ref: firestore.DocumentReference) => {
                resolve(ref)
            })
            .catch((error: FirebaseError) => reject(error))
    })
}

/**
 * Updates existing record by merging passed values with existing ones.
 * Fails if record does not exist
 */
const update = (id: string, listingItem: ListingItem) => {
    return new Promise((resolve, reject) => {
        db.collection(collectionPath).doc(id)
            .update(listingItem)
            .then(() => resolve())
            .catch((error: FirebaseError) => reject(error))
    })
}

/** Overwrites existing record, creates one if it does not exist */
const set = (id: string, listingItem: ListingItem) => {
    return new Promise((resolve, reject) => {
        db.collection(collectionPath).doc(id)
            .set(listingItem)
            .then(() => resolve())
            .catch((error: FirebaseError) => reject(error))
    })
}

/** Permanently removes a record from the database using id */
const hardDelete = (id: string) => {
    return new Promise((resolve, reject) => {
        db.collection(collectionPath).doc(id).delete()
            .then(() => resolve)
            .catch((error: FirebaseError) => reject(error))
    });
}

/** Targets a specific document and listens to updates real-time using id */
const listenToOne = (id: string, callback: (listingItem: ListingItem) => void) => {
    db.collection(collectionPath)
        .doc(id).onSnapshot((doc: firestore.DocumentSnapshot) => {
            callback(doc.data() as ListingItem)
        })
}

/** Gets a specific document once using id */
const getOne = (childId: string) => {
    return new Promise<ListingItem>((resolve, reject) => {
        db.collection(collectionPath)
            .doc(childId)
            .get().then((doc: firestore.DocumentSnapshot) => {
                resolve(doc.data() as ListingItem)
            }).catch((error: FirebaseError) => reject(error))
    })
}

/** Gets all document in a collection once */
const getAll = () => {
    return new Promise<ListingItem[]>((resolve, reject) => {
        const items: ListingItem[] = []
        db.collection(collectionPath).get().then((querySnapshot: firestore.QuerySnapshot) => {
            querySnapshot.forEach((doc) => {
                doc.data()
                items.push(doc.data() as ListingItem)
            })
            resolve(items)
        }).catch((error) => {
            reject(error)
        })
    });
}

/** Listens in real-time to all documents */
const listenToAll = (callback: DocListenerCallback) => {
    db.collection(collectionPath)
        .onSnapshot((snapshot) => {
            snapshot.docChanges().forEach((change: firestore.DocumentChange) => {
                if (change.type === "added") {
                    callback.added(change.doc)
                }
                if (change.type === "modified") {
                    callback.modified!!(change.doc)
                }
                if (change.type === "removed") {
                    callback.removed!!(change.doc)
                }
            });
        });
}

/** Gets a specific document once with query params */
const queryOnce = (params: ListingItem) => {
    return new Promise<ListingItem[]>((resolve, reject) => {
        let queryStore: any = db.collection(collectionPath)

        for (const key of Object.keys(params)) {
            queryStore = queryStore.where(key, "==", params[key])
        }

        queryStore.get().then((snapshot: firestore.QuerySnapshot) => {
            const results: ListingItem[] = []
            snapshot.docs.forEach((doc: firestore.DocumentSnapshot) => {
                results.push(doc.data() as ListingItem)
            })
            resolve(results)
        }).catch((error: FirebaseError) => reject(error))
    })
}

/**
 * Pushes a new document. Will fail if a similar record
 * already exists based on the identifier provided
 */
const addUnique = (params: ListingItem, listingItem: ListingItem) => {
    return new Promise<firestore.DocumentReference>((resolve, reject) => {
        queryOnce(params).then((results: ListingItem[]) => {
            if (results.length === 0) {
                add(listingItem)
                    .then((ref: firestore.DocumentReference) => resolve(ref))
                    .catch((error: FirebaseError) => reject(error))
            } else {
                // document exists, throw error
                reject("Unable to add unique. The document already exists.")
            }
        })
    })
}

export interface BatchOperation {
    batchUpdate: (id: string, listingItem: ListingItem) => BatchOperation
    batchSet: (id: string, listingItem: ListingItem) => BatchOperation
    batchDelete: (id: string) => BatchOperation
    commit: () => Promise<void>
    get: () => firestore.WriteBatch
}

/** Batch operations that can be chained */
const beginBatch = function (batch?: firestore.WriteBatch) {
    let dbBatch: firestore.WriteBatch

    if (batch) {
        dbBatch = batch
    } else {
        dbBatch = db.batch()
    }

    let operations: BatchOperation
    const batchUpdate = (id: string, listingItem: ListingItem): BatchOperation => {
        const updateRef = db.collection(collectionPath).doc(id)
        dbBatch.update(updateRef, listingItem)
        return operations
    }

    const batchSet = (id: string, listingItem: ListingItem): BatchOperation => {
        const setRef = db.collection(collectionPath).doc(id)
        dbBatch.set(setRef, listingItem)
        return operations
    }

    const batchDelete = (id: string): BatchOperation => {
        return operations
    }

    const commit = (): Promise<void> => {
        return new Promise<void>((resolve, reject) => {
            dbBatch.commit().then(() => {
                resolve()
            }).catch((error) => {
                reject(error)
            })
        });
    }

    // Returns the batch so it can be used by another beginBatch() function
    const get = (): firestore.WriteBatch => {
        return dbBatch
    }

    operations = {
        batchUpdate,
        batchSet,
        batchDelete,
        commit,
        get
    }
    return operations
}



export default {
    add,
    update,
    set,
    hardDelete,
    listenToOne,
    getOne,
    addUnique,
    queryOnce,
    beginBatch,
    listenToAll
    // end of exports
}

