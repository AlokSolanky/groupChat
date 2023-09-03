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
      document.querySelector(".error").innerHTML = response.data.result;
      if (response.data.success) {
        localStorage.setItem("token", response.data.token);
        location.replace(
          "F:/Sharpener/nodejs/fullexpensetracker2/frontend/index.html"
        );
      }
    } catch (err) {
      console.log(err);
    }
  });
};
