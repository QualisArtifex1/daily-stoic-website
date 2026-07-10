const palettes = [
  ["#ff5f6d", "#7b2cbf", "#18063d"],
  ["#ff7a18", "#af002d", "#32004f"],
  ["#00b4d8", "#4361ee", "#3a0ca3"],
  ["#06d6a0", "#087f8c", "#5e2b97"],
  ["#f72585", "#7209b7", "#3a0ca3"],
  ["#ffb703", "#fb5607", "#8338ec"],
  ["#2ec4b6", "#0077b6", "#6a4c93"],
  ["#e63946", "#9d4edd", "#1d3557"],
];

const page = document.querySelector(".quote-page");
const card = document.querySelector(".quote-card");
const quoteElement = document.querySelector(".quote");
const attributionElement = document.querySelector(".attribution");

let quotes = [];
let renderedDateKey = "";

function dateKey(date) {
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
}

function getQuoteForDate(date) {
  const month = date.toLocaleString("en-US", { month: "long" });
  const day = date.getDate();
  return quotes.find((item) => item.month === month && item.day === day) ?? quotes[0];
}

function makeTextElement(tagName, text, className) {
  const element = document.createElement(tagName);
  element.textContent = text;
  if (className) element.className = className;
  return element;
}

function addSeparator(parent) {
  const separator = makeTextElement("span", " · ");
  separator.setAttribute("aria-hidden", "true");
  parent.append(separator);
}

function renderDailyQuote() {
  const today = new Date();
  const currentDateKey = dateKey(today);
  if (!quotes.length || currentDateKey === renderedDateKey) return;

  const dailyQuote = getQuoteForDate(today);
  const palette = palettes[(dailyQuote.dayNumber - 1) % palettes.length];

  page.style.setProperty("--color-one", palette[0]);
  page.style.setProperty("--color-two", palette[1]);
  page.style.setProperty("--color-three", palette[2]);
  card.setAttribute("aria-label", `Daily Stoic quote for ${dailyQuote.date}`);

  quoteElement.className = "quote";
  if (dailyQuote.quote.length > 430) quoteElement.classList.add("quote--long");
  else if (dailyQuote.quote.length > 260) quoteElement.classList.add("quote--medium");
  quoteElement.textContent = `“${dailyQuote.quote}”`;

  attributionElement.replaceChildren();
  attributionElement.append(makeTextElement("span", dailyQuote.author, "author"));
  addSeparator(attributionElement);
  attributionElement.append(makeTextElement("cite", dailyQuote.work));
  addSeparator(attributionElement);
  attributionElement.append(makeTextElement("time", dailyQuote.date));
  addSeparator(attributionElement);
  attributionElement.append(makeTextElement("span", dailyQuote.title));

  renderedDateKey = currentDateKey;
}

async function start() {
  const response = await fetch(new URL("./app/quotes.json", import.meta.url));
  if (!response.ok) throw new Error(`Unable to load quotes: ${response.status}`);
  quotes = await response.json();
  renderDailyQuote();
  window.setInterval(renderDailyQuote, 60_000);
}

start().catch((error) => console.error(error));
