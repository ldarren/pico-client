var
Router=require('js/Router'),
tpl=require('Home.html'),
svg=require('dat/placeholder.svg'),
INTENT='whatsapp://send?text=http%3A%2F%2F107.20.154.29%3A4888%2Fsirocco%3Fid%3DLINK',
charcode=function(txt){
    var codes= []
    for(var i=0,l=txt.length; i<l; i++){
        codes.push(txt.codePointAt(i))
    }
    return codes
},
unicode=function(txt){
    var
    codes= '',
    code
    for(var i=0,l=txt.length; i<l; i++){
        code=txt.charCodeAt(i)
        if ((code > 0x7F && code < 0xD800) || (code >= 0xE000 && code < 0x10000)){ codes += '&#' + code + ';' }
        else { codes += txt.charAt(i) }
    }
    return codes
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
            if (window.location.hostname === a.host){
                Router.go('search?q='+text)
            }else{
                this.img.src=text
            }
        },
        'click #submit':function(e){
            var data={
                url:this.search.value,
                title:charcode(this.title.value),
                desc:charcode(this.desc.value)
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
