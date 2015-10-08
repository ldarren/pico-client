var
GET =                   'SELECT * FROM `lock` WHERE `id`=? AND `status`=1;',
GET_LIST =              'SELECT * FROM `lock` WHERE `id` IN (?) AND `status`=1;',
FIND_BY_TIME =          'SELECT * FROM `lock` WHERE `updatedAt` > ?;',
FIND_BY_TIMES =         'SELECT * FROM `lock` WHERE `updatedAt` > ? AND `updatedAt` < ?;',
CREATE =                'INSERT INTO `lock` (`createdBy`) VALUES ?;',
TOUCH =                 'UPDATE `lock` SET `updatedBy`=?, `updatedAt`=NOW() WHERE `id`=? AND `status`=1;',
REMOVE =                'UPDATE `lock` SET `status`=0, `updatedBy`=? WHERE `id`=?;',

MAP_GET =               'SELECT `lockId`, `k`, `v` FROM ?? WHERE `lockId`=?;',
MAP_GET_BY_KEY =        'SELECT `lockId`, `k`, `v` FROM ?? WHERE `lockId`=? AND `k`=?;',
MAP_GET_BY_KEYS =       'SELECT `lockId`, `k`, `v` FROM ?? WHERE `lockId`=? AND `k` IN (?);',
MAP_GET_MAT_BY_KEY =    'SELECT `lockId`, `k`, `v` FROM ?? WHERE `lockId` IN (?) AND `k`=?;',
MAP_GET_MAT_BY_KEYS =   'SELECT `lockId`, `k`, `v` FROM ?? WHERE `lockId` IN (?);',
MAP_FIND_BY_TIME =      'SELECT `lockId`, `k`, `v` FROM ?? WHERE `lockId`=? AND `updatedAt` > ?;',
MAP_SET =               'INSERT INTO ?? (`lockId`, `k`, `v`, `createdBy`) VALUES ? ON DUPLICATE KEY UPDATE `v`=VALUES(`v`), `updatedBy`=VALUES(`createdBy`);',
MAP_REMOVE =            'UPDATE ?? SET `status`=0, `updatedBy`=? WHERE `id`=?;'

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
