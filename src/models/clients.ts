import { ObjectId } from "mongodb";

//Tag, Occurence TAG, VideoId etc..
export default class Data {
    constructor(public Tag: string, public TagOccurence: number, public id?: ObjectId) {}
}