define(function(require, exports, module){
	'use strict'
	var
	Module = require('js/Module'),
	Router = require('js/Router'),
	tpl = require('text!html/formAuth.html')

	return Module.extend({
		tagName: 'form',
        id: 'login',
		initialize: function(options){
			var self = this

			this.$el.html(_.template(tpl))

			this.init(options, function(err, spec){
				for(var i=0,s; s=spec[i]; i++){
					switch(s.name){
					case 'owner':
						self.owner = s.value
						break
					}
				}

				self.triggerHost('invalidate')
			})
		},

		events: {
			'tap button[name=login]': 'login'
		},

		login: function(e){
			var data = {
				username: this.$('input[name=username]').val().trim(),
				password: this.$('input[name=password]').val(),
				domain: this.owner.domain
			}
			this.owner.create(data, {
				data: data,
				wait: true
			})
		}
	})
})
