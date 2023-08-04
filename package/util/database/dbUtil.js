const logger = require('easy-logger-2')

function DBUtil() {}

DBUtil.prototype.executeBulkHomogeneousMongoQuery = async function(Model, docs, operation = 'insertOne') {
  let bulkOpsArr = [];

  async function _execute(Model, ops) {
    logger.debug(`[DB.Util-Mongo:${Model.modelName}] Writing to DB nRecords=${ops.length}`);

    await Model.bulkWrite(ops);

    logger.debug(`[DB.Util-Mongo:${Model.modelName}] Written to DB nRecords=${ops.length}`);

    return [];
  }

  const batches = [];
  let preparedRecords = 0;
  await Promise.all(docs.map(async (doc) => {
    if (preparedRecords === parseInt(process.env.BULKMONGO_POOLSIZE || 1000)) {
      logger.debug(`[DB.Util-Mongo:${Model.modelName}] Batch pool reached, creating batch of nRecords=${preparedRecords}`);

      bulkOpsArr.length > 0 && batches.push(bulkOpsArr);

      preparedRecords = 0;
      bulkOpsArr = [];
    }

    if ('insertOne' === operation) {
      bulkOpsArr.push({ [operation]: { document: doc } });
    } else if ('updateOne' === operation) {
      bulkOpsArr.push({ [operation]: { filter: doc.filter, update: doc.update } });
    }

    preparedRecords = preparedRecords + 1;
  }));

  logger.debug(`[DB.Util-Mongo:${Model.modelName}] Creating batch of remaining nRecords=${preparedRecords}`);

  bulkOpsArr.length > 0 && batches.push(bulkOpsArr);

  logger.debug(`[DB.Util-Mongo:${Model.modelName}] Executing batches --n-batch-${batches.length}`);

  await Promise.all(batches.map(batch => _execute(Model, batch)));

  logger.debug(`[DB.Util-Mongo:${Model.modelName}] Job Completed`);

  return true;
}

module.exports = new DBUtil();