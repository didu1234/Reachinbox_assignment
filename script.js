// Define signIn function
function signIn() {
    let oauth2Endpoint = "https://accounts.google.com/o/oauth2/v2/auth";

    let form = document.createElement('form');
    form.setAttribute('method', 'GET');
    form.setAttribute('action', oauth2Endpoint);

    let params = {
        "client_id": "532551466905-tohieiu5egeidjno4676s039lcvgg4ol.apps.googleusercontent.com", 
        "redirect_uri": "http://127.0.0.1:5500/profile.html", 
        "response_type": "token",
        "scope": "https://mail.google.com",
        "include_granted_scopes": 'true',
        'state': 'pass-through-value'
    };

    for (let p in params) {
        let input = document.createElement('input');
        input.setAttribute('type', 'hidden');
        input.setAttribute('name', p);
        input.setAttribute('value', params[p]);
        form.appendChild(input);
    }

    document.body.appendChild(form);
    form.submit();
}

window.signIn = signIn;
