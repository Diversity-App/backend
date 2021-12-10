import { Pool } from 'pg';
import * as mongoDB from 'mongodb';
import { MongoClient, ObjectID } from 'mongodb';

export default new Pool({
    host: process.env.POSTGRES_HOST || 'localhost',
    user: process.env.POSTGRES_USER || 'postgres',
    password: process.env.POSTGRES_PASSWORD || 'postgres',
    database: process.env.POSTGRES_DB || 'postgres',
    port: Number(process.env.POSTGRES_PORT) || 5432,
    //connectionString: process.env.DATABASE_URL,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
    idle_in_transaction_session_timeout: 30000,
});

export const collections: { clients?: mongoDB.Collection } = {};

export class MongoDB {
    public static client: any;
    public static connect() {
        MongoDB.client = new MongoClient(process.env.DB_CONN_STRING, {});
        MongoDB.client.connect();
    }

    public static async getCollection(collection: string) {
        if (!MongoDB.client) await MongoDB.connect();
        return MongoDB.client.db().collection(collection);
    }

    public static async setCollection(collection: string) {
        MongoDB.client.db().createCollection(collection, function (err: any) {
            if (!err) console.log('Collection created!');
            else console.log('Collection already created or empty');
        });
    }
    public static async getByContent(collection: string) {
        if (!MongoDB.client) await MongoDB.connect();
        return MongoDB.client.db().collection(collection).findOne({ _column: ObjectID });
    }
}

/* const url = 'mongodb://localhost:27017';

MongoClient.connect(url, { useNewUrlParser: true }, (err: any, client: { db: (arg0: string) => any; close: () => void; }) => {

    if (err) throw err;

    const db = client.db('test');

    let doc = {_id: new ObjectID(), name: 'lol', price: 36600 };

    db.collection('toto').insertOne(doc).then((doc: any) => {

        console.log('Car inserted')
        console.log(doc);
    }).catch((err: any) => {

        console.log(err);
    }).finally(() => {

        client.close();
    });
}); */
