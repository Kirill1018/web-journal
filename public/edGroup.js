const csrfProt = 'qwerty'
$.ajax({
    type: 'get',
    url: '/group'
}).then(response => {
    const name = response.name
    $('input').val(name)
    $('button').on('click', () => {
        const val = $('input').val()
        if (val === '') return
        if (val === name) {
            window.location.href = '/groups'
            return
        }
        $.ajax({
            type: 'get',
            url: `http://localhost:3000/journal/groupByName?name=${val}`,
            headers: { 'csrf-prot': csrfProt }
        }).then(message => {            
            if (message.length > 0) { $('a').text('эта группа уже существует') }
            else {
                const formData = new FormData()
                append(formData, val, response.Id)
                $.ajax({
                    type: 'post',
                    processData: false,
                    contentType: false,
                    cache: false,
                    url: 'http://localhost:3000/journal/edGroup',
                    data: formData,
                    enctype: 'multipart/form-data',
                    headers: { 'csrf-prot': csrfProt }
                }).then(window.location.href = '/groups')
            }
        })
    })
})
function append(data, name, id) {
    data.append('name', name)
    data.append('id', id)
}