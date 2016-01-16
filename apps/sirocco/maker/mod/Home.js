var
tpl=require('Home.html'),
INTENT='whatsapp://send?text=http://107.20.154.29:4888/sirocco?id=LINK'

return {
    deps:{
        greets:'models'
    },
    create:function(deps){
        this.el.innerHTML=tpl
        var
        el=this.el
        this.img=el.querySelector('#img')
        this.url=el.querySelector('#url')
        this.title=el.querySelector('#title')
        this.desc=el.querySelector('#desc')
        this.whatsapp=el.querySelector('#whatsapp')
    },
    events:{
        'click #refresh':function(e){
            if (!this.url.value) return
            this.img.src=this.url.value
        },
        'click #submit':function(e){
            var data={
                url:this.url.value,
                title:this.title.value,
                desc:this.desc.value
            }

            if (!data.url || !data.title|| !data.desc) return alert('Write something')

            var self=this

            this.deps.greets.create(data,{
                data:data,
                success:function(coll, raw){
                    self.whatsapp.removeAttribute('style')
                    self.whatsapp.href=INTENT.replace('LINK',raw.id)
                },
                error:function(coll, err){
                    alert(err)
                }
            })
        }
    }
}
