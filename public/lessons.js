const csrfProt = 'qwerty'
$.ajax({
    type: 'get',
    url: 'http://localhost:3000/journal/groups',
    headers: { 'csrf-prot': csrfProt }
}).then(async response1 => {
    let groupIt = 0
    for (let group of response1) {
        const groupName = group.name
        const groupId = `group${groupIt}`
        $('#groups').append(`
            <li>
                <label>${groupName}</label>
                <ul id="${groupId}"></ul>
            <li>`)
            await $.ajax({
                type: 'get',
                url: 'http://localhost:3000/journal/lessons',
                headers: { 'csrf-prot': csrfProt }
            }).then(async response2 => {
                const subjIds = new Array()
                for (let lesson of response2) {
                    const id = lesson.subjId
                    for (let i = 0; i < subjIds.length; i++) if (subjIds[i] === id) {
                        subjIds.splice(i, 1)
                        i--
                    }
                    subjIds.push(id)
                }
                let subjIt = 0
                for (let id of subjIds) {
                    const subjId = `${groupId}subject${subjIt}`
                    await $.ajax({
                        type: 'get',
                        url: `http://localhost:3000/journal/subjects?id=${id}`,
                        headers: { 'csrf-prot': csrfProt }
                    }).then(response3 => { if (response3.groupId === group.Id) {
                        const subjName = response3.name
                        $(`#${groupId}`).append(`
                            <li>
                                <label>${subjName}</label>
                                <table>
                                    <thead>
                                        <th>дата</th>
                                        <th>группа</th>
                                        <th>предмет</th>
                                        <th>тема</th>
                                    </thead>
                                    <tbody id="${subjId}"></tbody>
                                </table>
                            </li>`)
                            $.ajax({
                                type: 'get',
                                url: `http://localhost:3000/journal/lessBySubj?subject=${response3.Id}`,
                                headers: { 'csrf-prot': csrfProt }
                            }).then(message => {
                                const lessons = message.sort((a, b) => new Date(a.date) - new Date(b.date))
                                let lessIt = 0
                                for (let lesson of lessons) {
                                    const lessId = `${subjId}lesson${lessIt}`
                                    $(`#${subjId}`).append(`
                                        <tr id="${lessId}">
                                            <td>${new Date(lesson.date).toLocaleDateString()}</td>
                                            <td>${groupName}</td>
                                            <td>${subjName}</td>
                                            <td>${lesson.theme}</td>
                                            <td>
                                                <button id="writHomeTask${lessId}">написать домашнее задание</button>
                                            </td>
                                        </tr>`)
                                        $(`#writHomeTask${lessId}`).on('click', () => $.ajax({
                                            type: 'post',
                                            url: '/lesson',
                                            data: JSON.stringify(lesson),
                                            headers: {
                                                'Content-Type': 'application/json',
                                                'csrf-prot': csrfProt
                                            }
                                        }).then(window.location.href = '/task'))
                                        lessIt++
                                    }
                                })
                            }
                        })
                        subjIt++
                    }
                })
                groupIt++
            }
        })