const formLogin = document.querySelector('#login form')
const email = document.getElementById('email')
const password = document.getElementById('password')
const loginError = document.getElementById('login-error')

const postLogin = (data) => fetch('http://localhost:5678/api/users/login', {
    method: 'POST',
    body: JSON.stringify(data),
    headers: { 'Content-Type': 'application/json' }
}).then(res => {
    if (res.status > 299 || res.status < 200) {
        throw new Error()
    }
    return res.json()
})


formLogin.addEventListener('submit', e => {
    e.preventDefault()

    postLogin({ email: email.value, password: password.value })
        .then(data => {
            loginError.innerHTML = ''
            localStorage.token = data.token
            window.location.href = `${window.location.origin}/index.html`
        }).catch(() => {
            loginError.innerHTML = "Erreur dans l'identifiant ou le mot de passe"
        })
})