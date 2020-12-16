document.addEventListener('DOMContentLoaded', function () {
    chrome.storage.sync.get(['cookieOptions', 'queryOptions'], function (data) {
        addQueryOptions(data.queryOptions)
        addCookieOptions(data.cookieOptions)
        addIncognitoLoader(data.queryOptions)
        document.getElementById('options-button').addEventListener('click', function () {
            chrome.tabs.create({ 'url': 'chrome://extensions/?options=' + chrome.runtime.id });
        })
    });
});

function addIncognitoLoader(container, queryOptions) {
    document.getElementById('open-incognito-w-params')
        .addEventListener('click', function () {
            chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
                const tab = tabs[0]
                const uri = URI(tab.url)
                chrome.windows.create({"url": uri.toString(), "incognito": true});
            })
        })
    document.getElementById('open-incognito-wo-params')
        .addEventListener('click', function () {
            chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
                const tab = tabs[0]
                const uri = URI(tab.url)
                queryOptions.forEach(testGroup => {
                    uri.removeSearch(testGroup.queryKey, testGroup.value)
                })
                chrome.windows.create({"url": uri.toString(), "incognito": true});
            })
        })
}

function addCookieOptions(options) {
    const container = document.getElementById('cookie-cleaner-container')
    container.appendChild(createButton('All', function () {
        chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
            const tab = tabs[0]
            const uri = URI(tab.url)
            chrome.cookies.getAll({"url": uri.toString()}, function (cookies) {
                cookies.forEach(function (cookie) {
                    chrome.cookies.remove({"url": uri.toString(), "name": cookie.name}, function (deleted_cookie) {
                        chrome.tabs.reload(tab.id, function () {
                        })
                    });
                })
            })
        })
    }))
    container.appendChild(createButton('All defined', function () {
        chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
            const tab = tabs[0]
            const uri = URI(tab.url)
            options.forEach(option => {
                chrome.cookies.remove({"url": uri.toString(), "name": option.cookieName}, function (deleted_cookie) {
                    chrome.tabs.reload(tab.id, function () {
                    })
                });
            })
        })
    }))
    options.forEach(function (option) {
        container.appendChild(createButton(option.title, function () {
            chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
                const tab = tabs[0]
                const uri = URI(tab.url)
                chrome.cookies.remove({"url": uri.toString(), "name": option.cookieName}, function (deleted_cookie) {
                    chrome.tabs.reload(tab.id, function () {
                    })
                });
            })
        }))
    })
}

function addQueryOptions(options) {
    const container = document.getElementById('query-param-toggle-container')
    container.appendChild(createButton('Add all', function () {
        chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
            const tab = tabs[0]
            const uri = URI(tab.url)
            options.forEach(option => {
                uri.addSearch(option.queryKey, option.value)
            })
            chrome.tabs.update(tab.id, {url: uri.toString()})
        })
    }))
    container.appendChild(createButton('Remove all', function () {
        chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
            const tab = tabs[0]
            const uri = URI(tab.url)
            options.forEach(option => {
                uri.removeQuery(option.queryKey, option.value)
            })
            chrome.tabs.update(tab.id, {url: uri.toString()})
        })
    }))
    options.forEach(option => {
        container.appendChild(createButton(option.title, function () {
            chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
                const tab = tabs[0]
                const uri = URI(tab.url)
                if (uri.hasQuery(option.queryKey, option.value, true)) {
                    uri.removeSearch(option.queryKey, option.value)
                } else {
                    uri.addSearch(option.queryKey, option.value)
                }
                chrome.tabs.update(tab.id, {url: uri.toString()})
            })
        }))
    })
}

function createButton(text, click) {
    const btn = document.createElement('button')
    btn.innerText = text
    btn.classList.add('flex-button')
    btn.addEventListener('click', click)
    return btn
}

