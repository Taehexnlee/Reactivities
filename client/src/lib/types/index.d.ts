
export type PagedList<T, TCursor> = {
  items: T[],
  nextCursor : TCursor
}
export type Activity = {
    id: string
    title: string
    date: string
    description: string
    category: string
    isCancelled: boolean
    city: string
    venue: string
    latitude: number
    longitude: number
    attendees: Profile[]
    isGoing: boolean
    isHost: boolean
    hostId: string
    hostDisplayName: string
    hostImageUrl? : string
}
export type Profile = {

  id: string
  displayName: string
  bio? : string
  imageUrl?: string
  followersCount? : number
  followingCount? : number
  following?: boolean
}

export type Photo ={
  id: string
  url: string
  
}
export type UserActivity = {
  id: string
  title: string
  category: string
  date: string
}
export type CreateActivityRequest = {
  title: string
  description: string
  category: string
  date: string
  city: string
  venue: string
  latitude: number
  longitude: number
}
export type EditActivityRequest = CreateActivityRequest & { id: string }
export type LocationIQSuggestion = {
  place_id: string
  osm_id: string
  osm_type: string
  licence: string
  lat: string
  lon: string
  boundingbox: string[]
  class: string
  type: string
  display_name: string
  display_place: string
  display_address: string
  address: LocationIQAddress
}

export type ChatCommnet = {
  id: string
  createdAt : Date 
  body : string
  userId : string
  displayName : string
  imageUrl? : string
}

export type User  ={
  id:string,
  email: string, 
  displayName: string,
  imageUrl?: string 
}

export type LocationIQAddress = {
  name: string
  road?: string
  neighbourhood?: string
  suburb?: string
  town?: string
  village?:string
  city?: string
  county: string
  state: string
  postcode?: string
  country: string
  country_code: string
}

declare global {
  // Allow usage without explicit imports while still supporting module imports.
  type PagedList<T, TCursor> = import("./index").PagedList<T, TCursor>;
  type Activity = import("./index").Activity;
  type Profile = import("./index").Profile;
  type Photo = import("./index").Photo;
  type UserActivity = import("./index").UserActivity;
  type LocationIQSuggestion = import("./index").LocationIQSuggestion;
  type ChatCommnet = import("./index").ChatCommnet;
  type User = import("./index").User;
  type LocationIQAddress = import("./index").LocationIQAddress;
  type CreateActivityRequest = import("./index").CreateActivityRequest;
  type EditActivityRequest = import("./index").EditActivityRequest;
}

export {};
