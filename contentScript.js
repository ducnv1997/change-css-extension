chrome.webNavigation?.onDOMContentLoaded.addListener(function ( details ) {
    var changeCss = function () {
        chrome.storage.sync.get([ 'targets' ], function ( result ) {
            chrome.tabs.query({ currentWindow: true, active: true }, function ( tabs ) {
                var url = new URL(tabs[0].url)?.hostname
                chrome.tabs.executeScript({ code: `(${ inContent })(${ JSON.stringify(result.targets) }, ${ JSON.stringify(url) })` });

                function inContent( data, url ) {
                    data?.forEach((item => {
                        if (item.url === url) {
                            console.log(item);
                            item?.options.forEach(option => {
                                var els = document.getElementsByClassName(option.class)
                                for (var i = 0; i < els.length; i++) {
                                    for (const property in option.style) {
                                        els[i].style.setProperty(property, option.style[property], 'important');
                                    }
                                }
                            })

                        }

                    }))
                }
            })
        })
    };
    changeCss()
});







