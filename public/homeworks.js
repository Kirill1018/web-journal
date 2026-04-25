const csrfProt = 'qwerty'
const headers = {
    'Content-Type': 'application/json',
    'csrf-prot': csrfProt
}
$.ajax({
    type: 'get',
    url: '/id',
}).then(response1 => $.ajax({
    type: 'get',
    url: 'http://localhost:3000/journal/checking',
    headers: { 'csrf-prot': csrfProt }
}).then(async response2 => {
    let iterator = 0
    for (let homework of response2) if (homework.comment === null && homework.mark === null) await $.ajax({
        type: 'get',
        url: `http://localhost:3000/journal/userById?id=${homework.userId}`,
        headers: { 'csrf-prot': csrfProt }
    }).then(response3 => $.ajax({
        type: 'get',
        url: `http://localhost:3000/journal/homeworks?id=${homework.homId}`,
        headers: { 'csrf-prot': csrfProt }
    }).then(response4 => $.ajax({
        type: 'get',
        url: `http://localhost:3000/journal/lessonById?id=${response4.lessId}`,
        headers: { 'csrf-prot': csrfProt }
    }).then(response5 => $.ajax({
        type: 'get',
        url: `http://localhost:3000/journal/subjects?id=${response5.subjId}`,
        headers: { 'csrf-prot': csrfProt }
    }).then(response6 => { if (response6.userId === response1.Id) $.ajax({
        type: 'get',
        url: `http://localhost:3000/journal/groupsOutOfArch?id=${response6.groupId}`,
        headers: { 'csrf-prot': csrfProt }
    }).then(message => {
        $('tbody').append(`
            <tr>
                <td>${response3.username}</td>
                <td>${new Date(response5.date).toLocaleDateString()}</td>
                <td>${message.name}</td>
                <td>${response6.name}</td>
                <td>${response5.theme}</td>
                <td>
                    <button id="checking${iterator}">проверить</button>
                </td>
                <td>
                    <button id="lookTask${iterator}">посмотреть задание</button>
                </td>
                <td>
                    <button id="rating${iterator}">оценить</button>
                </td>
            </tr>`)
            const binFile = homework.binFile
            if (binFile === null) { $(`#checking${iterator}`).on('click', () => $.ajax({
                type: 'post',
                url: '/checking',
                data: JSON.stringify(homework),
                headers: headers
            }).then(window.location.href = '/work'))
        }
        else $(`#checking${iterator}`).on('click', async () => {            
            const data = binFile.data
            const length = data.length
            const arrayBuffer = new ArrayBuffer(length)
            const view = new Uint8Array(arrayBuffer)
            for (let i = 0; i < length; i++) view[i] = data[i]
            const blob = new Blob([arrayBuffer])
            const handle = await showSaveFilePicker({ suggestedName: homework.lodgeName })
            const writable = await handle.createWritable()
            await writable.write(blob)
            await writable.close()
        })
        $(`#lookTask${iterator}`).on('click', () => $.ajax({
            type: 'post',
            url: '/homework',
            data: JSON.stringify(response4),
            headers: headers
        }).then(window.location.href = '/lookTask'))
        $(`#rating${iterator}`).on('click', () => $.ajax({
            type: 'post',
            url: '/checking',
            data: JSON.stringify(homework),
            headers: headers
        }).then(window.location.href = '/rating'))
        iterator++
    })
}))))
}))