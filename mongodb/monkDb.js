const monk = require('monk')

const config = require('config-lite')(__dirname)

const db = monk(config.monkUrl + '/' + config.monkDb)

module.defaults =  {
    //查询全部
    findAll: async (colName) => {
        try {
            return await db.get(colName).find()
        }catch (err) {
            console.log(err)
        }
    },
    //只获取指定id的文档
    findOne:async (colName,query = {}) => {
        try {
            return await db.get(colName).find(query)
        }catch (err) {
            console.log(err)
        }
    },
    find:async (colName,query = {},limit = null,skip = null) => {
        try {
            return await db.get(colName).find(
                query,
                {
                    limit:limit,
                    skip:skip,
                    sort:{"_id": -1}
                }
            )
        }catch (err) {
            console.log(err)
        }
    },
    count:async (colName,query={}) => {
        try {
            return await db.get(colName).count(query)
        }  catch (err) {
            console.log(err)
        }
    },
    insert: async (colName, payload) => {
        if (!payload) return;
        let errs = 0
        try {
            await db.get(colName).insert(payload, {ordered: false})
        } catch (e) {
            errs += e.writeErrors ? e.writeErrors.length : 1
        }
        return errs
    },
    update: async (colName, query = {}, payload, upsert) => {
        if (!payload) return;

        let update = {}
        let $set = {}
        let $addToSet = {}
        let $setOnInsert = {
            createdAt: Date.now()
        }

        Object.keys(payload).forEach(key => {
            payload[key] instanceof Set
                ? $addToSet[key] = {$each: [...payload[key]]}
                : $set[key] = payload[key]
        })

        if (Object.keys($set).length) {
            update.$set = $set
        }

        if (Object.keys($addToSet).length) {
            update.$addToSet = $addToSet
        }

        update.$setOnInsert = $setOnInsert

        try {
            return await db.get(colName).update(query, update, {upsert: upsert || false})
        } catch (err) {
            console.error(err)
        }
    },
    createIndex: async (colName, spec, options) => {
        try {
            let res = await db.get(colName).createIndex(spec, options)
            console.log("createIndex: " + res)
        } catch (err) {
            console.error(err)
        }
    },
    distinct: async (colName, key, query = {}) => {
        try {
            return await db.get(colName).distinct(key, query)
        } catch (err) {
            console.error(err)
        }
    },
}

