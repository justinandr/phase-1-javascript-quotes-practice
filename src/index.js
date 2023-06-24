window.addEventListener('DOMContentLoaded', () => {
    renderQuotes()
    document.getElementById('new-quote-form').addEventListener('submit', handleNewQuote)
})

function renderQuotes(){
    document.getElementById('quote-list').innerHTML = ''
    fetch('http://localhost:3000/quotes?_embed=likes')
    .then(res => res.json())
    .then(data => {
        console.log(data)
        data.forEach(element => {
            const li = document.createElement('li')
            const bq = document.createElement('blockquote')
            const p = document.createElement('p')
            const footer = document.createElement('footer')
            const br = document.createElement('br')
            const likeButton = document.createElement('button')
            const span = document.createElement('span')
            const deleteButton = document.createElement('button')

            li.classList.add('quote-card')
            bq.classList.add('blockquote')
            p.classList.add('mb-0')
            footer.classList.add('blockquote-footer')
            likeButton.classList.add('btn-success')
            likeButton.id = element.id
            deleteButton.classList.add('btn-danger')
            deleteButton.id = element.id

            p.textContent = element.quote
            footer.textContent = element.author
            span.textContent = element.likes.length
            likeButton.textContent = `Likes: `
            likeButton.addEventListener('click', handleLike)
            deleteButton.textContent = 'Delete'
            deleteButton.addEventListener('click', handleDelete)

            likeButton.appendChild(span)
            bq.append(p, footer, br, likeButton, deleteButton)
            li.append(bq)
            document.getElementById('quote-list').append(li)
        });

    })
}

function handleNewQuote(e){
    e.preventDefault()
    const obj = {}
    obj.quote = e.target[0].value
    obj.author = e.target[1].value

    fetch('http://localhost:3000/quotes', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json'
        },
        body: JSON.stringify(obj)
    })
    .then(res => res.json())
    .then(data => {
        document.getElementById('new-quote-form').reset()
        renderQuotes()
    })
}

function handleDelete(e){
    e.preventDefault()
    fetch(`http://localhost:3000/quotes/${e.target.id}`, {
        method: 'DELETE'
    })
    .then(res => res.json())
    .then(data => renderQuotes())
}

function handleLike(e){
    e.preventDefault()
    console.log(e)
    const obj = {}
    obj.quoteId = parseInt(e.target.id)
    obj.createdAt = Math.floor(Date.now() / 1000)

    fetch(`http://localhost:3000/likes`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json'
        },
        body: JSON.stringify(obj)
    })
    .then(res => res.json())
    .then(data => renderQuotes())
}