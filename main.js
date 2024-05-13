const data = {
    "number_of_items": 8,
    "items": [
        {
            "value": "10%",
            "color": "#db7093"
        },
        {
            "value": "5€",
            "color": "#20b2aa"
        },
        {
            "value": "15%",
            "color": "#d63e92"
        },
        {
            "value": "8€",
            "color": "#daa520"
        },
        {
            "value": "25%",
            "color": "#ff340f"
        },
        {
            "value": "10€",
            "color": "#ff7f50"
        },
        {
            "value": "30%",
            "color": "#3cb371"
        },
        {
            "value": "20€",
            "color": "#4169e1"
        }
    ]
}

let wheel = document.querySelector('.wheel')
let spinBtn = document.querySelector('.spinBtn')
let container = document.querySelector('.container')
let init_text = document.querySelector('.text')
let value = Math.ceil(Math.random() * 3600)

let number_of_items = data.number_of_items
let items = data.items

let cookie = getValueFromCookie()
if(cookie != ""){
    makeMessage(cookie)
}else{
    createWheel()
    spinBtn.addEventListener('click', onClickListener);
}

function onClickListener(){
    // genera un angolo casuale di rotazione
    let randomRotation = Math.ceil(Math.random() * 3600);
    //calcolo l'angolo totale di rotazione
    let totalRotation = value + randomRotation;

    wheel.style.transform = "rotate(" + totalRotation + "deg)";

    wheel.removeEventListener('transitionend', rotationComplete);
    wheel.addEventListener('transitionend', rotationComplete);

    value = totalRotation;
}


function createWheel(){
    container = document.createElement('div');
    container.classList.add('container');
    
    spinBtn = document.createElement('div');
    spinBtn.classList.add('spinBtn');
    spinBtn.textContent = 'Spin';

    wheel = document.createElement('div');
    wheel.classList.add('wheel');

    container.appendChild(spinBtn);
    container.appendChild(wheel);

    document.body.appendChild(container);
    items.forEach( (item, idx) => {
        console.log(item, idx)
        createWheelItem(idx +1, item.value, item.color)
    })
}

function createWheelItem(idx, value, color){
    let divElement = document.createElement('div');
    divElement.classList.add('number');
    divElement.style.setProperty('--i', `${idx}`);
    divElement.style.setProperty('--clr', `${color}`);

    let spanElement = document.createElement('span');
    spanElement.textContent = `${value}`;
    divElement.appendChild(spanElement);
    wheel.appendChild(divElement)
}

function rotationComplete(event) {
    if (event.propertyName === 'transform') {
        let spans = document.querySelectorAll('.number span');

        let minY = Number.MAX_SAFE_INTEGER;
        let topmostSpan = null;

        spans.forEach(function(span) {
            let rect = span.getBoundingClientRect();
            
            if (rect.top < minY) {
                minY = rect.top;
                topmostSpan = span;
            }
        });

        // console.log("elemento più in alto", topmostSpan.textContent);
        setTimeout(() => {
            container.style.animation = 'fadeOut 1s forwards';
            makeMessage(topmostSpan.textContent)
        }, 1000)
    }
}

function makeMessage(extractedValue){
    if(container){
        container.classList.add('hidden');
    }
    init_text.classList.add('hidden')
    let color = getColorFromValue(extractedValue)
    console.log(color)
    let messageContainer = document.querySelector('.message_container');

    let messageItem = document.createElement('div');
    messageItem.classList.add('message_item');
    messageItem.style.border = `10px dashed ${color}`

    let message = document.createElement('div');
    message.classList.add('message');
    message.style.background = `${color}`

    let spanElement = document.createElement('span');
    spanElement.textContent = "" + extractedValue;

    message.appendChild(spanElement);

    messageItem.appendChild(message);

    let messageContent = document.createElement('div');
    messageContent.classList.add('message_content');
    messageContent.textContent = "Fai uno screenshot e presentalo in negozio";

    messageContainer.appendChild(messageItem);
    messageContainer.appendChild(messageContent);

    addCookie(extractedValue)

}

function getColorFromValue(value){
    let color = ""
    items.forEach( (item) => {
        if(item.value == value){
            color = item.color
        }
    })
    return color
}

function addCookie(value){
    document.cookie = "value="+value
}

function getValueFromCookie(){
    let result = ""
    let cookie = document.cookie
    if(cookie){
        cookie = cookie.split(";")
        let value = cookie[0].split("=")
        result = value[1]
    }
    return result
}