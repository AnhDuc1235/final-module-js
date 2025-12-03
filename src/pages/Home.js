import Header from "../components/Header";
import Sidebar from "../components/sidebar";
import { AuthModalHTML, ProfileModalHTML } from "../components/AuthModals";
import { authService } from "../service/auth";
import { DetailPageHTML, initDetailLogic } from "./Detail";
import { SongDetailPageHTML, initSongDetailLogic } from "./SongDetail"; 
import { VideoDetailPageHTML, initVideoDetailLogic } from "./VideoDetail"; 
import { stopMusic } from "../components/Player"; 

const API_BASE_URL = "https://youtube-music.f8team.dev/api";

function getThumb(item) {
    if (item.thumbnails && Array.isArray(item.thumbnails) && item.thumbnails.length > 0) {
        return item.thumbnails[0].url || item.thumbnails[0];
    }
    return item.thumbnail || "https://via.placeholder.com/300";
}

function getArtistName(item) {
    if (item.artists && Array.isArray(item.artists)) {
        return item.artists.map(a => a.name).join(", ");
    }
    return "null";
}

//slide
function initCustomSlider(containerId, prevBtnId, nextBtnId) {
    const slider = document.getElementById(containerId);
    const prevBtn = document.getElementById(prevBtnId);
    const nextBtn = document.getElementById(nextBtnId);

    if (!slider || !prevBtn || !nextBtn) return;

    let current = 0;

    const updateSlider = () => {
        const firstCard = slider.firstElementChild;
        if (!firstCard) return;

        const gap = 24;
        const cardWidth = firstCard.offsetWidth + gap;
        const total = slider.children.length;
        const containerWidth = slider.parentElement.offsetWidth;
        
        const visibleItems = Math.floor(containerWidth / cardWidth);
        const maxIndex = Math.max(0, total - visibleItems);

        if (current > maxIndex) current = maxIndex;

        slider.style.transform = `translateX(-${current * cardWidth}px)`;
        
        //back trước
        if (current === 0) {
            prevBtn.disabled = true;
            prevBtn.style.opacity = "0.3";
        } else {
            prevBtn.disabled = false;
            prevBtn.style.opacity = "1";
        }

        //next
        if (current >= maxIndex) {
            nextBtn.disabled = true;
            nextBtn.style.opacity = "0.3";
        } else {
            nextBtn.disabled = false;
            nextBtn.style.opacity = "1";
        }
    };

    prevBtn.onclick = () => {
        if (current > 0) {
            current--;
            updateSlider();
        }
    };
    nextBtn.onclick = () => {
        const firstCard = slider.firstElementChild;
        const gap = 24;
        const cardWidth = firstCard.offsetWidth + gap;
        const containerWidth = slider.parentElement.offsetWidth;
        const visibleItems = Math.floor(containerWidth / cardWidth);
        const maxIndex = Math.max(0, slider.children.length - visibleItems);

        if (current < maxIndex) {
            current++;
            updateSlider();
        }
    };

    window.addEventListener('resize', updateSlider);
    setTimeout(updateSlider, 100);
}

//moods
function renderMoods(items) {
    if (!items || !items.length) return "";
    
    const buttonsHtml = items.map(i => {
        return `<button class="bg-[#212121] px-4 py-2 rounded-lg text-white text-sm font-medium cursor-pointer hover:bg-gray-800 transition-all">${i.name || i.title}</button>`;
    }).join("");

    return `
        <section class="mb-10">
            <div class="flex gap-3 overflow-x-auto whitespace-nowrap scrollbar-hide pb-2">
                ${buttonsHtml}
            </div>
        </section>
    `;
}

//quick Picks
function renderQuickPicks(items) {
    if (!items || !items.length) return "";
    const col1 = items.slice(0, 4);
    const col2 = items.slice(4, 8);
    const col3 = items.slice(8, 12);
    const cols = [col1, col2, col3];
    
    const html = cols.map(col => {
        const colItems = col.map(item => `
            <div class="flex items-center gap-4 group cursor-pointer js-navigate-detail" data-slug="${item.slug}" data-type="${item.type || 'playlist'}">
                <div class="relative w-16 h-16 flex-shrink-0">
                    <img src="${getThumb(item)}" class="w-full h-full object-cover rounded bg-gray-800">
                    <div class="absolute inset-0 bg-black/40 hidden group-hover:flex items-center justify-center rounded">
                        <i class="fa-solid fa-play text-white"></i>
                    </div>
                </div>
                <div class="flex-1 min-w-0">
                    <h3 class="text-white font-medium truncate">${item.title}</h3>
                    <p class="text-gray-400 text-sm truncate">${getArtistName(item)}</p>
                </div>
            </div>
        `).join("");
        return `<div class="flex-1 flex flex-col gap-4">${colItems}</div>`;
    }).join("");

    return `
        <section class="mb-12">
            <h2 class="text-white text-3xl font-bold mb-6">Quick picks</h2>
            <div class="flex flex-col md:flex-row gap-6 w-full">
                ${html}
            </div>
        </section>
    `;
}

function renderSectionSlider(title, items, defaultType, sliderId) {
    if (!items || !items.length) return "";

    const itemsHtml = items.map(item => `
        <div class="js-navigate-detail w-[180px] md:w-[200px] flex-shrink-0 cursor-pointer group" data-slug="${item.slug}" data-type="${item.type || defaultType}">
            <div class="relative mb-3 overflow-hidden rounded-lg">
                <img src="${getThumb(item)}" class="w-full aspect-square object-cover group-hover:scale-105 transition-transform duration-500">
                <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <i class="fas fa-play text-white text-2xl"></i>
                
            </div>
            
            </div>
            <h3 class="text-white font-semibold truncate text-base">${item.title}</h3>
            <p class="text-gray-400 text-sm truncate mt-1">${getArtistName(item)}</p>
        </div>
    `).join("");

    return `
        <section class="mb-12 group/section">
            <div class="flex justify-between items-center mb-4">
                <h2 class="text-white text-2xl font-bold">${title}</h2>
                <div class="flex gap-2">
                    <button id="${sliderId}-prev" class="text-white text-xl px-3 py-1 hover:bg-gray-800 rounded-full disabled:opacity-30 cursor-pointer"><</button>
                    <button id="${sliderId}-next" class="text-white text-xl px-3 py-1 hover:bg-gray-800 rounded-full disabled:opacity-30 cursor-pointer">></button>
                </div>
            </div>
            <div class="overflow-hidden">
                <div id="${sliderId}" class="flex gap-6 transition-transform duration-300 ease-out">
                    ${itemsHtml}
                </div>
                
            </div>
        </section>
    `;
}

function Home(user) {
    return `
    <div class="flex bg-black min-h-screen font-sans mt-[50px]">
      <div class="hidden md:block w-[240px] flex-shrink-0" id="sidebar-container">${Sidebar()}</div>
      <div class="flex-1 flex flex-col w-full min-w-0">
        ${Header(user)}
        <main id="router-view" class="flex-1 overflow-y-auto p-6 md:p-8 pb-24 scroll-smooth">
            <div class="h-64">
                <p class="text-3xl md:text-4xl font-bold mb-6 capitalize text-white">Loading</p>
            </div>
        </main>
      </div>
    </div>
    ${AuthModalHTML()} ${ProfileModalHTML(user)}
    `;
}
export default Home;

export async function initHomeLogic() {
    const mainView = document.getElementById("router-view");
    if (!mainView) return;

    const renderHome = async () => {
        try {
            const token = authService.getToken();
            
            //api
            const [moods, qp, hits, albums, vn] = await Promise.all([
                fetch(`${API_BASE_URL}/moods`).then(r => r.json()),
                fetch(`${API_BASE_URL}/quick-picks`).then(r => r.json()),
                fetch(`${API_BASE_URL}/home/todays-hits`).then(r => r.json()),
                fetch(`${API_BASE_URL}/home/albums-for-you`).then(r => r.json()),
                fetch(`${API_BASE_URL}/playlists/by-country?country=VN`).then(r => r.json())
            ]);

            let personalItems = [];
            let userName = "";
            let isTokenValid = false;

            if (token) {
                try {
                    const [pRes, meRes] = await Promise.all([
                        fetch(`${API_BASE_URL}/home/personalized`, { headers: { "Authorization": `Bearer ${token}` } }),
                        authService.getMe()
                    ]);

                    if (pRes.ok) {
                        const pData = await pRes.json();
                        personalItems = pData.data || pData;
                        isTokenValid = true;
                    }
                    if (meRes && meRes.name) {
                        userName = meRes.name;
                    }
                } catch (e) {
                    console.log("Lỗi xác thực", e);
                }
            }

            const getItems = (r) => r.items || (Array.isArray(r) ? r : r.data) || [];

            let html = "";
            //moods
            html += renderMoods(getItems(moods));
            
            //trường hợp khi đã đăng nhập -> thêm 1 phần trên đầu
            if (isTokenValid && personalItems.length) {
                html += renderSectionSlider(`Chào mừng ${userName}`, getItems(personalItems), "album", "slider-personalized");
            }

            //quick Picks
            html += renderQuickPicks(getItems(qp));

            //today hit
            html += renderSectionSlider("Today's Hits", getItems(hits), "playlist", "slider-hits");

            //albums for you
            html += renderSectionSlider("Albums for you", getItems(albums), "album", "slider-albums");

            //vietnam Music
            html += renderSectionSlider("Vietnam Music", getItems(vn), "playlist", "slider-vn");

            mainView.innerHTML = html;

            //slide 
            if (isTokenValid && personalItems.length) {
                initCustomSlider("slider-personalized", "slider-personalized-prev", "slider-personalized-next");
            }
            initCustomSlider("slider-hits", "slider-hits-prev", "slider-hits-next");
            initCustomSlider("slider-albums", "slider-albums-prev", "slider-albums-next");
            initCustomSlider("slider-vn", "slider-vn-prev", "slider-vn-next");

            document.querySelectorAll(".js-navigate-detail").forEach(item => {
                item.onclick = (e) => {
                    e.preventDefault();
                    const state = { 
                        page: "detail", 
                        slug: item.dataset.slug, 
                        type: item.dataset.type 
                    };
                    const url = `?page=detail&slug=${item.dataset.slug}&type=${item.dataset.type}`;
                    window.history.pushState(state, "", url);
                    handleRouting();
                };
            });

        } catch (e) {
            console.error(e);
            mainView.innerHTML = `<p class="text-white text-center">Lỗi tải dữ liệu</p>`;
        }
    };

    //routes
    const handleRouting = async () => {
        const params = new URLSearchParams(window.location.search);
        const page = params.get("page");
        const slug = params.get("slug");
        const type = params.get("type");
        const id = params.get("id");

        if (page !== "song") {
            stopMusic(); 
        }

        if (page === "detail" && slug) {
            //chi tiết Playlist/Album
            mainView.innerHTML = DetailPageHTML();
            await initDetailLogic(slug, type);
        } 
        else if (page === "song" && id) {
            //nghe nhạc
            mainView.innerHTML = SongDetailPageHTML();
            await initSongDetailLogic(id);
        }
        else if (page === "video" && id) {
            //video
            mainView.innerHTML = VideoDetailPageHTML();
            await initVideoDetailLogic(id);
        }
        else {
            //mặc định là Home
            await renderHome();
        }
    };

    window.addEventListener("popstate", handleRouting);
    handleRouting();
}