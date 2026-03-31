$.ajax({
    type: 'get',
    url: '/checking'
}).then(response => {
    const content = response.content.split('\n').join('<br>')
    $('a').html(content)
})