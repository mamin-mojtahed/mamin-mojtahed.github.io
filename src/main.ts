// handlers for emoticon hover
export function hoverHandler() {
  const emotElem = document.getElementById("emoticon");
  if (!emotElem) throw new Error("Element not found");
  emotElem.classList.add("revealed");
}
export function leaveHandler() {
  // event.stopImmediatePropagation();
  const emotElem = document.getElementById("emoticon");
  if (!emotElem) throw new Error("Element not found");
  emotElem.classList.remove("revealed");
}
document.querySelectorAll("header *").forEach((elem) => {
  elem.addEventListener("mouseenter", hoverHandler);
});
document
  .querySelector("img#banner")
  ?.addEventListener("mouseleave", leaveHandler);
