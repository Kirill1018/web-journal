$.ajax({
    type: 'get',
    url: '/homework'
}).then(response => {
    const task = response.task.split('\n').join('<br>')
    $('a').html(task)
})