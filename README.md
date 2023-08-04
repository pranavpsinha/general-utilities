# General Utilities

Get all the utility functions at one place, I've got your back, you can just jump on to write code.

## Installation

You can install the General Utilities package from npm using the following command:

```shell
npm install general-utilities
```

## Summary
There are many utility functions embedded across features into this one single package viz.
```shell
1. Cryptography
  - encrypt, decrypt, hash, hashCompare
2. Database - Mongo
  - execute bulk query { update, insert }
3. Date-Time
  - many datetime utility functions to cater your daily needs
4. URL
  - base64 encoding, decoding
5. String
  - split-text-by-line-length, split-words-by-line-length, etc.
6. Profiler
  - to understand cpu usage against your code
```

# Usage Guidelines
## Cryptography
### Default ENV Configurations
```shell
## CRYPTOGRAPHY
DATA_ENCRYPTION_ALGORITHM = some-algorithm-like:aes-256-cbc
DATA_ENCRYPTION_KEY       = some-encryption-key-like:h3ll0
DATA_ENCRYPTION_IV_32     = some-iv-32-chars:3q9423co5upaqwer3q9423co5upaqwer
# HASHING
HASH_PEPPER      = some-pepper-like:3q9423co5up
HASH_SALT_ROUNDS = 10
HASH_ENTROPY     = 5
```
### Usage Example
```shell
const { crypto }  = require('general-utilities');

# encryption-decryption
const encText = crypto.encrypt('some-text');
const decText = crypto.decrypt(encText);
# note that for fields representing user-id, you may want to use a static iv so that your login process remains easy
# pass second argument as true to use static-iv
const encText = crypto.encrypt('mobile/email/userid', true);

# hashing
const pwdHash = crypto.hash('check-me');
const isMatching = crypto.hashCompare('check-me', pwdHash); // returns boolean
```

## Database - { Mongo }
### Default ENV Configurations
```shell
# n-records to be written in bulk, code will accumulate upto this number and then execute the query
BULKMONGO_POOLSIZE = 1000
```
### Usage Example
```shell
const { database } = require('general-utilities');

# MyModel represents ORM of a mongo model
# data[] is the data to be inserted/udpated
# action can be 'updateOne' or 'insertOne'
database.executeBulkHomogeneousMongoQuery(MyModel, data, action); // returns promise

###
# for updateOne, use below syntax
#   assume an array 'items' containing objects like { id: 'MYID-123', count: 0 }
#   objective is to update the count belonging to the id by 1
const data = items.map(p => ({ filter: { _id: p.id }, update: { $inc: { count: 1 } }}))
# above code will parse data in the expected format and can be then passed to 'executeBulkHomogeneousMongoQuery'
###

###
# for insertOne, use below syntax, 3rd argument can be left blank as default action is 'insertOne'
#   insertOne is rather simpler than updateOne because you can simply pass the json as is
#   say, we want to insert below data
const data = [{ _id: 'unique-id-1', count: 0 }, { _id: 'unique-id-2', count: 9 }]
executeBulkHomogeneousMongoQuery(MyModel, data);
###
```

## Date-Time
### Default ENV Configurations
```shell
-NA-
```
### Usage Example
```shell
const { datetime } = require('general-utilities');

# default date format = 'YYYY-MM-DD HH:mm:ss'
# all keywords momentjs compliant

const format = 'YYYY-MM-DD HH:mm:ss';
const now = datetime.now(); // returns moment obj
# if format is not passed, default date-format is taken
const someDate1 = datetime.getDateObj('2023-04-01', format); // returns moment obj
const someDate2 = datetime.formatDate(someDate1, format); // returns string

## similarly, other functions can be used

# say adding 2 days to date
const futureDate = datetime.addDaysToDate(now, 2, format);
const futureHour = datetime.addHoursToDate(now, 1, format);

# below function gives a slight ahead time, usually to be used for TTL purposes
const futureSec = datetime.addDeltaToMoment(600, now, 'seconds');
# can also be used as below, defaults: (delta=600seconds, time=current-datetime, definition='seconds')
const futureSec = datetime.addDeltaToMoment(); // will give a time 5 minutes in future
const futureSec = datetime.addDeltaToMoment(60); // will give a time 1 minute in future

# calculating difference between dates in days,hours,minutes,seconds --default days
const dateDiff = datetime.dateDifferenceBetween(now, futureDate, 'days'); // should return 2
```

## URL
### Default ENV Configurations
```shell
-NA-
```
### Usage Example
```shell
const { url } = require('general-utilities');

const base64Encoded = url.encodeURI('hello'); // equivalent to btoa() of javascript
const base64Decoded = url.decodeURI(base64Encoded); // equivalent to atob() of javascript
```

## String
### Default ENV Configurations
```shell
-NA-
```
### Usage Example
```shell
const { string } = require('general-utilities');

const lines1 = string.splitTextInLinesByLength('hello', '2'); // returns ['he', 'll', 'o']
const lines2 = string.splitWordsInLinesByMaxLineLength('a quick brown fox', 5); // returns ['a', 'quick', 'brown', 'fox']

# below function is helpful when you work in a json format and need to somehow read non-json data like xml for a puny purpose like checking response status if its success or not, using below, you can capture a value between tags e.g. <status>success</status>, string.getStringBetweenStrings(basetext, '<status>', '</status>') will return 'success'
const substring = string.getStringBetweenStrings('a quick brown fox', 'quick', 'fox'); // returns ' brown '
```

## Profiler
### Default ENV Configurations
```shell
# change to Y to make it active
PROFILER_ACTIVE = N
# give path to record cpu-analysis files 
PROFILER_OUTPUT_DIR = cpuprofile
```
### Usage Example
```shell
const { profiler } = require('general-utilities');

# call start and end functions between the code block which you wish to analyse
profiler.start('Some identifier say: MyFunction');
// your code in between
profiler.finish('Some identifier say: MyFunction');

# this will generate files that can be anlaysed either by some tool on in browser [by importing cpu files]
```

### Note
This package will help you manage your day-to-date tasks easily without having to create your own commons library separately. Let me know if you need more utility functions.