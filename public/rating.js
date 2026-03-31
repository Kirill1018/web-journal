const csrfProt = 'qwerty'
css()
$.ajax({
    type: 'get',
    url: '/checking'
}).then(response => {
    for (let i = 1; i <= 12; i++) { $('select').append(`<option>${i}</option>`) }
    $('button').on('click', async () => {
        const comment = $('textarea').val()
        const mark = $('select').val()
        const emptyString = ''
        let isCommFill = true
        let isMarkFill = true
        if (comment === emptyString) isCommFill = false
        if (mark === emptyString) isMarkFill = false
        if (isCommFill === false && isMarkFill === false) return
        const id = response.Id
        if (isCommFill) {
            const formData = new FormData()
            append(formData, id, 'comment', comment)
            await $.ajax({
                type: 'post',
                processData: false,
                contentType: false,
                cache: false,
                url: 'http://localhost:3000/journal/comment',
                data: formData,
                enctype: 'multipart/form-data',
                headers: { 'csrf-prot': csrfProt }
            })
        }
        if (isMarkFill) {
            const formData = new FormData()
            append(formData, id, 'mark', mark)
            await $.ajax({
                type: 'post',
                processData: false,
                contentType: false,
                cache: false,
                url: 'http://localhost:3000/journal/mark',
                data: formData,
                enctype: 'multipart/form-data',
                headers: { 'csrf-prot': csrfProt }
            })
        }
        window.location.href = '/homeworks'
    })
})
function css() {
    $('textarea').css('width', window.innerWidth)
    $('textarea').css('height', window.innerHeight)
}
function append(data, id, key, value) {
    data.append('id', id)
    data.append(key, value)
}