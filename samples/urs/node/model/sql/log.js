var
GET =                   'SELECT * FROM `log` WHERE `id`=? AND `status`=1;',
GET_LIST =              'SELECT * FROM `log` WHERE `id` IN (?) AND `status`=1;',
FIND_BY_TIME =          'SELECT * FROM `log` WHERE `updatedAt` > ?;',
FIND_BY_TIMES =         'SELECT * FROM `log` WHERE `updatedAt` > ? AND `updatedAt` < ?;',
CREATE =                'INSERT INTO `log` (`userId`,`lockId`,`passcode`,`createdBy`) VALUES ?;',
TOUCH =                 'UPDATE `log` SET `updatedBy`=?, `updatedAt`=NOW() WHERE `id`=? AND `status`=1;',
REMOVE =                'UPDATE `log` SET `status`=0, `updatedBy`=? WHERE `id`=?;'

var
sc = require('pico/obj'),
hash=require('sql/hash')

module.exports= {
    setup: function(client, hash, cb){
        this.client = client 
        this.hash = hash
        cb()
    }
}
