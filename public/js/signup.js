window.onload = () => {
  const form = document.getElementById("form");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const phone = document.getElementById("phone").value;
    const password = document.getElementById("password").value;

    const user = { name, email, phone, password };
    let response = await axios.post("http://localhost:3000/user/signup", user);
    console.log("working");
    console.log(response.data);
  });
};
