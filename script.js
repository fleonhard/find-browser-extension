chrome.runtime.onInstalled.addListener(function () {
    chrome.storage.sync.set({color: '#3aa757'}, function () {
        console.log("The color is green.");
    })
})

document.addEventListener('DOMContentLoaded', function () {
    const container = document.getElementById('container');
    container.innerHTML = '';

    const options = [
        {
            title: 'Flyout Testgroup',
            key: 'rdtga',
            value: 'productlist-elastic'
        },
        {
            title: 'Productlist Testgroup',
            key: 'rdtga',
            value: 'productlist-elastic-results-page'
        }
    ]

    options.forEach(option => {
        container.appendChild(createButton(option.title, () => optionClicked(option)));
    })

});

function optionClicked(option) {
    chrome.tabs.getSelected(null, function (tab) {
        const uri = URI(tab.url)

        if (uri.hasQuery(option.key, option.value, true)) {
            console.log(`URI ${uri.toString()}`)
            console.log(`Remove ${option.key}=${option.value}`)
            uri.removeSearch(option.key, option.value)
        } else {
            console.log(`URI ${uri.toString()}`)
            console.log(`Add ${option.key}=${option.value}`)
            uri.addSearch(option.key, option.value)
        }
        chrome.tabs.update(tab.id, {url: uri.toString()});
    })
}

function createButton(text, click) {
    const btn = document.createElement('button');
    btn.innerText = text;
    btn.style.width = `200px`;
    btn.style.marginTop = `4px`;
    btn.addEventListener('click', click)
    return btn;
}
