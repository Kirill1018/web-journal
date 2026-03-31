const csrfProt = 'qwerty'
$.ajax({
    type: 'get',
    url: '/id'
}).then(response1 => $.ajax({
    type: 'get',
    url: 'http://localhost:3000/journal/groups',
    headers: { 'csrf-prot': csrfProt }
}).then(response2 => {
    for (let group of response2) { $('select').append(`<option>${group.name}</option>`) }
    $('button').on('click', () => {
        const subjName = $('input').val()
        if (subjName === '') return
        const formData = new FormData()
        $.ajax({
            type: 'get',
            url: `http://localhost:3000/journal/groupByName?name=${$('select').val()}`,
            headers: { 'csrf-prot': csrfProt }
        }).then(response3 => {
            append(formData, subjName, response3[0].Id, response1.Id)
            $.ajax({
                type: 'post',
                processData: false,
                contentType: false,
                cache: false,
                url: 'http://localhost:3000/journal/currSubj',
                data: formData,
                enctype: 'multipart/form-data',
                headers: { 'csrf-prot': csrfProt }
            }).then(message => {
                if (message.length > 0) { $('a').text('этот предмет уже есть у данной группы') }
                else $.ajax({
                    type: 'post',
                    processData: false,
                    contentType: false,
                    cache: false,
                    url: 'http://localhost:3000/journal/addSubj',
                    data: formData,
                    enctype: 'multipart/form-data',
                    headers: { 'csrf-prot': csrfProt }
                }).then(window.location.href = '/subjects')
            })
        })
    })
}))
function append(data, name, groupId, id) {
    data.append('name', name)
    data.append('groupId', groupId)
    data.append('id', id)
}