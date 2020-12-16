document.addEventListener('DOMContentLoaded', function () {

    const cookieOptionTable = document.getElementById('cookie-option-table')
    const queryOptionTable = document.getElementById('query-option-table')

    const addCookieOptionBtn = document.getElementById('add-cookie-option-btn')
    const addQueryOptionBtn = document.getElementById('add-query-option-btn')
    const saveBtn = document.getElementById('save-btn')

    chrome.storage.sync.get(['cookieOptions', 'queryOptions'], function(result) {
        const cookieOptions = result.cookieOptions
        const queryOptions = result.queryOptions

        function refreshCookieOptionInputs() {
            cookieOptionTable.innerHTML = ''
            const tbody = document.createElement('tbody')
            tbody.innerHTML = '<tr><th>Title</th><th>Cookie Name</th></tr>'
            cookieOptionTable.appendChild(tbody)

            for (let i = 0; i < cookieOptions.length; i++) {
                const cookieOption = cookieOptions[i]
                const tr = document.createElement('tr')

                const titleTd = document.createElement('td')
                const titleInput = document.createElement('input')
                titleInput.value = cookieOption.title;
                titleInput.placeholder = "Title"
                titleInput.classList.add("option-input")
                titleInput.addEventListener("change", function () {
                    cookieOptions[i].title = titleInput.value
                });
                titleTd.appendChild(titleInput)
                tr.appendChild(titleTd)

                const cookieNameTd = document.createElement('td')
                const cookieNameInput = document.createElement('input')
                cookieNameInput.value = cookieOption.cookieName;
                cookieNameInput.placeholder = "Cookie Name"
                cookieNameInput.classList.add("option-input")
                cookieNameInput.addEventListener("change", function () {
                    cookieOptions[i].cookieName = cookieNameInput.value
                });
                cookieNameTd.appendChild(cookieNameInput)
                tr.appendChild(cookieNameTd)

                const deleteTd = document.createElement('td')
                const deleteBtn = document.createElement('button')
                deleteBtn.innerText = 'Remove'
                deleteBtn.addEventListener('click', function () {
                    cookieOptions.splice(i, 1);
                    refreshCookieOptionInputs()
                })
                deleteTd.appendChild(deleteBtn)
                tr.append(deleteTd)

                tbody.appendChild(tr)
            }
        }

        function refreshQueryOptionInputs() {
            queryOptionTable.innerHTML = ''
            const tbody = document.createElement('tbody')
            tbody.innerHTML = '<tr><th>Title</th><th>Key</th><th>Value</th><th></th></tr>'
            queryOptionTable.appendChild(tbody)

            for (let i = 0; i < queryOptions.length; i++) {
                const queryOption = queryOptions[i]
                const tr = document.createElement('tr')

                const titleTd = document.createElement('td')
                const titleInput = document.createElement('input')
                titleInput.value = queryOption.title;
                titleInput.placeholder = "Title"
                titleInput.classList.add("option-input")
                titleInput.addEventListener("change", function () {
                    queryOptions[i].title = titleInput.value
                });
                titleTd.appendChild(titleInput)
                tr.appendChild(titleTd)

                const keyTd = document.createElement('td')
                const keyInput = document.createElement('input')
                keyInput.value = queryOption.queryKey;
                keyInput.placeholder = "Key"
                keyInput.classList.add("option-input")
                keyInput.addEventListener("change", function () {
                    queryOptions[i].queryKey = keyInput.value
                });
                keyTd.appendChild(keyInput)
                tr.appendChild(keyTd)

                const valueTd = document.createElement('td')
                const valueInput = document.createElement('input')
                valueInput.value = queryOption.value;
                valueInput.placeholder = "Value"
                valueInput.classList.add("option-input")
                valueInput.addEventListener("change", function () {
                    queryOptions[i].value = valueInput.value
                });
                valueTd.appendChild(valueInput)
                tr.appendChild(valueTd)

                const deleteTd = document.createElement('td')
                const deleteBtn = document.createElement('button')
                deleteBtn.innerText = 'Remove'
                deleteBtn.addEventListener('click', function () {
                    queryOptions.splice(i, 1);
                    refreshQueryOptionInputs()
                })
                deleteTd.appendChild(deleteBtn)
                tr.append(deleteTd)

                tbody.appendChild(tr)
            }
        }

        addCookieOptionBtn.addEventListener('click', function () {
            cookieOptions.push({title: '', cookieName: ''})
            refreshCookieOptionInputs()
        })

        addQueryOptionBtn.addEventListener('click', function () {
            queryOptions.push({title: '', queryKey: '', value: ''})
            refreshQueryOptionInputs()

        })

        saveBtn.addEventListener('click', function () {
            chrome.storage.sync.set({
                cookieOptions: cookieOptions,
                queryOptions: queryOptions
            })
        })


        refreshQueryOptionInputs()
        refreshCookieOptionInputs()
    });
});
