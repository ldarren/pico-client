var
Router=require('js/Router'),
network=require('js/network'),
tpl=require('Home.html'),
svg=require('dat/placeholder.svg'),
INTENT='whatsapp://send?text='

this.load=function(){
    INTENT=INTENT+encodeURIComponent(network.getDomain('sirocco').url+'?id=LINK')
}

return {
    tagName:'form',
    attributes:{
        action:'#'
    },
    deps:{
        url:'param',
        greets:'models'
    },
    create:function(deps){
        this.el.innerHTML=tpl
        var
        el=this.el
        this.img=el.querySelector('#img')
        this.search=el.querySelector('#search')
        this.title=el.querySelector('#title')
        this.desc=el.querySelector('#desc')
        this.whatsapp=el.querySelector('#whatsapp')

        if (deps.url){
            var url=location.hash.substr(location.hash.indexOf(deps.url))
            this.img.src=url
            this.search.value=url
        }else{
            this.img.src='data:image/svg+xml;charset=utf-8,'+encodeURI(svg)
        }
    },
    events:{
        'keydown #search':function(e){
            var text=this.search.value
            if (13 !== e.keyCode || !text) return
            var a  = document.createElement('a')
            a.href = text
            if (location.host=== a.host){
                Router.go('search?q='+text)
            }else{
                this.img.src=text
            }
        },
        'click #submit':function(e){
            var data={
                url:this.search.value,
                title:this.title.value,//picoStr.puny(this.title.value),
                desc:this.desc.value//picoStr.puny(this.desc.value)
            }

            if (!data.url || !data.title|| !data.desc) return alert('Write something')

            this.whatsapp.setAttribute('style','display:none')

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
