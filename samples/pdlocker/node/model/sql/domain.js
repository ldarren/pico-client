var
GET =                   'SELECT * FROM `domain` WHERE `id`=? AND `status`=1;',
GET_LIST =              'SELECT * FROM `domain` WHERE `id` IN (?) AND `status`=1;',
FIND_BY_TIME =          'SELECT * FROM `domain` WHERE `updatedAt` > ?;',
FIND_BY_TIMES =         'SELECT * FROM `domain` WHERE `updatedAt` > ? AND `updatedAt` < ?;',
FIND_BY_NAME =          'SELECT * FROM `domain` WHERE `name` = ? AND status=1;',
CREATE =                'INSERT INTO `domain` (`name`, `createdBy`) VALUES ? ON DUPLICATE KEY UPDATE `sess`=VALUES(`sess`), status=1;',
TOUCH =                 'UPDATE `domain` SET `updatedBy`=?, `updatedAt`=NOW() WHERE `id`=? AND `status`=1;',
REMOVE =                'UPDATE `domain` SET `status`=0, `updatedBy`=? WHERE `id`=?;',

MAP_GET =               'SELECT `domainId`, `k`, `v` FROM ?? WHERE `domainId`=?;',
MAP_GET_BY_KEY =        'SELECT `domainId`, `k`, `v` FROM ?? WHERE `domainId`=? AND `k`=?;',
MAP_GET_BY_KEYS =       'SELECT `domainId`, `k`, `v` FROM ?? WHERE `domainId`=? AND `k` IN (?);',
MAP_GET_MAT_BY_KEY =    'SELECT `domainId`, `k`, `v` FROM ?? WHERE `domainId` IN (?) AND `k`=?;',
MAP_GET_MAT_BY_KEYS =   'SELECT `domainId`, `k`, `v` FROM ?? WHERE `domainId` IN (?);',
MAP_FIND_BY_TIME =      'SELECT `domainId`, `k`, `v` FROM ?? WHERE `domainId`=? AND `updatedAt` > ?;',
MAP_SET =               'INSERT INTO ?? (`domainId`, `k`, `v`, `createdBy`) VALUES ? ON DUPLICATE KEY UPDATE `v`=VALUES(`v`), `updatedBy`=VALUES(`createdBy`);',
MAP_REMOVE =            'UPDATE ?? SET `status`=0, `updatedBy`=? WHERE `id`=?;',

USER_GET=               'SELECT `domainId`, `userId`, `k`, `v` FROM `domainUser` WHERE `domainId`=? AND `userId`=? AND `k`=? AND `status`=1;',
USER_GET_USERS =        'SELECT `domainId`, `userId`, `k`, `v` FROM `domainUser` WHERE `domainId`=? AND `k`=? AND `status`=1;',
USER_GET_ALL =          'SELECT `domainId`, `userId`, `k`, `v` FROM `domainUser` WHERE `domainId`=? AND `status`=1;',
USER_GET_BY_REF =       'SELECT `domainId`, `userId`, `k`, `v` FROM `domainUser` WHERE `userId`=? AND `k`=? AND `status`=1;',
USER_FIND_BY_TIME =     'SELECT `domainId`, `userId`, `k`, `v` FROM `domainUser` WHERE `domainId`=? AND `updatedAt` > ? AND `status`=1;',
USER_CREATE =           'INSERT INTO `domainUser` (`domainId`, `userId`, `k`, `v`, `createdBy`) VALUES ? ON DUPLICATE KEY UPDATE `v`=VALUES(`v`),`updatedBy`=VALUES(`createdBy`),`status`=1;',
USER_TOUCH =            'UPDATE `domainUser` SET `updatedBy`=? WHERE `domainId`=? AND `userId`=? AND `k`=? AND `status`=1;',
USER_UPDATE=            'UPDATE `domainUser` SET `v`=?,`updatedBy`=? WHERE `domainId`=? AND `userId`=? AND `k`=? AND `status`=1;',
USER_REMOVE =           'UPDATE `domainUser` SET `status`=0, `updatedBy`=? WHERE `domainId`=? AND `userId`=? AND `k`=?;',
USER_REMOVE_BY_USER =   'UPDATE `domainUser` SET `status`=0, `updatedBy`=? WHERE `domainId` IN (?);',
USER_REMOVE_BY_USER =   'UPDATE `domainUser` SET `status`=0, `updatedBy`=? WHERE `userId` IN (?);'

var
sc =require('pico/obj'),
hash=require('sql/hash')

module.exports= {
    setup: function(client, hash, cb){
        this.client = client 
        this.hash = hash
        cb()
    }
}
