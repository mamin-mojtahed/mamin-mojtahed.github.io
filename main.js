const PAGE_CONFIG = {
	home: {
		title: "Amin Mojtahed",
		documentTitle: "Amin's Webpage",
		tabLabel: "Homepage"
	},
	portfolio: {
		title: "Portfolio",
		documentTitle: "Amin's Webpage | Portfolio",
		tabLabel: "Portfolio"
	},
	expertise: {
		title: "Expertise",
		documentTitle: "Amin's Webpage | Expertise",
		tabLabel: "Expertise"
	},
	network: {
		title: "Network",
		documentTitle: "Amin's Webpage | Network",
		tabLabel: "Network"
	},
};

const TAB_ORDER = ["home", "portfolio", "expertise", "network"];

function hoverHandler() {
	const emotElem = document.getElementById("emoticon");
	if (!emotElem) throw new Error("Element not found");
	emotElem.classList.add("revealed");
}

function leaveHandler() {
	const emotElem = document.getElementById("emoticon");
	if (!emotElem) throw new Error("Element not found");
	emotElem.classList.remove("revealed");
}

function setupProjectMediaAutoScroll() {
	const projectMedias = document.querySelectorAll("main#page-section .project-media");
	if (!projectMedias.length) return;

	const positionClasses = ["project-thumb-top", "project-thumb-middle", "project-thumb-bottom"];

	const applyOrder = (thumbs, startIndex = 0) => {
		thumbs.forEach((thumb, index) => {
			positionClasses.forEach((positionClass) => thumb.classList.remove(positionClass));
			thumb.classList.add(positionClasses[(index + startIndex) % positionClasses.length]);
		});
	};

	projectMedias.forEach((projectMedia) => {
		const thumbs = [...projectMedia.querySelectorAll(".project-thumb")];
		if (thumbs.length < 3) return;

		let rotation = 0;
		let intervalId = null;

		const start = () => {
			if (intervalId) return;
			projectMedia.dataset.autoscroll = "running";
			intervalId = window.setInterval(() => {
				rotation = (rotation - 1 + thumbs.length) % thumbs.length;
				applyOrder(thumbs, rotation);
			}, 2200);
		};

		const stop = () => {
			if (intervalId) {
				window.clearInterval(intervalId);
				intervalId = null;
			}
			projectMedia.dataset.autoscroll = "paused";
		};

		applyOrder(thumbs, rotation);
		start();

		projectMedia.addEventListener("pointerenter", stop);
		projectMedia.addEventListener("pointerleave", start);
		projectMedia.addEventListener("focusin", stop);
		projectMedia.addEventListener("focusout", (event) => {
			if (!projectMedia.contains(event.relatedTarget)) start();
		});
	});
}

function getCurrentPage() {
	return document.body.dataset.page || "home";
}

function renderTabs(currentPage) {
	const tabsRoot = document.getElementById("tabs");
	if (!tabsRoot) throw new Error("Tabs container not found");

	tabsRoot.innerHTML = `
		<div class="tabs-grid">
			${TAB_ORDER.map((pageKey, index) => {
				const config = PAGE_CONFIG[pageKey];
				const isActive = pageKey === currentPage;
				return `
					<a
						class="bookmark${isActive ? " active" : ""}"
						href="${pageKey === "home" ? '/' : `/${pageKey}`}"
						data-index="${index}"
						data-page="${pageKey}"
						style="--bookmark-index:${index};"
					>
						<span>${config.tabLabel}</span>
					</a>
				`;
			}).join("")}
		</div>
	`;

	const bookmarks = [...tabsRoot.querySelectorAll(".bookmark")];

	const clearHoverState = () => {
		tabsRoot.classList.remove("has-hover");
		bookmarks.forEach((bookmark) => {
			bookmark.classList.remove("is-hovered", "is-before", "is-after");
		});
	};

	const applyHoverState = (hoveredIndex) => {
		tabsRoot.classList.add("has-hover");
		bookmarks.forEach((bookmark, index) => {
			bookmark.classList.toggle("is-hovered", index === hoveredIndex);
			bookmark.classList.toggle("is-before", index < hoveredIndex);
			bookmark.classList.toggle("is-after", index > hoveredIndex);
		});
	};

	bookmarks.forEach((bookmark) => {
		const hoveredIndex = Number(bookmark.dataset.index);
		bookmark.addEventListener("mouseenter", () => applyHoverState(hoveredIndex));
		bookmark.addEventListener("focus", () => applyHoverState(hoveredIndex));
	});

	tabsRoot.addEventListener("mouseleave", clearHoverState);
	tabsRoot.addEventListener("focusout", (event) => {
		if (!tabsRoot.contains(event.relatedTarget)) clearHoverState();
	});
}

function renderSection(currentPage) {
	const config = PAGE_CONFIG[currentPage] || PAGE_CONFIG.home;
	const titleElement = document.getElementById("title");
	const sectionElement = document.getElementById("page-section");
	const footerElement = document.getElementById("page-footer");

	if (!titleElement || !sectionElement || !footerElement) {
		throw new Error("Page template is missing required elements");
	}

	titleElement.textContent = config.title;
	document.title = config.documentTitle;
}

document.querySelectorAll("header *").forEach((elem) => {
	elem.addEventListener("mouseenter", hoverHandler);
});
document.querySelector("img#banner")?.addEventListener("mouseleave", leaveHandler);

const currentPage = getCurrentPage();
renderTabs(currentPage);
renderSection(currentPage);
setupProjectMediaAutoScroll();
