var
GET =                   'SELECT * FROM `case` WHERE `id`=? AND `status`=1;',
GET_LIST =              'SELECT * FROM `case` WHERE `id` IN (?) AND `status`=1;',
FIND_BY_TIME =          'SELECT * FROM `case` WHERE `updatedAt` > ?;',
FIND_BY_TIMES =         'SELECT * FROM `case` WHERE `updatedAt` > ? AND `updatedAt` < ?;',
CREATE =                'INSERT INTO `case` (`createdBy`) VALUES ?;',
TOUCH =                 'UPDATE `case` SET `updatedBy`=?, `updatedAt`=NOW() WHERE `id`=? AND `status`=1;',
REMOVE =                'UPDATE `case` SET `status`=0, `updatedBy`=? WHERE `id`=?;',

LIST_GET =              'SELECT * FROM `caseList` WHERE `caseId`=? AND `status`=1 ORDER BY createdAt ASC;',
LIST_GET_LIST =         'SELECT * FROM `caseList` WHERE `caseId` IN (?) AND `status`=1 ORDER BY createdAt ASC;',
LIST_FIND_BY_TIME =     'SELECT * FROM `caseList` WHERE `updatedAt` > ?;',
LIST_FIND_BY_TIMES =    'SELECT * FROM `caseList` WHERE `updatedAt` > ? AND `updatedAt` < ?;',
LIST_CREATE =           'INSERT INTO `caseList` (`k`,`v`,`createdBy`) VALUES ?;',
LIST_REMOVE =           'UPDATE `caseList` SET `status`=0, `updatedBy`=? WHERE `caseId`=?;'

var
sc =require('pico/obj'),
hash=require('sql/hash'),
client

module.exports= {
    setup: function(context, cb){
        client = context.client 
        cb()
    }
}
