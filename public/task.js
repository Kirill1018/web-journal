css()
$.ajax({
    type: 'get',
    url: '/lesson'
}).then(response => $('button').on('click', () => {
    const task = $('textarea').val()
    const date = $('input').val()
    if (task === '' || date === '') return
    const formData = new FormData()
    const fullDate = new Date(date)
    append(formData, task, response.Id, `${fullDate.getMonth() + 1}.${fullDate.getDate()}.${fullDate.getFullYear()}`)
    $.ajax({
        type: 'post',
        processData: false,
        contentType: false,
        cache: false,
        url: 'http://localhost:3000/journal/homework',
        data: formData,
        enctype: 'multipart/form-data',
        headers: { 'csrf-prot': 'qwerty' }
    }).then(window.location.href = '/lessons')
}))
function css() {
    $('textarea').css('width', window.innerWidth)
    $('textarea').css('height', window.innerHeight)
}
function append(data, task, lessId, deadline) {
    data.append('task', task)
    data.append('lessId', lessId)
    data.append('deadline', deadline)
}