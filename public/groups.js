const csrfProt = 'qwerty'
const headers = {
    'Content-Type': 'application/json',
    'csrf-prot': csrfProt
}
load()
function load() {
    $('ul').html(new String())
    const teamIds = new Array()
    const ids = new Array()
    $.ajax({
        type: 'get',
        url: '/id'
    }).then(async response1 => {
        const response2 = await $.ajax({
            type: 'get',
            url: `http://localhost:3000/journal/currSubjByUser?user=${response1.Id}`,
            headers: { 'csrf-prot': csrfProt }
        })
        for (let item of response2) {
            const teamId = item.groupId
            for (let i = 0; i < teamIds.length; i++) { if (teamIds[i] === teamId) {
                teamIds.splice(i, 1)
                i--
            }
        }
        teamIds.push(teamId)
    }
    $.ajax({
        type: 'get',
        url: 'http://localhost:3000/journal/groups',
        headers: { 'csrf-prot': csrfProt }
    }).then(async response3 => {
        for (let item of response3) { ids.push(item.Id) }
        for (let i = 0; i < ids.length; i++) for (let id of teamIds) if (id === ids[i]) {
            ids.splice(i, 1)
            i--
            break
        }
        let iterator = 0
        for (let id of teamIds) { await $.ajax({
            type: 'get',
            url: `http://localhost:3000/journal/groupsOutOfArch?id=${id}`,
            headers: { 'csrf-prot': csrfProt }
        }).then(response4 => {
            const name = response4.name
            if (name === null) return
            $('#actGroups').append(`
                <li>
                    <label>${name}</label>
                    <button id="edGroup${iterator}">редактировать группу</button>
                    <button id="edStudList${iterator}">редактировать список студентов</button>
                    <button id="changStatToArch${iterator}">изменить статус на архивный</button>
                </li>`)
                $(`#edGroup${iterator}`).on('click', () => $.ajax(set(response4)).then(window.location.href = '/edGroup'))
                $(`#edStudList${iterator}`).on('click', () => $.ajax(set(response4)).then(window.location.href = '/edStudList'))
                $(`#changStatToArch${iterator}`).on('click', () => $.ajax({
                    type: 'post',
                    url: 'http://localhost:3000/journal/groupArch',
                    data: JSON.stringify(response4),
                    headers: headers
                }).then(response5 => {
                    console.log(response5)
                    load()
                }))
                iterator++
            })
        }
        for (let id of ids) await $.ajax({
            type: 'get',
            url: `http://localhost:3000/journal/groupsOutOfArch?id=${id}`,
            headers: { 'csrf-prot': csrfProt }
        }).then(message => $('#othGroups').append(`<li>${message.name}</li>`))
    })
})
$('#creatGroup').on('click', () => window.location.href = '/creatGroup')
}
function set(group) { return {
    type: 'post',
    url: '/group',
    data: JSON.stringify(group),
    headers: headers
}
}