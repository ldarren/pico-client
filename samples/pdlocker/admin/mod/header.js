var
tpl=require('header.html')

return {
    tagName:'header',
    className:'demo-header mdl-layout__header mdl-color--white mdl-color--grey-100 mdl-color-text--grey-600 is-casting-shadow',
    create:function(){
        this.el.innerHTML=tpl()
    }
}
