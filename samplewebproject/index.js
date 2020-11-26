//Adds an event listener to check for a valid email address in the input
document.querySelector("form").addEventListener("submit", (event) => {
    event.preventDefault();

    const { value } = document.querySelector("input");

    const header = document.querySelector("h1");
    if (value.includes("@")) {
        header.innerHTML = "Looks good!";
    } else {
        header.innerHTML = "Invalid email.";
    }
});