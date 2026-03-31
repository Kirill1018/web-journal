const csrfProt = 'qwerty'
$('button').on('click', () => {
    const val = $('input').val()
    if (val === '') return
    $.ajax({
        type: 'get',
        url: `http://localhost:3000/journal/groupByName?name=${val}`,
        headers: { 'csrf-prot': csrfProt }
    }).then(response => {
        if (response.length > 0) { $('a').text('эта группа уже существует') }
        else {
            const formData = new FormData()
            formData.append('name', val)
            $.ajax({
                type: 'post',
                processData: false,
                contentType: false,
                cache: false,
                url: 'http://localhost:3000/journal/creatGroup',
                data: formData,
                enctype: 'multipart/form-data',
                headers: { 'csrf-prot': csrfProt }
            }).then(window.location.href = '/groups')
        }
    })
})