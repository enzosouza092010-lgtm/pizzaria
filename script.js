const WHATSAPP_NUMBER = "5512997255608";

const header = document.querySelector(".site-header");
const menuToggle = document.querySelector(".menu-toggle");
const mobileMenu = document.querySelector(".mobile-menu");

const updateHeader = () => header.classList.toggle("scrolled", window.scrollY > 28);
updateHeader();
window.addEventListener("scroll", updateHeader, { passive: true });

menuToggle?.addEventListener("click", () => {
  const open = menuToggle.classList.toggle("active");
  mobileMenu.classList.toggle("open", open);
  menuToggle.setAttribute("aria-expanded", String(open));
  menuToggle.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
});

mobileMenu?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    mobileMenu.classList.remove("open");
    menuToggle.classList.remove("active");
    menuToggle.setAttribute("aria-expanded", "false");
  });
});

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("in-view");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: "0px 0px -45px" });

document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));

const filterTabs = [...document.querySelectorAll(".filter-tab")];
const pizzaCards = [...document.querySelectorAll(".pizza-card")];

filterTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    filterTabs.forEach((item) => {
      item.classList.remove("active");
      item.setAttribute("aria-selected", "false");
    });

    tab.classList.add("active");
    tab.setAttribute("aria-selected", "true");
    const filter = tab.dataset.filter;

    pizzaCards.forEach((card) => {
      const visible = filter === "all" || card.dataset.category === filter;
      card.classList.toggle("hidden", !visible);
      if (visible) {
        card.animate(
          [
            { opacity: 0, transform: "translateY(12px)" },
            { opacity: 1, transform: "translateY(0)" }
          ],
          { duration: 320, easing: "ease-out" }
        );
      }
    });
  });
});

document.querySelectorAll(".pizza-order").forEach((button) => {
  button.addEventListener("click", () => {
    const pizza = button.dataset.pizza;
    const message = `Olá! Vi a pizza ${pizza} no cardápio e gostaria de consultar tamanhos e valores.`;
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, "_blank", "noopener");
  });
});

const reservationForm = document.querySelector("#reserva");
const guestInput = reservationForm?.querySelector("input[name='guests']");
const guestOutput = document.querySelector("#guest-count");
const guestMinus = document.querySelector(".guest-minus");
const guestPlus = document.querySelector(".guest-plus");
const dateInput = reservationForm?.querySelector("input[name='date']");
let guests = 2;

if (dateInput) {
  const today = new Date();
  const localDate = new Date(today.getTime() - today.getTimezoneOffset() * 60000)
    .toISOString()
    .split("T")[0];
  dateInput.min = localDate;
}

const setGuests = (value) => {
  guests = Math.max(1, Math.min(30, value));
  if (guestInput) guestInput.value = String(guests);
  if (guestOutput) guestOutput.textContent = `${guests} ${guests === 1 ? "pessoa" : "pessoas"}`;
  if (guestMinus) guestMinus.disabled = guests === 1;
  if (guestPlus) guestPlus.disabled = guests === 30;
};

guestMinus?.addEventListener("click", () => setGuests(guests - 1));
guestPlus?.addEventListener("click", () => setGuests(guests + 1));
setGuests(2);

reservationForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(reservationForm);
  const name = String(formData.get("name") || "").trim();
  const date = String(formData.get("date") || "");
  const time = String(formData.get("time") || "");
  const error = reservationForm.querySelector(".form-error");

  if (!name || !date || !time) {
    error.textContent = "Preencha nome, data e horário para continuar.";
    reservationForm.querySelector(":invalid")?.focus();
    return;
  }

  error.textContent = "";
  const formattedDate = new Intl.DateTimeFormat("pt-BR", { timeZone: "UTC" }).format(new Date(`${date}T12:00:00Z`));
  const message = [
    "Olá! Gostaria de solicitar uma reserva para o rodízio da Lunamar.",
    "",
    `Nome: ${name}`,
    `Data desejada: ${formattedDate}`,
    `Horário: ${time}`,
    `Pessoas: ${guests}`,
    "",
    "Pode confirmar a disponibilidade, por favor?"
  ].join("\n");

  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, "_blank", "noopener");
});

document.querySelector("#year").textContent = new Date().getFullYear();
