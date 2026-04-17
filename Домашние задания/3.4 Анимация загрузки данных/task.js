const loader = document.getElementById("loader");
const itemsEl = document.getElementById("items");
const CACHE_KEY = "slow-get-courses-cache";

function renderCourses(data) {
  const valute = data.response && data.response.Valute;
  if (!valute) return;

  const fragment = document.createDocumentFragment();

  Object.values(valute).forEach((v) => {
    const item = document.createElement("div");
    item.className = "item";

    const code = document.createElement("div");
    code.className = "item__code";
    code.textContent = v.CharCode;

    const value = document.createElement("div");
    value.className = "item__value";
    value.textContent = v.Value;

    const currency = document.createElement("div");
    currency.className = "item__currency";
    currency.textContent = "руб.";

    item.append(code, value, currency);
    fragment.appendChild(item);
  });

  itemsEl.replaceChildren(fragment);
}

const cached = localStorage.getItem(CACHE_KEY);
if (cached) {
  try {
    renderCourses(JSON.parse(cached));
  } catch {
    localStorage.removeItem(CACHE_KEY);
  }
}

fetch("https://students.netoservices.ru/nestjs-backend/slow-get-courses")
  .then((res) => {
    if (!res.ok) throw new Error(String(res.status));
    return res.json();
  })
  .then((data) => {
    localStorage.setItem(CACHE_KEY, JSON.stringify(data));
    renderCourses(data);
  })
  .catch(() => {
    /* оставляем кэш или пустой список */
  })
  .finally(() => {
    loader.classList.remove("loader_active");
  });
