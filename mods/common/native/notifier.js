var
ERR_NOT_FOUND = 'local notification plugin is not available',
ERR_PARAMS = 'invalid local notification schedule params',
currId = Math.ceil(Math.random()*999),
setup = function(self, ln){
    self.localNotifier = ln
    // click or trigger on notification
    ln.on('trigger', trigger, self)
    ln.on('click', click, self)
},
scheduler = function(self, ln, notis, sender){
    if (!notis || !notis.length) return
    var n = notis.shift()
    if (!n || !n.text) return scheduler(self, ln, notis, sender)
    n.id = currId++
    n.title = n.title || self.deps.title
    ln.schedule(n, function(){ self.signals.notifier_scheduled(this).send(sender) },n.id)
    scheduler(self, ln, notis, sender)
},
trigger = function(noti){ this.signals.notifier_trigger(noti).send(this.host) },
click = function(noti){ this.signals.notifier_click(noti).send(this.host) }

return {
    signals: [
        'notifier_trigger',
        'notifier_triggered',
        'notifier_click',
        'notifier_scheduled',
        'notifier_updated',
        'notifier_cancelled',
        'notifier_cleared'
    ],
    deps: {
        title:'text'
    },
    create: function(deps){
        var
        self = this,
        ln= __.refChain(window, ['cordova', 'plugins', 'notification', 'local'])

        if (!ln) {
            this.slots = {}
            return console.warn(ERR_NOT_FOUND)
        }

        ln.hasPermission(function(ok){
            if (ok) return setup(self, n, ln)
            ln.registerPermission(function(ok){
                if (ok) return setup(self, n, ln)
            })
        })
    },
    slots: {
        // desc of options see https://github.com/katzer/cordova-plugin-local-notifications/wiki/04.-Scheduling
        notifier_schedule: function(from, sender, notis){
            if (!notis || !notis.length) return console.error(ERR_PARAMS)
            scheduler(this, this.localNotifier, notis, sender)
        },
        notifier_update: function(from, sender, id, changes){
            if (!id) return console.error(ERR_PARAMS)
            changes.id = id
            this.localNotifier.update(changes, function(){ this.signals.notifier_updated(id).send(sender) }, this)
        },
        notifier_clear: function(from, sender, ids){
            if (undefined === ids || null === ids) return console.error(ERR_PARAMS)
            var ln = this.localNotifier
            if (0 === ids) return ln.clearAll(function(){ this.signals.notifier_cleared(ids).send(sender) }, this)
            ln.clear(ids, function(){ this.signals.notifier_cleared(ids).send(sender) }, this)
        },
        notifier_cancel: function(from, sender, ids){
            if (undefined === ids || null === ids) return console.error(ERR_PARAMS)
            var ln = this.localNotifier
            if (0 === ids) return ln.cancelAll(function(){ this.signals.notifier_cancelled(ids).send(sender) }, this)
            ln.cancel(ids, function(){ this.signals.notifier_cancelled(ids).send(sender) }, this)
        },
        notifier_triggered: function(from, sender){
            this.localNotifier.getTriggered(function(notis){
                this.signals.notifier_triggered(notis).send(sender)
            }, this)
        }
    }
}
