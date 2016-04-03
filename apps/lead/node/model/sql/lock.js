var
GET =                   'SELECT * FROM `lock` WHERE `id`=? AND `status`=1;',
GET_LIST =              'SELECT * FROM `lock` WHERE `id` IN (?) AND `status`=1;',
FIND_BY_TIME =          'SELECT * FROM `lock` WHERE `updatedAt` > ?;',
FIND_BY_TIMES =         'SELECT * FROM `lock` WHERE `updatedAt` > ? AND `updatedAt` < ?;',
CREATE =                'INSERT INTO `lock` (`createdBy`) VALUES ?;',
TOUCH =                 'UPDATE `lock` SET `updatedBy`=?, `updatedAt`=NOW() WHERE `id`=? AND `status`=1;',
REMOVE =                'UPDATE `lock` SET `status`=0, `updatedBy`=? WHERE `id`=?;'

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
