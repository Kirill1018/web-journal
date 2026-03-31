const csrfProt = 'qwerty'
load()
function load() {
    $('ul').html(new String())
    $.ajax({
        type: 'get',
        url: '/group'
    }).then(response1 => {
        const id = response1.Id
        $.ajax({
            type: 'get',
            url: `http://localhost:3000/journal/usersByGroup?group=${id}`,
            headers: { 'csrf-prot': csrfProt }
        }).then(response2 => {
            let iterator1 = 0
            for (let student of response2) {
                $('#studInGroup').append(`
                    <li>
                        <label>${student.username}</label>
                        <button id="exception${iterator1}">исключить</button>
                    </li>`)
                    $(`#exception${iterator1}`).on('click', () => $.ajax({
                        type: 'post',
                        url: 'http://localhost:3000/journal/exception',
                        data: JSON.stringify(student),
                        headers: {
                            'Content-Type': 'application/json',
                            'csrf-prot': csrfProt
                        }
                    }).then(response3 => {
                        console.log(response3)
                        load()
                    }))
                    iterator1++
                }
                $.ajax({
                    type: 'get',
                    url: 'http://localhost:3000/journal/users',
                    headers: { 'csrf-prot': csrfProt }
                }).then(response4 => {
                    let iterator2 = 0
                    for (let student of response4) {
                        $('#freeStud').append(`
                            <li>
                                <label>${student.username}</label>
                                <button id="inclusion${iterator2}">включить</button>
                            </li>`)
                            $(`#inclusion${iterator2}`).on('click', () => {
                                const formData = new FormData()
                                append(formData, id, student.Id)
                                $.ajax({
                                    type: 'post',
                                    processData: false,
                                    contentType: false,
                                    cache: false,
                                    url: 'http://localhost:3000/journal/inclusion',
                                    data: formData,
                                    enctype: 'multipart/form-data',
                                    headers: { 'csrf-prot': csrfProt }
                                }).then(message => {
                                    console.log(message)
                                    load()
                                })
                            })
                            iterator2++
                        }
                    })
                })
            })
        }
        function append(data, groupId, id) {
            data.append('groupId', groupId)
            data.append('id', id)
        }