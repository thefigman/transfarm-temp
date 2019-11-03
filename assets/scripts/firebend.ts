import * as fs from "fs"

// get the input dir from the cmd
const inputDir = "./model/app";
const outputDir = "./firebends"
// this is the target folder from the import in the generated file
const relativeImportFolder = "../model";
// export interface <interfacename> {<any>}
const interfaceRegex = /export interface \w+ \s*[{]\s*[\s\S]*?\s*[}][\s]*\/\/\s*generate/gi
// export interface (<interfacename>) | with capture on interfacename
const interfaceNameRegex = /export interface (\w+) \s*/
// (<collectionname>): { [<any>: <any>]: (<interfacename>) }
const subColRegex = /(\w+)\s*[:]\s*[{][\s\S]*?[:][\s\S]*?[:]\s*(\w+)\s*[}]/gi

// iterate all files from the folder
fs.readdir(inputDir, (_, files) => {
  for (const file of files) {
    // read the file
    const fileContent = fs.readFileSync(inputDir + "/" + file)
    // find the interfaces
    const interfaceMatches = fileContent.toString().match(interfaceRegex)
    for (const interfaceMatch of interfaceMatches!!) {
      // the name of the parent interface
      const interfaceName = interfaceNameRegex.exec(interfaceMatch)!![1]
      // make the name of the collection the name of the interface with the first letter in lowercase
      const collection = interfaceName.split("")
      collection[0] = collection[0].toLowerCase()

      let generatedCode = generateCollection(
        relativeImportFolder,
        file,
        interfaceName,
        collection.join("") + "s",
        collection.join(""))
      console.log(generatedCode)

      // check if there are subcollections
      const subCollections = interfaceMatch.match(subColRegex)

      if (subCollections) {
        for (const subCollection of subCollections) {
          const capture = /(\w+)\s*[:]\s*[{][\s\S]*?[:][\s\S]*?[:]\s*(\w+)\s*[}]/gi.exec(subCollection)
          if (capture) {
            // write imports
            generatedCode = generatedCode.replace("{{importsPlaceholder}}",
              `import { ${capture[2]} } from "${relativeImportFolder}/${file.replace(".ts", "")}"\n
                                {{importsPlaceholder}}`)

            // write exports
            generatedCode = generatedCode
              .replace("{{exportPlaceholder}}",
                capture[1] + ",\n{{exportPlaceholder}}")

            const generatedSubcolCode = generateSubCollection(
              collection.join("") + "s",
              capture[1],
              capture[2]
            )

            generatedCode = generatedCode.replace("{{subcollectionPlaceholder}}",
              generatedSubcolCode + "\n    {{subcollectionPlaceholder}}")
          }
        }
      }
      generatedCode = generatedCode.replace("{{exportPlaceholder}}", "// end of exports")
      generatedCode = generatedCode.replace("{{importsPlaceholder}}", "")
      generatedCode = generatedCode.replace("{{subcollectionPlaceholder}}", "")

      fs.writeFile(outputDir + "/" + interfaceName + "s.ts",
        generatedCode, (err) => {
          console.log(err);
        })
    }
  }
})

const generateCollection = (
  folderName: string,
  fileName: string,
  interfaceName: string,
  collectionPath: string,
  documentName: string) => {

  return `
import firebase, { firestore, FirebaseError } from "firebase"
import { ${interfaceName} } from "${folderName}/${fileName.replace(".ts", "")}"
{{importsPlaceholder}}

export interface DocListenerCallback {
    added: CallableFunction;
    removed?: CallableFunction;
    modified?: CallableFunction;
}

const db = firebase.firestore()
const collectionPath = "${collectionPath}"

/** Adds new record and generates new id */
const add = (${documentName}: ${interfaceName}) => {
    return new Promise<firestore.DocumentReference>((resolve, reject) => {
        db.collection(collectionPath).add(${documentName})
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
const update = (id: string, ${documentName}: ${interfaceName}) => {
    return new Promise((resolve, reject) => {
        db.collection(collectionPath).doc(id)
            .update(${documentName})
            .then(() => resolve())
            .catch((error: FirebaseError) => reject(error))
    })
}

/** Overwrites existing record, creates one if it does not exist */
const set = (id: string, ${documentName}: ${interfaceName}) => {
    return new Promise((resolve, reject) => {
        db.collection(collectionPath).doc(id)
            .set(${documentName})
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
const listenToOne = (id: string, callback: (${documentName}: ${interfaceName}) => void) => {
    db.collection(collectionPath)
        .doc(id).onSnapshot((doc: firestore.DocumentSnapshot) => {
            callback(doc.data() as ${interfaceName})
        })
}

/** Gets a specific document once using id */
const getOne = (childId: string) => {
    return new Promise<${interfaceName}>((resolve, reject) => {
        db.collection(collectionPath)
            .doc(childId)
            .get().then((doc: firestore.DocumentSnapshot) => {
                resolve(doc.data() as ${interfaceName})
            }).catch((error: FirebaseError) => reject(error))
    })
}

/** Gets all document in a collection once */
const getAll = () => {
    return new Promise<${interfaceName}[]>((resolve, reject) => {
        const items: ${interfaceName}[] = []
        db.collection(collectionPath).get().then((querySnapshot: firestore.QuerySnapshot) => {
            querySnapshot.forEach((doc) => {
                doc.data()
                items.push(doc.data() as ${interfaceName})
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
const queryOnce = (params: ${interfaceName}) => {
    return new Promise<${interfaceName}[]>((resolve, reject) => {
        let queryStore: any = db.collection(collectionPath)

        for (const key of Object.keys(params)) {
            queryStore = queryStore.where(key, "==", params[key])
        }

        queryStore.get().then((snapshot: firestore.QuerySnapshot) => {
            const results: ${interfaceName}[] = []
            snapshot.docs.forEach((doc: firestore.DocumentSnapshot) => {
                results.push(doc.data() as ${interfaceName})
            })
            resolve(results)
        }).catch((error: FirebaseError) => reject(error))
    })
}

/**
 * Pushes a new document. Will fail if a similar record
 * already exists based on the identifier provided
 */
const addUnique = (params: ${interfaceName}, ${documentName}: ${interfaceName}) => {
    return new Promise<firestore.DocumentReference>((resolve, reject) => {
        queryOnce(params).then((results: ${interfaceName}[]) => {
            if (results.length === 0) {
                add(${documentName})
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
    batchUpdate: (id: string, ${documentName}: ${interfaceName}) => BatchOperation
    batchSet: (id: string, ${documentName}: ${interfaceName}) => BatchOperation
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
    const batchUpdate = (id: string, ${documentName}: ${interfaceName}): BatchOperation => {
        const updateRef = db.collection(collectionPath).doc(id)
        dbBatch.update(updateRef, ${documentName})
        return operations
    }

    const batchSet = (id: string, ${documentName}: ${interfaceName}): BatchOperation => {
        const setRef = db.collection(collectionPath).doc(id)
        dbBatch.set(setRef, ${documentName})
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

{{subcollectionPlaceholder}}

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
    {{exportPlaceholder}}
}

`
}


const generateSubCollection = (
  collectionPath: string,
  subcollectionPath: string,
  interfaceName: string
) => {

  let docName: any = subcollectionPath.split("")
  if (docName[docName.length - 1] === "s") {
    docName.pop()
  }
  docName = docName.join("")

  return `
const ${subcollectionPath} = (id: string) => {
    const collectionPath = "${collectionPath}"
    const subcollectionPath = "${subcollectionPath}"
    /** Adds new record and generates new id */
    const add = (${docName}: ${interfaceName}) => {
        return new Promise<firestore.DocumentReference>((resolve, reject) => {
            db.collection(collectionPath)
                .doc(id)
                .collection(subcollectionPath).add(${docName})
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
    const update = (childId: string, ${docName}: ${interfaceName}) => {
        return new Promise((resolve, reject) => {
            db.collection(collectionPath)
                .doc(id)
                .collection(subcollectionPath)
                .doc(childId)
                .update(${docName})
                .then(() => resolve())
                .catch((error: FirebaseError) => reject(error))
        })
    }

    /** Overwrites existing record, creates one if it does not exist */
    const set = (childId: string, ${docName}: ${interfaceName}) => {
        return new Promise((resolve, reject) => {
            db.collection(collectionPath)
                .doc(id)
                .collection(subcollectionPath)
                .doc(childId)
                .set(${docName})
                .then(() => resolve())
                .catch((error: FirebaseError) => reject(error))
        })
    }

    /** Permanently removes a record from the database using id */
    const hardDelete = (childId: string) => {
        return new Promise((resolve, reject) => {
            db.collection(collectionPath)
                .doc(id)
                .collection(subcollectionPath)
                .doc(childId)
                .delete()
                .then(() => resolve)
                .catch((error: FirebaseError) => reject(error))
        });
    }

    /** Targets a specific document and listens to updates real-time using id */
    const listenToOne = (childId: string, callback: (${docName}: ${interfaceName}) => void) => {
        db.collection(collectionPath)
            .doc(id)
            .collection(subcollectionPath)
            .doc(childId)
            .onSnapshot((doc: firestore.DocumentSnapshot) => {
                callback(doc.data() as ${interfaceName})
            })
    }

    /** Gets a specific document once using id */
    const getOne = (childId: string) => {
        return new Promise<${interfaceName}>((resolve, reject) => {
            db.collection(collectionPath)
                .doc(id)
                .collection(subcollectionPath)
                .doc(childId)
                .get().then((doc: firestore.DocumentSnapshot) => {
                    resolve(doc.data() as ${interfaceName})
                }).catch((error: FirebaseError) => reject(error))
        })
    }

        /** Gets all document in a collection once */
    const getAll = () => {
        return new Promise<${interfaceName}[]>((resolve, reject) => {
            const items: ${interfaceName}[] = []
            db.collection(collectionPath)
            .doc(id)
            .collection(subcollectionPath)
            .get().then((querySnapshot: firestore.QuerySnapshot) => {
                querySnapshot.forEach((doc) => {
                    doc.data()
                    items.push(doc.data() as ${interfaceName})
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
            .doc(id)
            .collection(subcollectionPath)
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
    const queryOnce = (params: ${interfaceName}) => {
        return new Promise<${interfaceName}[]>((resolve, reject) => {
            let queryStore: any = db.collection(collectionPath)
                .doc(id)
                .collection(subcollectionPath)
                .doc(id).collection(subcollectionPath)

            for (const key of Object.keys(params)) {
                queryStore = queryStore.where(key, "==", params[key])
            }

            queryStore.get().then((snapshot: firestore.QuerySnapshot) => {
                const results: ${interfaceName}[] = []
                snapshot.docs.forEach((doc: firestore.DocumentSnapshot) => {
                    results.push(doc.data() as ${interfaceName})
                })
                resolve(results)
            }).catch((error: FirebaseError) => reject(error))
        })
    }

    /**
     * Pushes a new document. Will fail if a similar record
     * already exists based on the identifier provided
     */
    const addUnique = (params: ${interfaceName}, ${docName}: ${interfaceName}) => {
        return new Promise<firestore.DocumentReference>((resolve, reject) => {
            queryOnce(params).then((results: ${interfaceName}[]) => {
                if (results.length === 0) {
                    add(${docName})
                        .then((ref: firestore.DocumentReference) => resolve(ref))
                        .catch((error: FirebaseError) => reject(error))
                } else {
                    // document exists, throw error
                    reject("Unable to add unique. The document already exists.")
                }
            })
        })
    }
    return {
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
    }
}
`
}

export default {

}
