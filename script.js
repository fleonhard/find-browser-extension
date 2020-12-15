const testGroups = [
    {title: 'Flyout Testgroup', key: 'rdtga', value: 'productlist-elastic'},
    {title: 'Productlist Testgroup', key: 'rdtga', value: 'productlist-elastic-results-page'}
]

document.addEventListener('DOMContentLoaded', function () {
    const container = document.getElementById('container')
    container.style.width = '500px'
    addTestGroups(container)
    addCookieCleaner(container)
    addIncognitoLoader(container)
});

function addIncognitoLoader(container) {
    container.appendChild(createHeader('Incognito'))
    container.appendChild(createButton('Open with Testgroups', function () {
        chrome.tabs.getSelected(null, function (tab) {
            const uri = URI(tab.url)
            chrome.windows.create({"url": uri.toString(), "incognito": true});
        })
    }))
    container.appendChild(createButton('Open without Testgroups', function () {
        chrome.tabs.getSelected(null, function (tab) {
            const uri = URI(tab.url)
            testGroups.forEach(testGroup => {
                uri.removeSearch(testGroup.key, testGroup.value)
            })
            chrome.windows.create({"url": uri.toString(), "incognito": true});
        })
    }))
}

function addCookieCleaner(container) {
    container.appendChild(createHeader('Cookies'))
    container.appendChild(createButton('Clear Cookies', function () {
        chrome.tabs.getSelected(null, function (tab) {
            const uri = URI(tab.url)
            chrome.cookies.getAll({url: uri.origin()}, function (cookies) {
                for (let i = 0; i < cookies.length; i++) {
                    chrome.cookies.remove({url: uri.origin() + cookies[i].path, name: cookies[i].name})
                }
                chrome.tabs.reload(tab.id, function () {
                    alert("Reloaded")
                })
            })
        })
    }))
}

function addTestGroups(container) {
    container.appendChild(createHeader('Test Groups'))
    container.appendChild(createButton('Add all', function () {
        chrome.tabs.getSelected(null, function (tab) {
            const uri = URI(tab.url)
            testGroups.forEach(testGroup => {
                uri.addSearch(testGroup.key, testGroup.value)
            })
            chrome.tabs.update(tab.id, {url: uri.toString()})
        })
    }))
    container.appendChild(createButton('Remove all', function () {
        chrome.tabs.getSelected(null, function (tab) {
            const uri = URI(tab.url)
            testGroups.forEach(testGroup => {
                uri.removeQuery(testGroup.key, testGroup.value)
            })
            chrome.tabs.update(tab.id, {url: uri.toString()})
        })
    }))
    container.appendChild(createSpacer('8px'))
    testGroups.forEach(testGroup => {
        container.appendChild(createButton(testGroup.title, function () {
            chrome.tabs.getSelected(null, function (tab) {
                const uri = URI(tab.url)
                if (uri.hasQuery(testGroup.key, testGroup.value, true)) {
                    uri.removeSearch(testGroup.key, testGroup.value)
                } else {
                    uri.addSearch(testGroup.key, testGroup.value)
                }
                chrome.tabs.update(tab.id, {url: uri.toString()})
            })
        }))
    })
}

function createHeader(title) {
    const header = document.createElement('h4')
    header.innerText = title
    return header
}

function createSpacer(size) {
    const spacer = document.createElement('div')
    spacer.style.height = size
    return spacer
}

function createButton(text, click) {
    const btn = document.createElement('button')
    btn.innerText = text

    Object.assign(btn.style, {
        // width:'200px',
        marginTop: '2px',
        border: 'none',
        'border-radius': '2px',
        margin: '2px',
        backgroundColor: '#3C3C46',
        color: '#ffffff',
        paddingLeft: '16px',
        paddingRight: '16px',
        paddingTop: '12px',
        paddingBottom: '12px'
    })

    btn.addEventListener('click', click)
    return btn
}
