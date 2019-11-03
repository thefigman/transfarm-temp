interface ListingItem {
  // id of the actual document
  id?: string
  title?: string
  price?: number
  // weight in kg
  weight?: number
  details?: string[]
  imgUrl?: string
  
  // long timestamp format
  // date the other party wants the transaction to be completed
  date?: number
  expiration?: number
  listingType?: ListingType
  // the one who posted the item
  userId?: string
  // the one who agreed to take on the contract
  otherUser?: string
  timestamp?: number

  contractStatus: ContractStatus
}

enum ListingType {
  SELLING,
  BUYING
}

enum ContractStatus {
  ACTIVE,
  PENDING,
  FULFILLED
}

export {
  ListingItem, ListingType
}