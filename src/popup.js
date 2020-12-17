document.addEventListener('DOMContentLoaded', function () {
    chrome.storage.sync.get(['cookieOptions', 'queryOptions'], function (data) {
        addQueryOptions(data.queryOptions)
        addCookieOptions(data.cookieOptions)
        addIncognitoLoader(data.queryOptions)
        addOthers()
    });
});

function addOthers() {
    const container = document.getElementById('others-container')
    const icon = '../res/settings-icon.svg'

    container.appendChild(createButton('Settings', icon, function () {
        chrome.tabs.create({'url': 'chrome://extensions/?options=' + chrome.runtime.id});
    }))
}

function addIncognitoLoader(queryOptions) {
    const container = document.getElementById('incognito-opener-container')
    const icon = '../res/incognito-icon.svg'

    container.appendChild(createButton('Open with Params', icon, function () {
        withTab(function (tab, uri) {
            chrome.windows.create({"url": uri.toString(), "incognito": true});
        })
    }))

    container.appendChild(createButton('Open without Params', icon, function () {
        withTab(function (tab, uri) {
            queryOptions.forEach(testGroup => {
                uri.removeSearch(testGroup.queryKey, testGroup.value)
            })
            chrome.windows.create({"url": uri.toString(), "incognito": true});
        })
    }))
}

function addCookieOptions(options) {
    const container = document.getElementById('cookie-cleaner-container')
    const icon = '../res/cookie-icon.svg'

    container.appendChild(createButton('All', icon, function () {
        withTab(function (tab, uri) {
            chrome.cookies.getAll({"url": uri.toString()}, function (cookies) {
                cookies.forEach(function (cookie) {
                    chrome.cookies.remove({"url": uri.toString(), "name": cookie.name}, function (deleted_cookie) {
                        reload(tab)
                    });
                })
            })
        })
    }))
    container.appendChild(createButton('All defined', icon, function () {
        withTab(function (tab, uri) {
            options.forEach(option => {
                chrome.cookies.remove({"url": uri.toString(), "name": option.cookieName}, function (deleted_cookie) {
                    reload(tab)
                });
            })
        })
    }))
    options.forEach(function (option) {
        container.appendChild(createButton(option.title, icon, function () {
            withTab(function (tab, uri) {
                chrome.cookies.remove({"url": uri.toString(), "name": option.cookieName}, function (deleted_cookie) {
                    reload(tab)
                });
            })
        }))
    })
}

function addQueryOptions(options) {
    const container = document.getElementById('query-param-toggle-container')
    const icon = '../res/question-icon.svg'

    container.appendChild(createButton('Add all', icon, function () {
        withTab(function (tab, uri) {
            options.forEach(option => {
                uri.addSearch(option.queryKey, option.value)
            })
            updateTab(tab, uri)
        })
    }))

    container.appendChild(createButton('Remove all', icon, function () {
        withTab(function (tab, uri) {
            options.forEach(option => {
                uri.removeQuery(option.queryKey, option.value)
            })
            updateTab(tab, uri)
        })
    }))

    options.forEach(option => {
        container.appendChild(createButton(option.title, icon, function () {
            withTab(function (tab, uri) {
                if (uri.hasQuery(option.queryKey, option.value, true)) {
                    uri.removeSearch(option.queryKey, option.value)
                } else {
                    uri.addSearch(option.queryKey, option.value)
                }
                updateTab(tab, uri)
            })
        }))
    })
}

function createButton(text, icon, click) {
    const btn = document.createElement('button')

    const txt = document.createElement('span')
    txt.innerText = text

    const ic = document.createElement('span')
    ic.classList.add('icon')
    ic.style.backgroundImage = 'url("' + icon + '")'

    btn.classList.add('flex-button')
    btn.addEventListener('click', click)

    btn.append(ic, txt)
    return btn
}

function withTab(block) {
    chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
        block(tabs[0], URI(tabs[0].url))
    })
}

function updateTab(tab, uri) {
    chrome.tabs.update(tab.id, {url: uri.toString()})
}

function reload(tab) {
    chrome.tabs.reload(tab.id, function () {
    })
}
