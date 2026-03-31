const csrfProt = 'qwerty'
$('button').on('click', () => {
    const formData = new FormData()
    append(formData, $('#username').val(), $('#password').val())
    $.ajax({
        type: 'post',
        processData: false,
        contentType: false,
        cache: false,
        url: 'http://localhost:3000/journal',
        data: formData,
        enctype: 'multipart/form-data',
        headers: { 'csrf-prot': csrfProt }
    }).then(response => $.ajax({
        type: 'post',
        url: '/',
        data: JSON.stringify(response),
        headers: {
            'Content-Type': 'application/json',
            'csrf-prot': csrfProt
        }
    }).then(message => {
        console.log(message)
        window.location.href = '/subjects'
    }))
})
function append(data, username, password) {
    data.append('username', username)
    data.append('password', password)
}