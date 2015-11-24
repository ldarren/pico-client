var
tpl=require('drawer.html')

return {
    className:'demo-drawer mdl-layout__drawer mdl-color--blue-grey-900 mdl-color-text--blue-grey-50',
    create:function(){
        this.el.innerHTML=tpl()
    }
}
