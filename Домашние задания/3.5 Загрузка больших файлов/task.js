const form = document.getElementById("form");
const progress = document.getElementById("progress");

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const fileInput = document.getElementById("file");
  if (!fileInput.files || fileInput.files.length === 0) return;

  progress.value = 0;

  const xhr = new XMLHttpRequest();
  const formData = new FormData(form);

  xhr.upload.addEventListener("progress", (ev) => {
    if (ev.lengthComputable && ev.total > 0) {
      progress.value = ev.loaded / ev.total;
    }
  });

  xhr.addEventListener("load", () => {
    if (xhr.status >= 200 && xhr.status < 300) {
      progress.value = 1;
    }
  });

  xhr.addEventListener("error", () => {
    progress.value = 0;
  });

  xhr.open("POST", form.action);
  xhr.send(formData);
});
