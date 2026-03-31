const csrfProt = 'qwerty'
$.ajax({
    type: 'get',
    url: '/subject'
}).then(response1 => {
    const subjName = response1.name
    $('input').val(subjName)
    $.ajax({
        type: 'get',
        url: 'http://localhost:3000/journal/groups',
        headers: { 'csrf-prot': csrfProt }
    }).then(response2 => {
        for (let group of response2) { $('select').append(`<option>${group.name}</option>`) }
        $.ajax({
            type: 'get',
            url: `http://localhost:3000/journal/groupById?id=${response1.groupId}`,
            headers: { 'csrf-prot': csrfProt }
        }).then(response3 => {
            const groupName = response3.name
            $('select').val(groupName)
            $('button').on('click', () => {
                const inpVal = $('input').val()
                const selVal = $('select').val()
                if (inpVal === '') return
                if (inpVal === subjName && selVal === groupName) {
                    window.location.href = '/subjects'
                    return
                }
                $.ajax({
                    type: 'get',
                    url: `http://localhost:3000/journal/groupByName?name=${selVal}`,
                    headers: { 'csrf-prot': csrfProt }
                }).then(response4 => {
                    const formData = new FormData()
                    append(formData, inpVal, response4[0].Id, response1.Id)
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
                            url: 'http://localhost:3000/journal/edSubj',
                            data: formData,
                            enctype: 'multipart/form-data',
                            headers: { 'csrf-prot': csrfProt }
                        }).then(window.location.href = '/subjects')
                    })
                })
            })
        })
    })
})
function append(data, name, groupId, id) {
    data.append('name', name)
    data.append('groupId', groupId)
    data.append('id', id)
}