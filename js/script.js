document.addEventListener("DOMContentLoaded", () => {

  const startInput = document.getElementById("startDate");
  const endInput = document.getElementById("endDate");
  const button = document.getElementById("getImagesBtn");
  const gallery = document.getElementById("gallery");
  const factBox = document.getElementById("spaceFact");

  const API_KEY = "NO811u5auXP3Jcwncizy02ihkx10Of3bg3nw736F"; // Replace with your key for full power

  /* SAFE SETUP */
  if (typeof setupDateInputs === "function") {
    setupDateInputs(startInput, endInput);
  }

  /* RANDOM SPACE FACT */
  const facts = [
    "A day on Venus is longer than a year on Venus.",
    "Neutron stars spin up to 600 times per second.",
    "There are more stars than grains of sand on Earth.",
    "One million Earths fit inside the Sun.",
    "Space is completely silent.",
    "Jupiter’s storm is bigger than Earth.",
    "Footprints on the Moon last millions of years."
  ];

  factBox.textContent = facts[Math.floor(Math.random() * facts.length)];

  /* BUTTON CLICK */
  button.addEventListener("click", () => {
    fetchImages(startInput.value, endInput.value);
  });

  /* FETCH DATA */
  async function fetchImages(start, end) {

    if (!start || !end) {
      gallery.innerHTML = "<p>⚠️ Please select both dates</p>";
      return;
    }

    gallery.innerHTML = "<p>🔄 Loading space photos...</p>";

    try {
      const res = await fetch(
        `https://api.nasa.gov/planetary/apod?api_key=${API_KEY}&start_date=${start}&end_date=${end}`
      );

      if (!res.ok) throw new Error("Failed to fetch images");

      const data = await res.json();

      if (data.error) throw new Error(data.error.message);

      const items = Array.isArray(data) ? data.reverse() : [data];

      displayGallery(items);

    } catch (err) {
      gallery.innerHTML = `<p>❌ ${err.message}</p>`;
    }
  }

  /* DISPLAY GALLERY */
  function displayGallery(data) {

    gallery.innerHTML = "";

    const images = data.filter(item => item.media_type === "image");

    if (images.length === 0) {
      gallery.innerHTML = "<p>No images found</p>";
      return;
    }

    images.forEach(item => {

      const card = document.createElement("div");
      card.className = "gallery-item";

      card.innerHTML = `
        <img src="${item.url}" alt="${item.title}">
        <p><strong>${item.title}</strong></p>
        <p>${item.date}</p>
      `;

      card.addEventListener("click", () => openModal(item));

      gallery.appendChild(card);
    });
  }

  /* MODAL */
  function openModal(item) {

    const modal = document.createElement("div");
    modal.className = "modal";

    modal.innerHTML = `
      <div class="modal-content">
        <span class="close">&times;</span>
        <img src="${item.hdurl || item.url}">
        <h2>${item.title}</h2>
        <p>${item.date}</p>
        <p>${item.explanation}</p>
      </div>
    `;

    document.body.appendChild(modal);

    modal.querySelector(".close").onclick = () => modal.remove();

    modal.onclick = (e) => {
      if (e.target === modal) modal.remove();
    };
  }

});