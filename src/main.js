import "./style.css";
import { authService } from "./service/auth";
import { initGlobalAuthEvents } from "./utils/authEvents";
import Home, { initHomeLogic } from "./pages/Home";
import Explore, { initExploreLogic } from "./pages/Explore";
import SearchPage from "./pages/SearchPage"; 
import { initSearchLogic } from "./utils/searchLogic"; 

const root = document.querySelector("#app");
let currentPathname = null;
let currentSearch = null;
let isSidebarCollapsed = false;

const navigateTo = (path) => {
    const clean = path.split("?")[0];
    window.history.pushState({}, "", clean);
    window.dispatchEvent(new Event('popstate'));
};

const attachSidebarEvents = () => {
    const homeBtns = document.querySelectorAll('.js-spa-home');
    homeBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault(); 
            if (window.location.pathname !== '/' || window.location.search !== '') {
            const newUrl = '/';
            window.history.replaceState({}, "", newUrl);
            window.dispatchEvent(new Event('popstate'));
        }
        });
    });

    const exploreBtn = document.querySelector('.js-explore');
    if (exploreBtn) {
        exploreBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (window.location.pathname !== '/explore') navigateTo('/explore');
        });
    }

    const hamburgerBtn = document.querySelector('.js-hamburger');
    if (hamburgerBtn) {
        hamburgerBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            isSidebarCollapsed = !isSidebarCollapsed;
            updateSidebarUI();
        });
    }
};

const updateSidebarUI = () => {
    const sidebar = document.querySelector(".js-sidebar");
    const items = document.querySelectorAll(".js-home, .js-explore, .js-library, .js-signin");
    const signinFull = document.querySelector(".js-signin-full");
    const signinSmall = document.querySelector(".js-signin");

    if (sidebar) {
        sidebar.classList.toggle("w-[170px]", !isSidebarCollapsed);
        sidebar.classList.toggle("w-[60px]", isSidebarCollapsed);
    }
    if (signinFull) signinFull.classList.toggle("hidden", isSidebarCollapsed);
    if (signinSmall) signinSmall.classList.toggle("hidden", !isSidebarCollapsed);
    items.forEach(i => {
        const textLink = i.querySelector("a");

        i.classList.remove("p-[10px]", "pr-[12px]", "pl-[22px]", "px-[8px]");
        i.classList.remove("pb-[10px]", "pt-[10px]");
        i.classList.add("py-[10px]");
        if (!isSidebarCollapsed) {
            i.classList.remove("flex-col", "w-[60px]", "text-center", "items-center");
            i.classList.add("flex-row", "w-[170px]", "justify-start", "pl-[22px]");
            if (textLink) textLink.classList.remove("hidden");
        } else {
            i.classList.remove("flex-row", "w-[170px]", "justify-start");
            i.classList.add("flex-col", "w-[60px]", "text-center", "items-center", "px-[8px]");
            if (textLink) textLink.classList.remove("hidden");
        }
    });
};

const render = async (forceReload = false) => {
    const path = window.location.pathname;
    const search = window.location.search;

    if (!forceReload && path === currentPathname && search === currentSearch) return;
    
    currentPathname = path;
    currentSearch = search;
    const user = await authService.getMe();

    if (path === "/explore") {
        root.innerHTML = Explore(user); 
        await initExploreLogic();            
    } else if (path === "/search") {
        root.innerHTML = await SearchPage(user);
    } else {
        root.innerHTML = Home(user);    
        await initHomeLogic();                
    }

    initSearchLogic(); 
    attachSidebarEvents();
    updateSidebarUI();
    initGlobalAuthEvents();
};

const initApp = async () => {
    await render(true); 
    window.addEventListener("popstate", () => render(false));
};

initApp();