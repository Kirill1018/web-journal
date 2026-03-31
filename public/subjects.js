const csrfProt = 'qwerty'
load()
function load() {
    $('tbody').html(new String())
    $.ajax({
        type: 'get',
        url: 'http://localhost:3000/journal/passSubj',
        headers: { 'csrf-prot': csrfProt }
    }).then(response1 => {
        $.ajax({
            type: 'get',
            url: 'http://localhost:3000/journal/currSubj',
            headers: { 'csrf-prot': csrfProt }
        }).then(async response2 => {
            let iterator = 0
            for (let subject of response1) { await $.ajax({
                type: 'get',
                url: `http://localhost:3000/journal/groupById?id=${subject.groupId}`,
                headers: { 'csrf-prot': csrfProt }
            }).then(response3 => {
                const rowEnd = subject.isArch ? '</tr>' : `
                <td>
                    <button id="translToArchStat${iterator}">перевести в архивный статус</button>
                </td>
            </tr>`
            $('tbody').append(`
                <tr>
                    <td>${subject.name}</td>
                    <td>${response3.name}</td>
                    <td>
                        <button id="editing${iterator}">редактировать</button>
                    </td>${rowEnd}`)
                    $(`#editing${iterator}`).on('click', () => $.ajax(set(subject)).then(window.location.href = '/edSubj'))
                    $(`#translToArchStat${iterator}`).on('click', () => {
                        const formData = new FormData()
                        formData.append('id', subject.Id)
                        $.ajax({
                            type: 'post',
                            processData: false,
                            contentType: false,
                            cache: false,
                            url: 'http://localhost:3000/journal/subjArch',
                            data: formData,
                            enctype: 'multipart/form-data',
                            headers: { 'csrf-prot': csrfProt }
                        }).then(response4 => {
                            console.log(response4)
                            load()
                        })
                    })
                    iterator++
                })
            }
            for (let subject of response2) await $.ajax({
                type: 'get',
                url: `http://localhost:3000/journal/groupById?id=${subject.groupId}`,
                headers: { 'csrf-prot': csrfProt }
            }).then(message => {
                $('tbody').append(`
                    <tr>
                        <td>${subject.name}</td>
                        <td>${message.name}</td>
                        <td>
                            <button id="editing${iterator}">редактировать</button>
                        </td>
                    </tr>`)
                    $(`#editing${iterator}`).on('click', () => $.ajax(set(subject)).then(window.location.href = '/edSubj'))
                    iterator++
                })
            })
        })
        $('#addNewSubj').on('click', () => window.location.href = '/addSubj')
    }
    function set(acSubj) { return {
        type: 'post',
        url: '/subject',
        data: JSON.stringify(acSubj),
        headers: {
            'Content-Type': 'application/json',
            'csrf-prot': csrfProt
        }
    }
}