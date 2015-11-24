var
GET =                   'SELECT * FROM `domain` WHERE `id`=? AND `status`=1;',
GET_LIST =              'SELECT * FROM `domain` WHERE `id` IN (?) AND `status`=1;',
FIND_BY_TIME =          'SELECT * FROM `domain` WHERE `updatedAt` > ?;',
FIND_BY_TIMES =         'SELECT * FROM `domain` WHERE `updatedAt` > ? AND `updatedAt` < ?;',
FIND_BY_NAME =          'SELECT * FROM `domain` WHERE `name` = ? AND status=1;',
SET =                   'INSERT INTO `domain` (`name`, `createdBy`) VALUES ? ON DUPLICATE KEY UPDATE `sess`=VALUES(`sess`), status=1;',
TOUCH =                 'UPDATE `domain` SET `updatedBy`=?, `updatedAt`=NOW() WHERE `id`=? AND `status`=1;',
UNSET =                 'UPDATE `domain` SET `status`=0, `updatedBy`=? WHERE `id`=?;',

MAP_GET =               'SELECT `domainId`, `k`, `v` FROM ?? WHERE `domainId`=?;',
MAP_GET_BY_KEY =        'SELECT `domainId`, `k`, `v` FROM ?? WHERE `domainId`=? AND `k`=?;',
MAP_GET_BY_KEYS =       'SELECT `domainId`, `k`, `v` FROM ?? WHERE `domainId`=? AND `k` IN (?);',
MAP_GET_MAT_BY_KEY =    'SELECT `domainId`, `k`, `v` FROM ?? WHERE `domainId` IN (?) AND `k`=?;',
MAP_GET_MAT_BY_KEYS =   'SELECT `domainId`, `k`, `v` FROM ?? WHERE `domainId` IN (?);',
MAP_FIND_BY_TIME =      'SELECT `domainId`, `k`, `v` FROM ?? WHERE `domainId`=? AND `updatedAt` > ?;',
MAP_SET =               'INSERT INTO ?? (`domainId`, `k`, `v`, `createdBy`) VALUES ? ON DUPLICATE KEY UPDATE `v`=VALUES(`v`), `updatedBy`=VALUES(`createdBy`);',
MAP_UNSET =             'UPDATE ?? SET `status`=0, `updatedBy`=? WHERE `id`=?;',

REF1_GET=               'SELECT `domainId`, `ref1Id`, `k`, `v` FROM `domainRef1` WHERE `domainId`=? AND `ref1Id`=? AND `k`=? AND `status`=1;',
REF1_GET_REF1S =        'SELECT `domainId`, `ref1Id`, `k`, `v` FROM `domainRef1` WHERE `domainId`=? AND `k`=? AND `status`=1;',
REF1_GET_ALL =          'SELECT `domainId`, `ref1Id`, `k`, `v` FROM `domainRef1` WHERE `domainId`=? AND `status`=1;',
REF1_GET_BY_REF =       'SELECT `domainId`, `ref1Id`, `k`, `v` FROM `domainRef1` WHERE `ref1Id`=? AND `k`=? AND `status`=1;',
REF1_FIND_BY_TIME =     'SELECT `domainId`, `ref1Id`, `k`, `v` FROM `domainRef1` WHERE `domainId`=? AND `updatedAt` > ? AND `status`=1;',
REF1_SET =              'INSERT INTO `domainRef1` (`domainId`, `ref1Id`, `k`, `v`, `createdBy`) VALUES ? ON DUPLICATE KEY UPDATE `v`=VALUES(`v`),`updatedBy`=VALUES(`createdBy`),`status`=1;',
REF1_TOUCH =            'UPDATE `domainRef1` SET `updatedBy`=? WHERE `domainId`=? AND `ref1Id`=? AND `k`=? AND `status`=1;',
REF1_UPDATE=            'UPDATE `domainRef1` SET `v`=?,`updatedBy`=? WHERE `domainId`=? AND `ref1Id`=? AND `k`=? AND `status`=1;',
REF1_UNSET =            'UPDATE `domainRef1` SET `status`=0, `updatedBy`=? WHERE `domainId`=? AND `ref1Id`=? AND `k`=?;',
REF1_UNSETS =           'UPDATE `domainRef1` SET `status`=0, `updatedBy`=? WHERE `domainId`=? AND `ref1Id`=?;',
REF1_UNSETSS =          'UPDATE `domainRef1` SET `status`=0, `updatedBy`=? WHERE `domainId` IN (?);',
REF1_UNSET_BY_REF1 =    'UPDATE `domainRef1` SET `status`=0, `updatedBy`=? WHERE `ref1Id` IN (?);'

var
sc =require('pico/obj'),
hash=require('sql/hash'),
client

module.exports= {
    setup: function(context, cb){
        client = context.mainDB
        cb()
    }
}
