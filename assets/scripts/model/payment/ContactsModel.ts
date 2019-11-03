interface FuturesFactory {
  smart_futures_buy: SmartFutures[]
  smart_futures_sell: SmartFutures[]
}

interface SmartFutures {
  state: StateEnum
}

interface UserDetails {
  name: string
  contract: string
  location: string
}

interface BillingDetails {
  quantity: string
  unit: string
  qty_price: string
  currency: string
  total_price: string
}

interface Metadata {
  // TODO
}

enum StateEnum {
  NULL, CREATED, OPEN, LOCKED, INACTIVE
}

enum TypeEnum {
  NULL, BUYING, SELLING
}


