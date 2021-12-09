import { ObjectId } from "mongodb";

export default class Data {
    constructor(public Tag: string, public TagOccurence: number, public id?: ObjectId) {}
}