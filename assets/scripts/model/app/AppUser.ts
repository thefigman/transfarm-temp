export interface AppUser {
  name: string
  email: string
  phone: string
  userLocation: UserLocation
  accountType: AccountType
}
// generate

export interface UserLocation {
  address: string
  lat: number
  lng: number
}
//generate

export enum AccountType {
  FARMER,
  MANUFACTURER
}