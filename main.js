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
		projectMedia.addEventListener("projectrotate", (event) => {
			rotation = (rotation + event.detail.step + thumbs.length) % thumbs.length;
			applyOrder(thumbs, rotation);
		});

		projectMedia.addEventListener("pointerenter", stop);
		projectMedia.addEventListener("pointerleave", start);
		projectMedia.addEventListener("focusin", stop);
		projectMedia.addEventListener("focusout", (event) => {
			if (!projectMedia.contains(event.relatedTarget)) start();
		});
	});
}

function setupProjectImageViewer() {
	const projects = [...document.querySelectorAll("main#page-section .project")];
	if (!projects.length) return;

	const overlay = document.createElement("div");
	overlay.className = "project-lightbox";
	overlay.setAttribute("role", "dialog");
	overlay.setAttribute("aria-modal", "true");
	overlay.setAttribute("aria-label", "Expanded project image");
	overlay.innerHTML = `
		<button class="lightbox-control lightbox-close" type="button" aria-label="Close expanded image">
			<i class="fa-solid fa-xmark" aria-hidden="true"></i>
		</button>
		<button class="lightbox-control lightbox-previous" type="button" aria-label="Previous project image">
			<i class="fa-solid fa-chevron-left" aria-hidden="true"></i>
		</button>
		<img class="lightbox-image" alt="">
		<button class="lightbox-control lightbox-next" type="button" aria-label="Next project image">
			<i class="fa-solid fa-chevron-right" aria-hidden="true"></i>
		</button>
	`;
	document.body.append(overlay);

	const lightboxImage = overlay.querySelector(".lightbox-image");
	const closeButton = overlay.querySelector(".lightbox-close");
	const previousButton = overlay.querySelector(".lightbox-previous");
	const nextButton = overlay.querySelector(".lightbox-next");
	let activeProject = null;
	let activeIndex = 0;
	let lastFocusedElement = null;

	const getImages = () => [...activeProject.querySelectorAll(".project-thumb")];

	const showImage = (index) => {
		const images = getImages();
		if (!images.length) return;
		activeIndex = (index + images.length) % images.length;
		const image = images[activeIndex];
		lightboxImage.src = image.currentSrc || image.src;
		lightboxImage.alt = image.alt;
		previousButton.hidden = images.length < 2;
		nextButton.hidden = images.length < 2;
	};

	const close = () => {
		overlay.classList.remove("is-open");
		document.body.classList.remove("lightbox-open");
		lastFocusedElement?.focus();
		activeProject = null;
	};

	const open = (project, image) => {
		activeProject = project;
		lastFocusedElement = document.activeElement;
		showImage(getImages().indexOf(image));
		overlay.classList.add("is-open");
		document.body.classList.add("lightbox-open");
		closeButton.focus();
	};

	projects.forEach((project) => {
		const media = project.querySelector(".project-media");
		const images = [...project.querySelectorAll(".project-thumb")];
		if (!media || !images.length) return;

		const controls = document.createElement("div");
		controls.className = "project-controls";
		controls.innerHTML = `
			<button class="project-control project-expand" type="button" aria-label="Expand project image">
				<i class="fa-solid fa-expand" aria-hidden="true"></i>
			</button>
			<button class="project-control project-previous" type="button" aria-label="Previous project image">
				<i class="fa-solid fa-chevron-left" aria-hidden="true"></i>
			</button>
			<button class="project-control project-next" type="button" aria-label="Next project image">
				<i class="fa-solid fa-chevron-right" aria-hidden="true"></i>
			</button>
		`;
		media.prepend(controls);

		const expandButton = controls.querySelector(".project-expand");
		const previousProjectButton = controls.querySelector(".project-previous");
		const nextProjectButton = controls.querySelector(".project-next");
		const rotate = (step) => media.dispatchEvent(new CustomEvent("projectrotate", { detail: { step } }));

		expandButton.addEventListener("click", () => open(project, images.find((image) => image.classList.contains("project-thumb-middle")) || images[0]));
		previousProjectButton.addEventListener("click", () => rotate(-1));
		nextProjectButton.addEventListener("click", () => rotate(1));
		images.forEach((image) => image.addEventListener("click", () => open(project, image)));
	});

	closeButton.addEventListener("click", close);
	previousButton.addEventListener("click", () => showImage(activeIndex - 1));
	nextButton.addEventListener("click", () => showImage(activeIndex + 1));
	overlay.addEventListener("click", (event) => {
		if (event.target === overlay) close();
	});
	document.addEventListener("keydown", (event) => {
		if (!overlay.classList.contains("is-open")) return;
		if (event.key === "Escape") close();
		if (event.key === "ArrowLeft") showImage(activeIndex - 1);
		if (event.key === "ArrowRight") showImage(activeIndex + 1);
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
setupProjectImageViewer();
