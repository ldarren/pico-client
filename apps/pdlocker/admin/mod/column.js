function onResize(self) {
    var el=self.el
    if (!el.offsetHeight) return console.log(self.name, 'invisible1')
    if ('none'===window.getComputedStyle(el, null).getPropertyValue('display')) return console.log(self.name, 'invisible2')
    console.log(self.name, 'visible')
}

return {
    create:function(deps){
        window.addEventListener('orientationchange', onResize, this);

        // Initial execution if needed
        onResize.call(this)
    }
}
