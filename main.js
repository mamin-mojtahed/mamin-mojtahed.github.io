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

function setupProjectMediaHover() {
	const projectMedias = document.querySelectorAll("main#page-section .project-media");
	if (!projectMedias.length) return;

	const applyHoverZone = (projectMedia, event) => {
		const bounds = projectMedia.getBoundingClientRect();
		const xRatio = (event.clientX - bounds.left) / bounds.width;
		const yRatio = (event.clientY - bounds.top) / bounds.height;
		let hoverZone = "top";

		if (xRatio < 1 / 3 || yRatio < 1 / 3) {
			hoverZone = "bottom";
		} else if (xRatio < 2 / 3 && yRatio < 2 / 3) {
			hoverZone = "middle";
		}

		projectMedia.dataset.hover = hoverZone;
	};

	projectMedias.forEach((projectMedia) => {
		projectMedia.addEventListener("pointerenter", (event) => applyHoverZone(projectMedia, event));
		projectMedia.addEventListener("pointermove", (event) => applyHoverZone(projectMedia, event));
		projectMedia.addEventListener("pointerleave", () => {
			delete projectMedia.dataset.hover;
		});
	});
}

function getCurrentPage() {
	return document.body.dataset.page || "home";
}

function getBasePath() {
	return document.body.dataset.base || "./";
}

function buildHref(basePath, pageKey) {
	return pageKey === "home" ? basePath : `${basePath}${pageKey}/`;
}

function renderTabs(currentPage) {
	const tabsRoot = document.getElementById("tabs");
	if (!tabsRoot) throw new Error("Tabs container not found");

	const basePath = getBasePath();
	tabsRoot.innerHTML = `
		<div class="tabs-grid">
			${TAB_ORDER.map((pageKey, index) => {
				const config = PAGE_CONFIG[pageKey];
				const isActive = pageKey === currentPage;
				return `
					<a
						class="bookmark${isActive ? " active" : ""}"
						href="${buildHref(basePath, pageKey)}"
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
	// const contentElement = document.getElementById("content");
	const sectionElement = document.getElementById("page-section");
	const footerElement = document.getElementById("page-footer");

	if (!titleElement || !contentElement || !sectionElement || !footerElement) {
		throw new Error("Page template is missing required elements");
	}

	titleElement.textContent = config.title;
	document.title = config.documentTitle;
	// contentElement.innerHTML = SHARED_HOME_CONTENT;
	// sectionElement.innerHTML += config.sectionHtml;
	// footerElement.innerHTML = SHARED_HOME_FOOTER;
}

document.querySelectorAll("header *").forEach((elem) => {
	elem.addEventListener("mouseenter", hoverHandler);
});
document.querySelector("img#banner")?.addEventListener("mouseleave", leaveHandler);

const currentPage = getCurrentPage();
renderTabs(currentPage);
renderSection(currentPage);
setupProjectMediaHover();
