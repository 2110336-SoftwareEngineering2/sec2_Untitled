const RECEIVER_ID = $("meta[name='receiverId']").attr("content")

function sendMessage(message, receiverId) {
    if (message == '') return;
    $.ajax({
        url: "/api/chat",
        method: "POST",
        data: { receiverId, message }
    }).done((data) => {
        if (!data.success) alert(data.message)
    }).fail(() => {
        alert("Sending message failed")
    })
}

function retrieveNewMessages() {
    $.ajax({
        url: `/api/chat/${RECEIVER_ID}?onlyNewMessages=true`,
        method: 'GET'
    }).done((data) => {
        if (!data.success) alert(data.message)
        else {
            if (data.messages.length){
                appendMessage(data.messages)
            }
        }
    })
}

// Helper
function getMessageBlockForMe(message) {
    let block = `<div>
                <span>(ME) ${message}</span>
                </div>`
    return block
}

// Helper
function getMessageBlockForOtherUser(message, picUrl, name) {
    let block = `<div>
                <img src=${picUrl}>\
                <span>${name}</span>\
                <span>${message}</span>
                </div>`
    return block
}

function appendMessage(messages) {
    for (let i = 0; i < messages.length; i++) {
        let m = messages[i]
        if (m.isMe) $("div[name='chatContainer'").append(getMessageBlockForMe(m.message))
        else $("div[name='chatContainer'").append(getMessageBlockForOtherUser(m.message, m.sender.picUrl, `${m.sender.fname} ${m.sender.lname}`))
    }
}

$(document).ready(() => {
    // event listenings
    $("input[name='messageInput']").on('keypress', function (e) {
        if (e.which == 13) {
            let message = $(this).val()
            // send message
            sendMessage(message, RECEIVER_ID)
            // clear input
            $(this).val('')
        }
    })

    // retrieve new messages every time interval
    setInterval(retrieveNewMessages, 1000)
})