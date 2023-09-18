const {
    MongoClient,
    ObjectId
} = require('mongodb');
console.log(process.env.mongodb_host) // remove this af
//
auth = process.env.mongodb_user ? `${process.env.mongodb_user}:${process.env.mongodb_pass}@` : "";

// ایجاد اتصال جدید
const url = 'mongodb://' + auth + process.env.mongodb_host + ':' + process.env.mongodb_port + '/';
const client = new MongoClient(url);

// تعریف پول اتصال‌ها
const connectionPool = [];

// تابع برای دریافت یک اتصال از پول
async function getConnectionFromPool() {
    if (connectionPool.length > 0) {
        return connectionPool.pop();
    } else {
        const connection = await client.connect();
        return connection;
    }
}

// تابع برای بازگرداندن یک اتصال به پول
function returnConnectionToPool(connection) {
    connectionPool.push(connection);
}

// تابع اصلی برای اجرای کوئری‌ها
async function executeQuery(dbname, collectionname, querydata, callback) {
    let connection;
    try {
        // دریافت یک اتصال از پول
        connection = await getConnectionFromPool();
        console.log('Connected successfully to server');

        const db = connection.db(dbname);
        const collection = db.collection(collectionname);

        // اجرای کوئری و فراخوانی callback
        const queryResult = await querydata(collection);
        callback(queryResult);
    } catch (error) {
        console.error(error);
    } finally {
        // بازگرداندن اتصال به پول
        if (connection) {
            returnConnectionToPool(connection);
        }
        console.log('Connection to database returned to pool');
    }
}

// درج یک رکورد
async function insertOneData(dbname, collectionname, data, callback) {
    return await new Promise((resolve, reject) => {
        executeQuery(dbname, collectionname, async (collection) => {
            const insertResult = await collection.insertOne(data);
            resolve(insertResult);
        }, () => { })
    });
}

// درج چند رکورد
async function insertManyData(dbname, collectionname, data, callback) {
    return await new Promise((resolve, reject) => {
        executeQuery(dbname, collectionname, async (collection) => {
            const insertResult = await collection.insertMany(data);
            resolve(insertResult);
        }, () => { })
    });
}

// جستجوی رکوردها
async function findData(dbname, collectionname, querydata) {
    return await new Promise((resolve, reject) => {
        executeQuery(dbname, collectionname, async (collection) => {
            const findResult = await collection.find(querydata).toArray();
            resolve(findResult);
        }, () => { })
    });
}

// حذف یک رکورد
async function deleteOneData(dbname, collectionname, querydata) {
    return await new Promise((resolve, reject) => {
        executeQuery(dbname, collectionname, async (collection) => {
            const deleteResult = await collection.deleteOne(querydata);
            resolve(deleteResult);
        }, () => { })
    })
}

// حذف چند رکورد
async function deleteManyData(dbname, collectionname, querydata) {
    return await new Promise((resolve, reject) => {
        executeQuery(dbname, collectionname, async (collection) => {
            const deleteResult = await collection.deleteMany(querydata);
            resolve(deleteResult);
        }, () => { })
    });
}


async function updateData(dbname, collectionname, querydata, updatedata) {
    return await new Promise((resolve, reject) => {
        executeQuery(dbname, collectionname, async (collection) => {
            const updateResult = await collection.updateOne(querydata, {
                $set: updatedata
            },);
            resolve(updateResult);
        }, () => { })
    });
}

async function pushData(dbname, collectionname, querydata, updatedata) {
    return await new Promise((resolve, reject) => {
        executeQuery(dbname, collectionname, async (collection) => {
            const updateResult = await collection.updateOne(querydata, {
                $push: updatedata
            },);
            resolve(updateResult);
        }, () => { })
    });
}
// تعداد رکوردها
async function countData(dbname, collectionname, querydata) {
    return await new Promise((resolve, reject) => {
        executeQuery(dbname, collectionname, async (collection) => {
            const count = await collection.countDocuments(querydata);
            resolve(count);
        }, () => { })
    });
}



module.exports = {
    insertOneData,
    insertManyData,
    findData,
    deleteOneData,
    deleteManyData,
    updateData,
    pushData,
    countData,
    ObjectId

};