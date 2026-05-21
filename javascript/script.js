const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");
const emptyDestinations = document.getElementById("emptyDestinations");
const destinationCards = document.getElementById("destinationCards");
const galleryItems = Array.from(document.querySelectorAll(".gallery-item"));
const destinationModalElement = document.getElementById("destinationModal");
const galleryModalElement = document.getElementById("galleryModal");
const destinationModal = destinationModalElement ? new bootstrap.Modal(destinationModalElement) : null;
const galleryModal = galleryModalElement ? new bootstrap.Modal(galleryModalElement) : null;
let currentGalleryIndex = 0;

function renderDestinations() {
  if (!destinationCards || !searchInput || !categoryFilter || !emptyDestinations) return;

  const searchTerm = searchInput.value.trim().toLowerCase();
  const selectedCategory = categoryFilter.value;
  const destinationItems = Array.from(destinationCards.querySelectorAll(".destination-item"));
  let visibleCount = 0;

  destinationItems.forEach((item) => {
    const matchesSearch = item.dataset.search.includes(searchTerm);
    const matchesCategory = selectedCategory === "All" || item.dataset.category === selectedCategory;
    const shouldShow = matchesSearch && matchesCategory;

    item.classList.toggle("d-none", !shouldShow);
    if (shouldShow) {
      visibleCount += 1;
    }
  });

  emptyDestinations.classList.toggle("d-none", visibleCount > 0);
}

function getDetailText(card, selector) {
  const detail = card.querySelector(selector);
  return detail ? detail.textContent.trim() : "";
}

function showDestinationDetails(button) {
  const card = button.closest(".destination-card");
  if (!card || !destinationModal) return;

  const image = card.querySelector("img");
  const name = card.querySelector("h3").textContent.trim();
  const category = card.querySelector(".badge").textContent.trim();

  document.getElementById("destinationModalCategory").textContent = category;
  document.getElementById("destinationModalLabel").textContent = name;
  document.getElementById("destinationModalBody").innerHTML = `
    <img src="${image.getAttribute("src")}" class="modal-hero" alt="${image.getAttribute("alt")}">
    <p class="mt-3">${getDetailText(card, ".detail-full")}</p>
    <div class="detail-grid">
      <div><strong>Location</strong><span>${getDetailText(card, ".detail-location")}</span></div>
      <div><strong>Activities</strong><span>${getDetailText(card, ".detail-activities")}</span></div>
      <div><strong>Best time to visit</strong><span>${getDetailText(card, ".detail-best-time")}</span></div>
      <div><strong>Entrance fee</strong><span>${getDetailText(card, ".detail-fee")}</span></div>
      <div><strong>Opening hours</strong><span>${getDetailText(card, ".detail-hours")}</span></div>
      <div><strong>Travel tips</strong><span>${getDetailText(card, ".detail-tips")}</span></div>
    </div>
  `;

  destinationModal.show();
}

function openGallery(index) {
  if (!galleryModal) return;
  currentGalleryIndex = index;
  updateLightbox();
  galleryModal.show();
}

function updateLightbox() {
  const currentItem = galleryItems[currentGalleryIndex];
  if (!currentItem) return;

  const image = currentItem.querySelector("img");
  const caption = currentItem.querySelector("span").textContent.trim();
  document.getElementById("lightboxImage").src = image.getAttribute("src");
  document.getElementById("lightboxImage").alt = image.getAttribute("alt");
  document.getElementById("lightboxCaption").textContent = caption;
}

function validateField(field, isValid) {
  field.classList.toggle("is-invalid", !isValid);
  field.classList.toggle("is-valid", isValid);
  return isValid;
}

function validateForm(event) {
  event.preventDefault();

  const fullName = document.getElementById("fullName");
  const email = document.getElementById("email");
  const contact = document.getElementById("contact");
  const selectedDestination = document.getElementById("selectedDestination");
  const travelDate = document.getElementById("travelDate");
  const visitors = document.getElementById("visitors");
  const message = document.getElementById("message");
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const numberPattern = /^[0-9]+$/;

  const valid = [
    validateField(fullName, fullName.value.trim().length > 0),
    validateField(email, emailPattern.test(email.value.trim())),
    validateField(contact, numberPattern.test(contact.value.trim())),
    validateField(selectedDestination, selectedDestination.value !== ""),
    validateField(travelDate, travelDate.value !== ""),
    validateField(visitors, Number(visitors.value) >= 1),
    validateField(message, message.value.trim().length > 0)
  ].every(Boolean);

  document.getElementById("formSuccess").classList.toggle("d-none", !valid);

  if (valid) {
    event.target.reset();
    document.querySelectorAll("#inquiryForm .is-valid").forEach((field) => {
      field.classList.remove("is-valid");
    });
  }
}

if (destinationCards) {
  renderDestinations();
  searchInput.addEventListener("input", renderDestinations);
  categoryFilter.addEventListener("change", renderDestinations);
  destinationCards.addEventListener("click", (event) => {
    const button = event.target.closest(".view-details");
    if (button) {
      showDestinationDetails(button);
    }
  });
}

galleryItems.forEach((item, index) => {
  item.addEventListener("click", () => openGallery(index));
});

document.getElementById("prevImage")?.addEventListener("click", () => {
  currentGalleryIndex = (currentGalleryIndex - 1 + galleryItems.length) % galleryItems.length;
  updateLightbox();
});

document.getElementById("nextImage")?.addEventListener("click", () => {
  currentGalleryIndex = (currentGalleryIndex + 1) % galleryItems.length;
  updateLightbox();
});

document.getElementById("inquiryForm")?.addEventListener("submit", validateForm);
