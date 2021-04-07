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
            if (data.messages.length) {
                appendMessage(data)
            }
        }
    })
}

// Helper
function getMessageBlockForMe(message) {
    let block = `<li class="replies">
                    <p>${message}</p>
                </li>`
    return block
}

// Helper
function getMessageBlockForOtherUser(message, picUrl, name) {
    let block = `<li class="sent">
                    <img src=${picUrl} width="25" height="25" class="rounded-circle">
                    <p>${message}</p>
                </li>`
    return block
}

function appendMessage(data) {
    messages = data.messages
    for (let i = 0; i < messages.length; i++) {
        let m = messages[i]
        let messageBlock = undefined
        if (m.isMe) messageBlock = getMessageBlockForMe(m.message)
        else messageBlock = getMessageBlockForOtherUser(m.message, data.otherUserInfo.picUrl, `${data.otherUserInfo.fname} ${data.otherUserInfo.lname}`)
        console.log(messageBlock)
        $("#messageList").append(messageBlock)
    }
}

$(document).ready(() => {
    // event listenings
    $("input[name='messageInput']").on('keypress', function (e) {
        // enter
        if (e.which == 13) {
            let message = $(this).val()
            // send message
            sendMessage(message, RECEIVER_ID)
            // clear input
            $(this).val('')
        }
    })

    // click on chat history
    $("li.contact").on('click', function() {
        let otherUserId = $(this).attr('other-user-id')
        window.location = `/chat/${otherUserId}`
    })

    // click book now
    $("#bookNowBtn").on('click', function() {
        window.location = `/book/${RECEIVER_ID}/options`
    })

    // click view profile
    $("#viewProfileBtn").on('click', function() {
        window.location = `/book/${RECEIVER_ID}`
    })

    // retrieve new messages every time interval
    setInterval(retrieveNewMessages, 1000)
})