const socket = io({
    auth: {
        serverOffset: 0,
    },
});
const messages = document.getElementById("homeMessagediv");

//When no users are found
const friendList = document.querySelector(".friendlist");

if (friendList.innerText === '') {
    friendList.innerHTML = "<img class='noUserFoundImage' src='/images/noUsersFound.png'>";
    friendList.classList.add("center");
}


//Selecting a friend
const searchform = document.querySelector(".search");
const myUsername = searchform.getAttribute("myUsername");

const allFriendsList = document.querySelectorAll(".user1");

for (let friend of allFriendsList) {
    friend.addEventListener("click", (e) => {
        messages.innerHTML = "";
        friend.classList.add("clicked");
        setTimeout(() => {
            friend.classList.remove("clicked");
        }, 300)

        const fullname = friend.querySelector("h3").innerText;
        const frdUsername = friend.querySelector("h6").innerText;
        const frdProfileImage = friend.querySelector(".profile img").src;
    
        document.querySelector(".selecteduserprofile img").src = frdProfileImage;
        document.querySelector(".selecteduserdetails h4").innerText = fullname;
        document.querySelector(".selecteduserdetails p").innerText = frdUsername;

        socket.emit("leave all rooms");
        socket.emit("Join Home Room", myUsername, frdUsername);

    })
}

//viewing others profile
const viewProfile = document.querySelector(".selecteduser");


viewProfile.addEventListener("click",(e)=>{
    const otherUsername = viewProfile.querySelector("p").innerHTML;
    console.log(otherUsername);
    window.location.href = "/view-profile/" + otherUsername ; 
})


/*************************************************************Home Chat***************************************************************/
const form = document.getElementById("homeForm");
const input = document.getElementById("homeInput");


form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (input.value) {
        ////////////////////////////////////////////
        const item = document.createElement("div");
        item.classList.add("mymessage");

        const innerItem = document.createElement("span");

        const innerDiv = document.createElement("div");
        innerDiv.classList.add("mynametag");
        innerDiv.innerText = "You";

        innerItem.appendChild(innerDiv);

        // Append the user input value to the span, after the name tag div
        const messageText = document.createTextNode(input.value);
        innerItem.appendChild(messageText);

        // Append the span to the main container div
        item.appendChild(innerItem);
        messages.appendChild(item);
        messages.scrollTo(0, messages.scrollHeight);
        ////////////////////////////////////////////
        
        socket.emit("Home Chat", input.value, myUsername);
        input.value = "";
    }
});

socket.on("Home Chat", (msg, username) => {

    const item = document.createElement("div");
    item.classList.add("othermessage");

    const innerItem = document.createElement("span");

    const innerDiv = document.createElement("div");
    innerDiv.classList.add("othernametag");
    innerDiv.innerText = username;

    innerItem.appendChild(innerDiv);

    // Append the user input value to the span, after the name tag div
    const messageText = document.createTextNode(msg);
    innerItem.appendChild(messageText);

    // Append the span to the main container div
    item.appendChild(innerItem);
    messages.appendChild(item);
    messages.scrollTo(0, messages.scrollHeight);
});  


// Handle recovered messages
socket.on("Recover home messages", (msg, username) => {
    const item = document.createElement("div");
    if (myUsername === username) {
  
      item.classList.add("mymessage");
      const innerItem = document.createElement("span");
      const innerDiv = document.createElement("div");
      innerDiv.classList.add("mynametag");
      innerDiv.innerText = "You";
      innerItem.appendChild(innerDiv);
      const messageText = document.createTextNode(msg);
      innerItem.appendChild(messageText);
      item.appendChild(innerItem);
  
  
    } else {
  
      item.classList.add("othermessage");
      const innerItem = document.createElement("span");
      const innerDiv = document.createElement("div");
      innerDiv.classList.add("othernametag");
      innerDiv.innerText = username;
      innerItem.appendChild(innerDiv);
      const messageText = document.createTextNode(msg);
      innerItem.appendChild(messageText);
      item.appendChild(innerItem);
  
    }
  
    messages.appendChild(item);
    messages.scrollTo(0, messages.scrollHeight);
  });
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//Mobile Code :Responsive
let close = document.querySelector(".menu");

const usersclickbox = document.querySelectorAll(".user1");
const userlist = document.querySelector(".secondinnerdiv");
const chatarea = document.querySelector(".seconddiv");

for (let user of usersclickbox){
    user.addEventListener("click",(e)=>{
        userlist.classList.remove("newshow");
        userlist.classList.add("newhide");
        chatarea.classList.add("newshow");
        chatarea.classList.remove("newhide");
    })
}

close.addEventListener("click",(e)=>{
    userlist.classList.remove("newhide");
    userlist.classList.add("newshow");
    chatarea.classList.add("newhide");
    chatarea.classList.remove("newshow");
})