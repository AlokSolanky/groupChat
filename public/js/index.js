window.onload = async () => {
  const userName = document.getElementById("userName");
  try {
    let nameResponse = await axios.get(
      "http://localhost:3000/user/getLoginUser",
      { headers: { Authorization: localStorage.getItem("token") } }
    );
    userName.innerHTML = nameResponse.data.name;
  } catch (error) {
    console.log(error);
  }

  const msgWind = document.querySelector(".message_window");
  const userWind = document.querySelector(".userPanel");
  try {
    let getGroups = await axios.get("http://localhost:3000/grp/getGroup", {
      headers: { Authorization: localStorage.getItem("token") },
    });

    if (getGroups.data.result.length === 0) {
      localStorage.removeItem("grpId");
    }
    const grpContainer = document.getElementById("grp_list");
    for (let grp of getGroups.data.result) {
      let li = document.createElement("button");

      li.setAttribute("class", "users");

      let nameTextNode = document.createTextNode(`${grp.groupName}`);
      li.appendChild(nameTextNode);
      li.setAttribute("id", grp.id);
      grpContainer.appendChild(li);
      li.addEventListener("click", async (e) => {
        localStorage.setItem("grpId", grp.id);
        // loadGrpContent(grp.id);
        location.reload();
      });
    }

    let response;
    if (localStorage.getItem("grpId") == null) {
      alert("No groups select, choose one");
    } else {
      response = await axios.get(
        `http://localhost:3000/user/getUser?grpId=${localStorage.getItem(
          "grpId"
        )}`
      );
    }
    const users = response.data.result;
    const adminId = response.data.admin;
    for (let user of users) {
      let position;
      let del = document.createElement("button");
      del.setAttribute("class", "delete");
      del.setAttribute("title", "Delete this user");
      let li = document.createElement("li");

      let createAdmin = document.createElement("button");
      createAdmin.setAttribute("class", "delete");
      createAdmin.setAttribute("title", "Make him admin");

      let addPlayer = document.createElement("button");
      addPlayer.setAttribute("class", "delete");
      addPlayer.setAttribute("title", "Add participant to the group");

      li.setAttribute("class", "users");

      if (user.groupUser.isAdmin) {
        position = "Admin";
        let nameTextNode = document.createTextNode(`${user.name}: ${position}`);
        li.appendChild(nameTextNode);
        addPlayer.innerHTML = "+";
        li.appendChild(addPlayer);
        addPlayer.addEventListener("click", async (e) => {
          addParticipant(user.id);
        });
      } else {
        position = "Member";
        del.innerHTML = "X";
        let nameTextNode = document.createTextNode(`${user.name}: ${position}`);
        li.appendChild(nameTextNode);
        li.appendChild(del);
        del.addEventListener("click", async (e) => {
          // localStorage.removeItem("grpId");
          deleteUser(user.id);
        });
        createAdmin.innerHTML = "Make Admin";

        createAdmin.addEventListener("click", async (e) => {
          makeAdmin(user.id);
        });
        li.appendChild(createAdmin);
      }

      userWind.appendChild(li);
    }

    // let chatLS = localStorage.getItem("chats");
    // let chats;
    // if (chatLS === null || JSON.parse(chatLS).length === 0) {
    //   let chatResponse = await axios.get(
    //     `http://localhost:3000/chat/getChat?msgId=-1&grpId=${localStorage.getItem(
    //       "grpId"
    //     )}`
    //   );
    //   chats = chatResponse.data.result;
    //   localStorage.setItem("chats", JSON.stringify(chats));
    // } else {
    //   chatLS = JSON.parse(chatLS);
    //   let msgId = chatLS[chatLS.length - 1].id;
    //   let chatResponse = await axios.get(
    //     `http://localhost:3000/chat/getChat?msgId=${msgId}&grpId=${localStorage.getItem(
    //       "grpId"
    //     )}`
    //   );
    //   chats = chatResponse.data.result;
    //   let mergedChats = [...chatLS, ...chats];
    //   localStorage.setItem("chats", JSON.stringify(mergedChats));
    // }

    // chats = localStorage.getItem("chats");
    // chats = JSON.parse(chats);

    let chatResponse = await axios.get(
      `http://localhost:3000/chat/getChat?msgId=-1&grpId=${localStorage.getItem(
        "grpId"
      )}`
    );
    chats = chatResponse.data.result;
    if (chats.length <= 0) alert("no chats found");
    else {
      for (let chat of chats) {
        const time = chat.createdAt.split(".")[0].split("T")[1];
        let li = document.createElement("li");

        li.setAttribute("class", "users");

        let nameTextNode = document.createTextNode(
          `${chat.user.name}: ${chat.msg}`
        );
        li.appendChild(nameTextNode);

        msgWind.appendChild(li);
      }
    }
  } catch (error) {
    console.log(error);
  }
};
const frm = document.getElementById("form");
frm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const msgToSend = document.getElementById("msg").value;
  document.getElementById("msg").value = "";
  const chat = { msgToSend, grpId: localStorage.getItem("grpId") };
  let msgResponse = await axios.post(
    "http://localhost:3000/chat/sendchat",
    chat,
    { headers: { Authorization: localStorage.getItem("token") } }
  );
  if (msgResponse.data.success) {
    const msgWind = document.querySelector(".message_window");
    let li = document.createElement("li");

    li.setAttribute("class", "users");

    let nameTextNode = document.createTextNode(
      `${msgResponse.data.userName}: ${msgResponse.data.result.msg}`
    );
    li.appendChild(nameTextNode);

    msgWind.appendChild(li);
  }
});

const grp_btn = document.querySelector(".group");
grp_btn.addEventListener("click", async (e) => {
  const grp = prompt("Enter the Name of Group");

  try {
    let grpResponse = await axios.post(
      "http://localhost:3000/grp/createGrp",
      { grp },
      { headers: { Authorization: localStorage.getItem("token") } }
    );
    alert(grpResponse.data.msg);
    if (grpResponse.data.success) {
      const grpContainer = document.getElementById("grp_list");

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

const join_btn = document.querySelector(".join_group");
join_btn.addEventListener("click", async (e) => {
  let grpId = prompt("Enter the id of group");
  grpId = grpId - 0;
  let joinGrpResponse = await axios.post(
    "http://localhost:3000/grp/joinGroup",
    { grpId },
    { headers: { Authorization: localStorage.getItem("token") } }
  );
});

function loadGrpContent(grp_id) {}

//function to delete user
async function deleteUser(userId) {
  try {
    let response = await axios.delete(
      `http://localhost:3000/grp/deleteUser?userId=${userId}&grpId=${localStorage.getItem(
        "grpId"
      )}`,
      { headers: { Authorization: localStorage.getItem("token") } }
    );
    alert(response.data.message);
    if (response.data.success) {
      location.reload();
    }
  } catch (error) {
    alert("Could not delete");
  }
}

//function to make an user the admin of the group
async function makeAdmin(userId) {
  try {
    let adminResponse = await axios.put(
      `http://localhost:3000/grp/makeAdmin?grpId=${localStorage.getItem(
        "grpId"
      )}&userId=${userId}`,
      null,
      { headers: { Authorization: localStorage.getItem("token") } }
    );
    alert(adminResponse.data.message);
    if (adminResponse.data.success) location.reload();
  } catch (err) {
    console.log(err.message);
  }
}

//function to add participants in a group
async function addParticipant(uid) {
  let userId = prompt("Enter the id of user");
  userId = userId - 0;
  grpId = localStorage.getItem("grpId") - 0;
  let addResponse = await axios.post(
    `http://localhost:3000/grp/joinGroup/${grpId}`,
    { userId },
    { headers: { Authorization: localStorage.getItem("token") } }
  );
  if (addResponse.data.success) {
    alert(addResponse.data.msg);
    location.reload();
  }
}
