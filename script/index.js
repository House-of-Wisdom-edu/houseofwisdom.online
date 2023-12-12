function getCookie(cookieName) {
    const cookies = document.cookie.split(';');

    for (const cookie of cookies) {
        const [name, value] = cookie.split('=').map(part => part.trim());

        if (name === cookieName) {
            return value;
        }
    }

    return null;
}

const authToken = getCookie('authToken');

if (authToken) {
    console.log('Auth Token:', authToken);
} else {
    console.log('Auth Token not found.');
}



const apiUrl = `https://houseofwisdom.onrender.com/users/user`;

fetch(apiUrl, {
    method: 'GET',
    headers: {
        'Authorization': `${authToken}`,
        'Content-Type': 'application/json',
    },
})
    .then(response => response.json())
    .then(data => {
        document.getElementById("fullName").textContent = data.fullName;
        document.getElementById("photoId").src = data.photourl;
    })
    .catch(error => {
        console.log(error.message);
    });