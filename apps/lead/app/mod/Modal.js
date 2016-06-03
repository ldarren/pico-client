var
picoObj=require('pico/obj'),
showPage=function(self,curr,pages){
    self.signals.pageCreate(curr,pages.length,pages[curr],function(title,form){
        var
        leftBtn=curr?{icon:'icon_prev'}:{icon:'icon_ko'},
        rightBtn=pages[curr+1]?{icon:'icon_next'}:{icon:'icon_ok'}

        self.signals.header(title,leftBtn,rightBtn).send(self.header)
        self.signals.formShow(form).send(self.form)
    }).send(self.sender)
},
closePage=function(self,curr,pages,verify,cb){
    self.signals.formCollect(verify,function(err,data){
        if(err) return cb(err)
        picoObj.extend(self.data,data)
        self.signals.pageResult(self.data,cb).send(self.sender)
    }).send(self.form)
}

return {
    className: 'modal',
    deps:{
		Header:'view',
		Form:'view'
	},
    signals:['show','hide','formShow','formCollect','pageCreate','pageResult','modalResult','header'],
    create: function(deps){
		this.header=this.spawn(deps.Header)
		this.form=this.spawn(deps.Form)
		this.sender=null
		this.pages=null
		this.currentPage=0
		this.data=null
    },

    slots:{
        modalShow:function(from, sender, pages){
			this.sender=sender
			this.pages=pages
			this.currentPage=0
		    this.data={}
            this.signals.show(1).send(this.host)
            showPage(this,this.currentPage,pages)
        },
        modalHide:function(from, sender){
			this.sender=null
            this.signals.hide().send(this.host)
		},
		headerButtonClicked:function(from, sender, hash){
            var self=this
			switch(hash){
			case 'ok':
                closePage(self,self.currentPage,self.pages,true,function(err){
                    if (err) return console.error(err)
					self.signals.modalResult(self.data).send(self.sender)
					self.signals.hide().send(self.host)
                })
				break
			case 'ko':
				this.signals.hide().send(this.host)
				break	
			case 'prev':
                if (!self.currentPage) break
                closePage(self,self.currentPage,self.pages,false,function(err){
                    if (err) return console.error(err)
                    showPage(self,--(self.currentPage),self.pages)
                })
				break	
			case 'next':
                if (self.pages.length===self.currentPage+1) break
                closePage(self,self.currentPage,self.pages,true,function(err){
                    if (err) return console.error(err)
                    showPage(self,++(self.currentPage),self.pages)
                })
				break	
			}
		}
    }
}
