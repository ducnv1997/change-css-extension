$(document).ready(function () {
    document.getElementById("apply-style").addEventListener("click", function () {
        var className  = document.getElementById("className").value || '';
        var styleKey   = document.getElementById("key").value || '';
        var styleValue = document.getElementById("value").value || '';


        chrome.tabs.query({ currentWindow: true, active: true }, function ( tabs ) {
            var url = new URL(tabs[0].url)?.hostname
            chrome.storage.sync.get([ 'targets' ], function ( result ) {
                const foundTarget = result?.targets?.find(item => item.url === url);
                if (!result?.targets?.length) {
                    result.targets = [];
                }
                if ( ! foundTarget) {
                    const newTarget = [ ...result?.targets ];
                    newTarget.push({
                        url    : url,
                        options: [
                            {
                                class: className,
                                style: {
                                    [styleKey]: styleValue
                                }
                            }
                        ]

                    });
                    chrome.storage.sync.set({ targets: newTarget }, function () {
                    });
                } else {
                    var exitedClass = foundTarget.options.find(item => item.class === className);
                    var exceptCurrentHost = result?.targets.filter(item => item.url !== url);

                    if ( ! exitedClass) {
                        foundTarget.options.push({
                            class: className,
                            style: {
                                [styleKey]: styleValue
                            }
                        })
                    } else {
                        exitedClass.style[styleKey] =  styleValue;
                    }
                    chrome.storage.sync.set({
                        targets: [
                            ...exceptCurrentHost,
                            foundTarget
                        ]
                    }, function () {});
                }
            });
        })

    })
    document.getElementById("reload").addEventListener("click", function () {
        chrome.tabs.query({ active: true, currentWindow: true }, function ( arrayOfTabs ) {
            var code = 'window.location.reload();';
            chrome.tabs.executeScript(arrayOfTabs[0].id, { code: code });
        });
    })

    document.getElementById("clear").addEventListener("click", function () {

        chrome.storage.sync.get([ 'targets' ], function ( result ) {
            var exceptCurrentHost = result?.targets.filter(item => item.url !== url);
            chrome.storage.sync.set({ targets: exceptCurrentHost }, function () {
            })
            // chrome.storage.sync.clear(function () {
        });
        chrome.tabs.query({ active: true, currentWindow: true }, function ( arrayOfTabs ) {
            var code = 'window.location.reload();';
            chrome.tabs.executeScript(arrayOfTabs[0].id, { code: code });
        });
    })
});
