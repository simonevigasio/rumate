// Function used by visualizeAdv to get a filter value if it is checked by the user
function getValue(elementId){
    if(document.getElementById(elementId).checked){
        return document.getElementById(elementId).value;
    }
    return "None";
}

/*
    Function that visualize the advertisement stored in the Database
    The visualization can be sorted and filtered by the user, changing the value of parameter
*/
async function visualizeAdv() {
    const parameter = {
        sort : document.getElementById("sortAd").value,
        roomFilter:{
            Single  : getValue('filterRoomSingle'),
            Double  : getValue('filterRoomDouble'),
            Triple  : getValue('filterRoomTriple')
        },
        sexFilter:{
            Male  : getValue('filterSexMale'),
            Female  : getValue('filterSexFemale'),
            Mixed  : getValue('filterSexMixed')
        },
        residenceFilter:{
            Povo  : getValue('filterResidencePovo'),
            Bondone  : getValue('filterResidenceBondone'),
            Sardagna : getValue('filterResidenceSardagna'),
            Centro_storico_Piedicastello : getValue('filterResidenceCentro_storico_Piedicastello'),
            Meano  : getValue('filterResidenceMeano'),
            Argentario  : getValue('filterResidenceArgentario'),
            San_Giuseppe_Santa_Chiara : getValue('filterResidenceSan_Giuseppe_Santa_Chiara'),
            Oltrefersina  : getValue('filterResidenceOltrefersina'),
            Villazzano : getValue('filterResidenceVillazzano'),
            Mattarello  : getValue('filterResidenceMattarello'),
            Ravina_romagnano  : getValue('filterResidenceRavina_romagnano'),
            Oltrecastello  : getValue('filterResidenceOltrecastello')
        }
    };

    try {
        // POST request to get the advertisement from the Database
        const ul = document.getElementById('ads');
        resp = await fetch("../advertisements", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(parameter),
        });

        // remove the advertisement which are now displayed
        while (ul.firstChild) {
            ul.removeChild(ul.lastChild);
        }

        // visualize the new advertisement on the front-end
        json = await resp.json();
        json.map(function(adv) {
            let li = document.createElement('li');
            let span = document.createElement('span');
            let a = document.createElement('a');
            a.href = `http://localhost:3000/advertisements/${adv._id}`;
            a.textContent = adv.title;
            span.appendChild(a);
            li.appendChild(span);
            ul.appendChild(li);
        });
    }
    catch (ex) {
        //  in case of exception from the backend request, log the error
        console.error(ex);
    }
}
/*
    This function fire when the user want to sort and/or filter the advertisement
    In other words, the user want to visualize again because the parameter of visualization are changed
*/
async function sort_and_filter() {
    try {
        visualizeAdv()
    }   
    catch (ex) {
        console.error(ex);
    }
}

/* function used to create an account */
async function signup() {

    /* get the username and password from the form */
    const user = {
        username: document.getElementById("signupUsername").value,
        password: document.getElementById("signupPassword").value,
    }

    try {

        /* POST request to backend asking to create a new account with username and password */
        resp = await fetch("../authenticate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(user),
        });
        
        /* from the header of the response extract the token for future access */
        const token = resp.headers.get('X-Auth-Token');

        /* parse the boby af the response into json format */
        json = await resp.json();

        /* save token and username into localStorage */
        localStorage.setItem("token", token);
        localStorage.setItem("username", json.username);
    }
    catch (ex) {

        /* in case of exception from the backend request, log the error */
        console.error(ex);
    }
}

/* function used to login into the app using a specific username */
async function login() {

    /* get the username and password from the form */
    const user = {
        username: document.getElementById("loginUsername").value,
        password: document.getElementById("loginPassword").value,
    }

    try {

        /* POST request to backend asking to login with a specific account matching username */
        resp = await fetch("../users", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(user),
        });
        
        /* parse the boby af the response into json format */
        json = await resp.json();

        /* save token and username into localStorage */
        localStorage.setItem("token", json.token);
        localStorage.setItem("username", user.username);
    } 
    catch (ex) {

        /* in case of exception from the backend request, log the error */
        console.error(ex);
    }
}
/*
    This function create a new advertisement and try to store it in the Database
*/
async function publishAd() {

    // create a new advertisement, reading the input send by the user in the front-end
    advertisement_config = {
        owner: localStorage.getItem("username"),
        title: document.getElementById("publishAdTitle").value,
        description: document.getElementById("publishAdDescription").value,
        prize: document.getElementById("publishAdPrize").value,
        room: document.getElementById("publishAdRoom").value,
        flat_sex: document.getElementById("publishAdFlat_sex").value,
        residence_zone: document.getElementById("publishAdResidence_zone").value,
        expiry_date: moment(document.getElementById("publishAdExpiry_date").value).format("YYYY MM DD"),
        roommate: document.getElementById("publishAdRoommate").value
    };

    try {
        // POST request to upload the advertisement on the Database
        resp = await fetch("../advertisements/publish", {
            method: "POST",
            headers: { "Content-Type": "application/json", "X-Auth-Token": localStorage.getItem("token") },
            body: JSON.stringify(advertisement_config),
        })
        json = await resp.json();
        console.log(json);
    }   
    catch (ex) {
        // in case of exception from the backend request, log the error 
        console.error(ex);
    }
}

async function logout() {
    localStorage.clear();
    try {
        const resp = await fetch("../users/logout", {
            method: "POST",
            headers: { "Content-Type": "application/json"},
        })
        const json = await resp.json();
        console.log(json);
    }
    catch (ex) {
        console.error(ex);
    }
}

// function generateRandomHexString(length) {
//     const values = new Uint8Array(length / 2);
//     window.crypto.getRandomValues(values);
//     return Array.from(values, (byte) => ('0' + byte.toString(16)).slice(-2)).join('');
// }

// async function signWithGoogle2() {
//     // the client id from GCP
//     const client_id = "1003571230667-cevckcppil6551ho4lanli4rb8ra0v2q.apps.googleusercontent.com"

//     // create a CSRF token and store it locally
//     const state = generateRandomHexString(16);
//     localStorage.setItem("latestCSRFToken", state);
        
//     // redirect the user to Google
//     const link = `https://accounts.google.com/o/oauth2/auth?scope=https://www.googleapis.com/auth/cloud-platform&response_type=code&access_type=offline&state=${state}&redirect_uri=${window.location.origin}/authenticate/google/callback&client_id=${client_id}`;
//     window.location.assign(link);
// }

async function visualizeChat() {
    const users = {
        sender: localStorage.getItem("username"),
        receiver: document.getElementById("receiverVc").value,
    };

    try {
        // GET request to visualize the chat corresponding to the two users given in the front-end
        const ul = document.getElementById('chat');
        const queryString = new URLSearchParams(users).toString();
        const resp = await fetch(`../chats/messages?${queryString}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        });

        while (ul.firstChild) {
            ul.removeChild(ul.lastChild);
        }

        const json = await resp.json();
        json.forEach(chat => {
            let li = document.createElement('li');
            li.textContent = chat.content;
            ul.appendChild(li);
        });
    } catch (ex) {
        // in case of exception from the backend request, log the error 
        console.error(ex);
    }
}

async function showChats() {
    const user = localStorage.getItem("username");

    try {
        // GET request to visualize all chats corresponding to the user given in the front-end
        const ul = document.getElementById('chatsList');
        const queryString = new URLSearchParams(user).toString();
        const resp = await fetch(`../chats/UserChats?${queryString}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        });

        while (ul.firstChild) {
            ul.removeChild(ul.lastChild);
        }

        const json = await resp.json();
        json.forEach(chat => {
            let li = document.createElement('li');
            if(chat.receiverId == user){
                li.textContent = chat.senderId;
            }else li.textContent = chat.receiverId;
            ul.appendChild(li);
        });
    } catch (ex) {
        // in case of exception from the backend request, log the error 
        console.error(ex);
    }
}

async function publishMessage() {
    // create a new message, reading the input given by the user in the front-end
    const message_config = {
        senderId: localStorage.getItem("username"),
        receiverId: document.getElementById("receiverAm").value,
        content: document.getElementById("msgContent").value,
        timestamp: new Date().toISOString()
    };

    try {
        // POST request to upload the message on the Database
        resp = await fetch("../chats/addMessage", {
            method: "POST",
            headers: { "Content-Type": "application/json", "X-Auth-Token": localStorage.getItem("token") },
            body: JSON.stringify(message_config),
        })
        json = await resp.json();
        console.log(json);
    }   
    catch (ex) {
        // in case of exception from the backend request, log the error 
        console.error(ex);
    }
}

visualizeAdv();