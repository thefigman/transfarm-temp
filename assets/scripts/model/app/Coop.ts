import { AppUser } from "./AppUser";

interface Coop {
  title: string
  details: string
  // id of the user who created the coop
  creator: string
  admins?: string[]
  farmers: string[]
}
//generate

export {
  Coop
}