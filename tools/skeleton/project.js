exports.config = [
    [
        "{PATH/TO/ADDITIONAL/JAVASCRIPT}.js"
    ],[
        "{PATH/TO/CSS}.css",
    ],[
        ["{RES_ID}","{RES_TYPE}","{RES_VALUE}"]
    ],{
        "{PAGE_ROUTE}":[
            [
                ["{RES_ID}", "{RES_TYPE}", "{RES_VALUE}"]
            ],{
                "CSS_SELECTOR":{
                    "CSS_PROPERTY":"CSS_VALUE"
                }
            }
        ]
    }
]
