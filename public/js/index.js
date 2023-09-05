window.onload = async () => {
  const msgWind = document.querySelector(".message_window");
  const userWind = document.querySelector(".userPanel");
  // setInterval(async () => {
  // userWind.innerHTML = "";
  // msgWind.innerHTML = "";
  try {
    let getGroups = await axios.get("http://localhost:3000/grp/getGroup", {
      headers: { Authorization: localStorage.getItem("token") },
    });
    // const groups = getGroups.data.result;
    console.log(getGroups.data.result.groupName);
    const grpContainer = document.getElementById("grp_list");
    for (let grp of getGroups.data.result) {
      let li = document.createElement("button");

      li.setAttribute("class", "users");

      let nameTextNode = document.createTextNode(`${grp.groupName}`);
      li.appendChild(nameTextNode);
      li.addEventListener("click", async (e) => {});
      li.setAttribute("id", grp.id);
      grpContainer.appendChild(li);
    }

    let response = await axios.get("http://localhost:3000/user/getUser");
    const users = response.data.result;

    for (let user of users) {
      let li = document.createElement("li");

      li.setAttribute("class", "users");
      let nameTextNode = document.createTextNode(`${user.name} joined`);
      li.appendChild(nameTextNode);

      userWind.appendChild(li);
    }

    let chatLS = localStorage.getItem("chats");
    console.log(JSON.parse(chatLS).length);
    let chats;
    if (chatLS === null || JSON.parse(chatLS).length === 0) {
      let chatResponse = await axios.get(
        `http://localhost:3000/chat/getChat?msgId=-1`
      );
      chats = chatResponse.data.result;
      localStorage.setItem("chats", JSON.stringify(chats));
    } else {
      chatLS = JSON.parse(chatLS);
      let msgId = chatLS[chatLS.length - 1].id;
      let chatResponse = await axios.get(
        `http://localhost:3000/chat/getChat?msgId=${msgId}`
      );
      chats = chatResponse.data.result;
      let mergedChats = [...chatLS, ...chats];
      localStorage.setItem("chats", JSON.stringify(mergedChats));
    }

    chats = localStorage.getItem("chats");
    chats = JSON.parse(chats);
    if (chats.length <= 0) alert("no chats found");
    else {
      for (let chat of chats) {
        const time = chat.createdAt.split(".")[0].split("T")[1];
        let li = document.createElement("li");

        li.setAttribute("class", "users");

        let nameTextNode = document.createTextNode(`${chat.msg} ${time}`);
        li.appendChild(nameTextNode);

        msgWind.appendChild(li);
      }
    }
  } catch (error) {
    console.log(error);
  }
  // }, 1000);
};
const frm = document.getElementById("form");
frm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const msgToSend = document.getElementById("msg").value;
  document.getElementById("msg").value = "";
  const chat = { msgToSend };
  let msgResponse = await axios.post(
    "http://localhost:3000/chat/sendchat",
    chat,
    { headers: { Authorization: localStorage.getItem("token") } }
  );
  console.log("sended", msgResponse);
});

const grp_btn = document.querySelector(".group");
grp_btn.addEventListener("click", async (e) => {
  console.log("clicked");
  const grp = prompt("Enter the Name of Group");

  try {
    let grpResponse = await axios.post(
      "http://localhost:3000/grp/createGrp",
      { grp },
      { headers: { Authorization: localStorage.getItem("token") } }
    );
    console.log(grpResponse);
    alert(grpResponse.data.msg);
    if (grpResponse.data.success) {
      const grpContainer = document.getElementById("grp_list");
      console.log(grpContainer);

      let li = document.createElement("button");

      li.setAttribute("class", "users");

      let nameTextNode = document.createTextNode(
        `${grpResponse.data.result.groupName}`
      );
      li.appendChild(nameTextNode);

      li.setAttribute("id", grpResponse.data.result.id);
      grpContainer.appendChild(li);

      li.addEventListener("click", async (e) => {});
    }
  } catch (error) {
    console.log(error);
  }
});
