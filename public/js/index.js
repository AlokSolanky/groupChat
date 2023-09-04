window.onload = async () => {
  const msgWind = document.querySelector(".message_window");

  try {
    let response = await axios.get("http://localhost:3000/user/getUser");
    const users = response.data.result;

    console.log(users);
    for (let user of users) {
      let li = document.createElement("li");

      li.setAttribute("class", "users");
      let nameTextNode = document.createTextNode(`${user.name} joined`);
      li.appendChild(nameTextNode);

      msgWind.appendChild(li);
    }

    const frm = document.getElementById("form");
    frm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const msgToSend = document.getElementById("msg").value;
      const chat = { msgToSend };
      let msgResponse = await axios.post(
        "http://localhost:3000/chat/sendchat",
        chat,
        { headers: { Authorization: localStorage.getItem("token") } }
      );
    });
  } catch (error) {}
};
