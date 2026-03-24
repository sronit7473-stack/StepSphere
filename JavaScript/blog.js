const buttons = document.querySelectorAll(".toggle-btn");
const contents = document.querySelectorAll(".content");

buttons.forEach(button => {
  button.addEventListener("click", () => {
    const targetId = button.getAttribute("data-target");
    const targetContent = document.getElementById(targetId);

    // Hide all contents except the clicked one
    contents.forEach(content => {
      if (content !== targetContent) {
        content.style.display = "none";
      }
    });

    // Toggle clicked content
    if (targetContent.style.display === "block") {
      targetContent.style.display = "none";
    } else {
      targetContent.style.display = "block";
    }
  });
});

