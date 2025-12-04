import Header from "../components/Header";
import Sidebar from "../components/sidebar";
import MoodsOverview, { initMoodsData } from "./Moodandgenres.js";
import NewMusicVideosPage, { initNewVideoData } from "./Newvid.js";
import MoodDetailPage, { initMoodDetail } from "./MoodDetail.js";
import NewReleasePage, { initNewReleaseData } from "./Newrelease.js";
import ChartPage, { initChartPage } from "./Chart.js"; 
import { AuthModalHTML, ProfileModalHTML } from "../components/AuthModals";

const API_BASE_URL = "https://youtube-music.f8team.dev/api";

function renderTopNav() {
  return `
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
        <div id="nav-new-releases" class="bg-[#212121] hover:bg-[#303030] h-15 rounded-lg cursor-pointer flex flex-col justify-center px-6 transition-colors relative overflow-hidden">
            <p class="text-white text-2xl font-bold z-10">New releases</p>
        </div>
        <div id="nav-charts" class="bg-[#212121] hover:bg-[#303030] h-15 rounded-lg cursor-pointer flex flex-col justify-center px-6 transition-colors relative overflow-hidden">
            <p class="text-white text-2xl font-bold z-10">Charts</p>
        </div>
        <div id="nav-moods" class="bg-[#212121] hover:bg-[#303030] h-15 rounded-lg cursor-pointer flex flex-col justify-center px-6 transition-colors relative overflow-hidden">
            <p class="text-white text-2xl font-bold z-10">Moods & genres</p>
        </div>
    </div>
  `;
}

export function renderMoodsAndGenres(list = []) {
  if (!Array.isArray(list) || list.length === 0) return "";
  const ITEMS_PER_COL = 4;
  const COLS_PER_PAGE = 6;
  const ITEMS_PER_PAGE = ITEMS_PER_COL * COLS_PER_PAGE;
  const totalPages = Math.ceil(list.length / ITEMS_PER_PAGE);
  const pagesHtml = [];

  for (let page = 0; page < totalPages; page++) {
    let start = page * ITEMS_PER_PAGE;
    let slice = list.slice(start, start + ITEMS_PER_PAGE);
    const cols = [];
    for (let c = 0; c < COLS_PER_PAGE; c++) {
      cols.push(slice.slice(c * ITEMS_PER_COL, c * ITEMS_PER_COL + ITEMS_PER_COL));
    }
    pagesHtml.push(`
      <div class="mood-page flex gap-6 min-w-full transition-all duration-300">
        ${cols.map(col => `
            <div class="flex flex-col gap-3 w-[180px]">
              ${col.map(item => `
                  <button class="mood-btn bg-gray-900 hover:bg-gray-800 rounded-r-lg rounded-l-sm px-4 py-3 text-left text-white text-sm truncate border-l-[6px] transition-all cursor-pointer"
                    style="border-left-color: ${item.color || '#fff'};"
                    data-slug="${item.slug}"
                    data-type="${item.type}"> ${item.name}
                  </button>`
              ).join("")}
            </div>`).join("")}
      </div>`);
  }

  return `
    <section class="mb-12">
      <div class="flex justify-between items-center mb-4">
        <p id="moods-title-link" class="text-white text-2xl font-bold cursor-pointer">Moods & genres</p>
        <div class="flex gap-2">
          <button id="mood-prev" class="text-white text-xl px-3 py-1 hover:bg-gray-800 rounded-full disabled:opacity-30 cursor-pointer"><</button>
          <button id="mood-next" class="text-white text-xl px-3 py-1 hover:bg-gray-800 rounded-full disabled:opacity-30 cursor-pointer">></button>
        </div>
      </div>
      <div class="overflow-hidden">
        <div id="mood-slider" class="flex transition-transform duration-300">
          ${pagesHtml.join("")}
        </div>
      </div>
    </section>`;
}

function initMoodSlider() {
  const slider = document.getElementById("mood-slider");
  if (!slider) return;
  const pages = slider.children.length;
  let current = 0;
  const prev = document.getElementById("mood-prev");
  const next = document.getElementById("mood-next");
  function update() {
    slider.style.transform = `translateX(-${current * 100}%)`;
    prev.disabled = current === 0;
    next.disabled = current === pages - 1;
  }
  prev.onclick = () => { if (current > 0) current--; update(); };
  next.onclick = () => { if (current < pages - 1) current++; update(); };
  update();
}

export function renderNewMusicVideos(list) {
  if (!Array.isArray(list) || list.length === 0) return "";
  return `
    <section class="mb-12">
      <div class="flex justify-between items-center mb-4">
        <p id="videos-title-link" class="text-white text-2xl font-bold cursor-pointer hover:text-gray-300 transition-colors">New music videos</p>
        <div class="flex gap-2">
            <button id="video-prev" class="text-white text-xl px-3 py-1 hover:bg-gray-800 rounded-full disabled:opacity-30 cursor-pointer"><</button>
            <button id="video-next" class="text-white text-xl px-3 py-1 hover:bg-gray-800 rounded-full disabled:opacity-30 cursor-pointer">></button>
        </div>
      </div>
      <div class="overflow-hidden">
        <div id="video-slider" class="flex gap-6 transition-transform duration-300">
          ${list.map(v => `
            <div class="w-80 flex-shrink-0 cursor-pointer group" data-id="${v.id}"> <div class="w-full h-44 bg-gray-800 rounded-lg overflow-hidden mb-3 relative">
                  <img src="${v.thumbnail}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy">
                  <div class="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors"></div>
                  <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div class="bg-black/60 rounded-full p-3 backdrop-blur-sm">
                          <svg class="w-8 h-8 text-white fill-current" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                      </div>
                  </div>
              </div>
              <p class="text-white font-bold text-lg truncate" title="${v.title}">${v.title}</p>
              <p class="text-gray-400 text-sm truncate">${v.views.toLocaleString()} views</p>
            </div>`).join("")}
        </div>
      </div>
    </section>`;
}

function initVideoSlider() {
  const slider = document.getElementById("video-slider");
  if (!slider) return;
  const cardWidth = 320 + 24; 
  let current = 0;
  const total = slider.children.length;
  const prev = document.getElementById("video-prev");
  const next = document.getElementById("video-next");
  
  function update() {
    const containerWidth = slider.parentElement.offsetWidth;
    const visibleItems = Math.floor(containerWidth / cardWidth);
    const maxIndex = Math.max(0, total - visibleItems);
    if (current > maxIndex) current = maxIndex;
    slider.style.transform = `translateX(-${current * cardWidth}px)`;
    prev.disabled = current === 0;
    next.disabled = current >= maxIndex;
  }
  prev.onclick = () => { if (current > 0) current--; update(); };
  next.onclick = () => { 
      const containerWidth = slider.parentElement.offsetWidth;
      const visibleItems = Math.floor(containerWidth / cardWidth);
      const maxIndex = Math.max(0, total - visibleItems);
      if (current < maxIndex) current++; 
      update(); 
  };
  window.addEventListener('resize', update);
  update();

  const videoItems = slider.querySelectorAll(".group");
  videoItems.forEach(item => {
      item.onclick = (e) => {
          e.preventDefault();
          const id = item.dataset.id;
          window.history.pushState(
              { page: "video", id: id }, 
              "", 
              `/?page=video&id=${id}`
          );
          window.dispatchEvent(new Event("popstate"));
      };
  });
}

function Explore(user) {
  return `
    <div class="main-layout-wrapper flex flex-col min-h-screen bg-black mt-[50px]">
      <div class="top-section flex flex-grow overflow-hidden">
        <div class="sidebar w-[250px] flex-shrink-0 hidden md:block">
          ${Sidebar()}
        </div>
        <div class="content-area flex flex-col flex-1 overflow-hidden bg-black">
          ${Header(user)} 
          <div class="flex-1 overflow-auto scroll-smooth px-8 py-6" id="explore-content">
             <div class="flex h-full items-center justify-center">
                <p class="text-3xl md:text-4xl font-bold mb-6 capitalize text-white">Loading</p>
             </div>
          </div>
        </div>
      </div>
    </div>
    ${AuthModalHTML()}
    ${ProfileModalHTML(user)}
  `;
}
export default Explore;

export const initExploreLogic = () => {
  const root = document.getElementById("explore-content");
  if (!root) return;

  const showNewReleasesPage = async () => {
      root.innerHTML = NewReleasePage(); 
      await initNewReleaseData();
  };

  const showChartPage = async () => {
      root.innerHTML = ChartPage();
      await initChartPage();
  };

  const showMoods = async () => {
    root.innerHTML = MoodsOverview();
    await initMoodsData(); 
    attachMoodClickEvents('.mood-btn, .mood-btn-detail'); 
  };

  const showVideos = async () => {
    root.innerHTML = NewMusicVideosPage();
    await initNewVideoData();
  }

  const showMoodDetail = async (slug, type) => {
      root.innerHTML = MoodDetailPage(); 
      await initMoodDetail(slug, type); 
  }

  const showHome = async () => {
    try {
        if(!root.querySelector('#nav-new-releases')) {
             root.innerHTML = `<div class="flex h-full"><p class="text-3xl md:text-4xl font-bold mb-6 capitalize text-white">Loading</p></div>`;
        }
        const [moodRes, videoRes] = await Promise.all([
          fetch(`${API_BASE_URL}/explore/meta`),
          fetch(`${API_BASE_URL}/explore/videos`)
        ]);
        const moodData = await moodRes.json();
        const videoData = await videoRes.json();

        const categories = moodData.categories || [];
        const lines = moodData.lines || [];
        const moodList = [
          ...categories.map(item => ({ ...item, type: 'categories' })),
          ...lines.map(item => ({ ...item, type: 'lines' }))
        ].sort(() => 0.5 - Math.random());

        const videoList = (videoData.items || []).map(v => ({
          title: v.name, thumbnail: v.thumb, views: v.views || 0, id: v.id
        }));

        root.innerHTML = 
            renderTopNav() + 
            renderMoodsAndGenres(moodList) + 
            renderNewMusicVideos(videoList);

        initMoodSlider();
        initVideoSlider();
        attachMoodClickEvents('.mood-btn');
        
        const navNewReleases = document.getElementById("nav-new-releases");
        if(navNewReleases) {
          navNewReleases.onclick = (e) => { showNewReleasesPage(); };
        }
        
        const navCharts = document.getElementById("nav-charts");
        if(navCharts) {
          navCharts.onclick = (e) => { showChartPage(); };
        }
        
        const navMoods = document.getElementById("nav-moods");
        if(navMoods) {
          navMoods.onclick = (e) => { showMoods(); };
        }
        
        const moodTitle = document.getElementById("moods-title-link");
        if(moodTitle) {
          moodTitle.onclick = (e) => { showMoods(); };
        }
        
        const videoTitle = document.getElementById("videos-title-link");
        if(videoTitle) {
          videoTitle.onclick = (e) => { showVideos(); };
        }
    } catch (error) {
        console.error(error);
        root.innerHTML = `<p class="text-white text-center mt-10">Lỗi tải dữ liệu</p>`;
    }
  };

  const attachMoodClickEvents = (selector) => {
    const moodButtons = document.querySelectorAll(selector);
    moodButtons.forEach(btn => {
        const newBtn = btn.cloneNode(true);
        btn.parentNode.replaceChild(newBtn, btn);
        newBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const slug = newBtn.dataset.slug;
            const type = newBtn.dataset.type;
            if(slug && type) {
                window.history.pushState({ page: "detail", slug, type }, "", `?page=detail&slug=${slug}&type=${type}`);
                handleRouting(); 
            }
        });
    });
  };

  const handleRouting = () => {
    const rootEl = document.getElementById("explore-content");
    if (!rootEl) return; 

    const params = new URLSearchParams(window.location.search);
    const page = params.get("page");
    const slug = params.get("slug");
    const type = params.get("type");

    if (page === "detail" && slug && type) {
        showMoodDetail(slug, type);
    } else if (page === "moods") {
        showMoods();
    } else if (page === "videos") {
        showVideos();
    } else if (page === "new-releases") { 
        showNewReleasesPage();
    } else if (page === "charts") { 
        showChartPage();
    } else {
        showHome();
    }
  };

  window.addEventListener("popstate", handleRouting);
  handleRouting();
};