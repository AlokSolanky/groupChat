const form = document.getElementById("form");

window.onload = () => {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;

    const user = { email, password };

    try {
      let response = await axios.post(
        "http://localhost:3000/user/signin",
        user
      );
      console.log(response.data.result);
      document.querySelector(".error").innerHTML = response.data.result;
      if (response.data.success) {
        localStorage.setItem("token", response.data.token);
        localStorage.removeItem("grpId");
        location.replace(
          // "F:/Sharpener/nodejs/groupChat/public/html/index.html"
          "../html/index.html"
        );
      }
    } catch (err) {
      console.log(err);
    }
  });
};
