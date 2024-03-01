function getCookie(cname) {
    let name = cname + "=";
    let ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}
var authToken = getCookie("authToken")

if (authToken) {
    console.log("Authentication token found: ");
} else {
    console.log("Authentication token not found.");
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