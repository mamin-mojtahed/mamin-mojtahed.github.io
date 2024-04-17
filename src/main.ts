// handlers for emoticon hover
export function hoverHandler(e: Event) {
  const emotElem = document.getElementById("emoticon");
  if (!emotElem) throw new Error("Element not found");
  emotElem.hidden = false;
}
export function leaveHandler(e: Event) {
  // event.stopImmediatePropagation();
  const emotElem = document.getElementById("emoticon");
  if (!emotElem) throw new Error("Element not found");
  emotElem.hidden = true;
}
document.querySelectorAll("header *").forEach((elem) => {
  elem.addEventListener("mouseenter", hoverHandler);
});
document
  .querySelector("img#banner")
  ?.addEventListener("mouseleave", leaveHandler);
