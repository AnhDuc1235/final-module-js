const API_BASE_URL = "https://youtube-music.f8team.dev/api";
let currentCountryCode = "GLOBAL";

export default function ChartPage() {
  return `
    <div class="px-8 py-6 pb-24 min-h-screen">
      <div class="flex flex-col gap-4 mb-8">
        <h1 class="text-white text-5xl font-bold">Charts</h1>
        <div class="relative w-fit z-50">
            <button id="country-select-btn" class="text-gray-300 font-bold text-xl flex items-center gap-2 hover:text-white transition-colors">
                <span id="selected-country-name">Global</span>
                <svg class="w-5 h-5 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
            </button>
            <div id="country-dropdown" class="absolute top-full left-0 mt-2 w-56 bg-[#282828] rounded-md shadow-xl opacity-0 invisible transition-all duration-200 origin-top-left overflow-hidden border border-gray-700">
                <div class="p-3 border-b border-gray-700 text-gray-400 text-xs uppercase font-bold">Select a country</div>
                <div id="country-list" class="py-1"></div>
            </div>
        </div>
      </div>
      <section class="mb-12">
        <h2 class="text-white text-2xl font-bold mb-4">Video charts</h2>
        <div id="video-charts-container" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
             ${Array(5).fill(0).map(() => `
                <div class="animate-pulse">
                  <div class="bg-gray-800 w-full aspect-video rounded-md mb-3"></div>
                  <div class="h-4 bg-gray-800 rounded w-3/4 mb-2"></div>
                  <div class="h-3 bg-gray-800 rounded w-1/2"></div>
                </div>`).join('')}
        </div>
      </section>
      <section class="mb-12">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-white text-2xl font-bold">Top artists</h2>
          <div class="flex gap-2">
              <button id="artist-prev" class="text-white text-xl px-3 py-1 hover:bg-gray-800 rounded-full disabled:opacity-30">⟨</button>
              <button id="artist-next" class="text-white text-xl px-3 py-1 hover:bg-gray-800 rounded-full disabled:opacity-30">⟩</button>
          </div>
        </div>
        <div class="overflow-hidden">
          <div id="artist-slider" class="flex">
             <p class="text-white">Loading</p>
          </div>
        </div>
      </section>
    </div>
  `;
}

export async function initChartPage() {
  const countryBtn = document.getElementById("country-select-btn");
  const countryDropdown = document.getElementById("country-dropdown");
  const countryListEl = document.getElementById("country-list");
  const selectedNameEl = document.getElementById("selected-country-name");

  if (countryBtn) {
    countryBtn.onclick = (e) => {
      e.stopPropagation();
      countryDropdown.classList.toggle("invisible");
      countryDropdown.classList.toggle("opacity-0");
    };
  }

  document.addEventListener("click", () => {
    if (countryDropdown && !countryDropdown.classList.contains("invisible")) {
      countryDropdown.classList.add("invisible", "opacity-0");
    }
  });

  try {
    const res = await fetch(`${API_BASE_URL}/charts/countries`);
    const data = await res.json();
    const countries = data.countries || [];

    if (countryListEl) {
      countryListEl.innerHTML = countries.map(c => `
          <button class="country-option w-full text-left px-4 py-3 hover:bg-gray-700 flex items-center justify-between group" data-code="${c.code}" data-name="${c.name}">
              <span class="text-white font-medium">${c.name}</span>
              ${c.code === currentCountryCode ? '<span class="text-white check-mark">✓</span>' : '<span class="text-white check-mark hidden">✓</span>'}
          </button>
      `).join("");

      document.querySelectorAll(".country-option").forEach(btn => {
        btn.onclick = async () => {
          currentCountryCode = btn.dataset.code;
          selectedNameEl.textContent = btn.dataset.name;
          document.querySelectorAll(".check-mark").forEach(el => el.classList.add("hidden"));
          btn.querySelector(".check-mark").classList.remove("hidden");
          await fetchChartData(currentCountryCode);
        };
      });
    }
  } catch (e) { console.error(e); }

  await fetchChartData(currentCountryCode);
}

async function fetchChartData(countryCode) {
  const videoContainer = document.getElementById("video-charts-container");
  const artistSlider = document.getElementById("artist-slider");

  if (videoContainer) videoContainer.style.opacity = "0.5";
  if (artistSlider) artistSlider.style.opacity = "0.5";

  try {
    const [videoRes, artistRes] = await Promise.all([
      fetch(`${API_BASE_URL}/charts/videos?country=${countryCode}`),
      fetch(`${API_BASE_URL}/charts/top-artists?country=${countryCode}`)
    ]);
    const videoData = await videoRes.json();
    const artistData = await artistRes.json();

    renderVideoCharts(videoData, videoContainer);
    renderTopArtists(artistData, artistSlider);
    attachClickEvents();
  } catch (error) {
    console.error(error);
  } finally {
    if (videoContainer) videoContainer.style.opacity = "1";
    if (artistSlider) artistSlider.style.opacity = "1";
  }
}

function renderVideoCharts(data, container) {
  if (!container) return;
  const items = (data.items || []).slice(0, 10);
  container.innerHTML = items.map(item => `
      <div class="js-navigate-item flex flex-col gap-2 cursor-pointer group" data-type="video" data-id="${item._id}"> 
          <div class="relative w-full aspect-video bg-gray-800 rounded-md overflow-hidden shadow-lg">
              <img src="${item.thumb}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
              <div class="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors"></div>
              <div class="absolute bottom-2 left-2">
                  <p class="text-white font-black text-4xl drop-shadow-md shadow-black stroke-black opacity-80">${item.rank || '#'}</p>
              </div>
              <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div class="bg-black/60 rounded-full p-3 backdrop-blur-sm">
                      <svg class="w-8 h-8 text-white fill-current" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                  </div>
              </div>
          </div>
          <div>
              <p class="text-white font-bold text-base truncate" title="${item.title}">${item.title}</p>
              <p class="text-gray-400 text-sm font-medium">Chart • ${formatViews(item.views)} views</p>
          </div>
      </div>
  `).join("");
}

function renderTopArtists(data, container) {
  if (!container) return;
  const items = data.items || [];
  const ITEMS_PER_PAGE = 12;
  const pages = Math.ceil(items.length / ITEMS_PER_PAGE);
  let html = "";

  for (let i = 0; i < pages; i++) {
    const start = i * ITEMS_PER_PAGE;
    const pageItems = items.slice(start, start + ITEMS_PER_PAGE);
    html += `
      <div class="min-w-full flex-shrink-0 pr-6">
          <div class="grid grid-rows-4 grid-flow-col gap-x-8 gap-y-4">
              ${pageItems.map(artist => {
                let trendIcon = '<span class="w-2 h-2 bg-gray-500 rounded-full ml-2"></span>';
                if (artist.trend === 'up') trendIcon = '<span class="text-green-500 ml-2 text-xs">▲</span>';
                else if (artist.trend === 'down') trendIcon = '<span class="text-red-500 ml-2 text-xs">▼</span>';
                const fakeThumb = `https://ui-avatars.com/api/?name=${encodeURIComponent(artist.name)}&background=random&color=fff&size=100`;
                return `
                  <div class="flex items-center gap-4 w-64 group cursor-pointer p-2 rounded hover:bg-gray-800 transition-colors">
                      <div class="relative w-12 h-12 flex-shrink-0">
                          <img src="${fakeThumb}" class="w-full h-full rounded-full object-cover">
                      </div>
                      <div class="flex flex-col items-center justify-center w-6">
                          <span class="text-white font-bold text-lg">${artist.rank}</span>
                          ${trendIcon}
                      </div>
                      <div class="flex flex-col overflow-hidden">
                          <p class="text-white font-bold truncate text-base">${artist.name}</p>
                          <p class="text-gray-400 text-sm truncate">${formatViews(artist.totalViews)} views</p>
                      </div>
                  </div>`;
              }).join("")}
          </div>
      </div>`;
  }
  container.innerHTML = html;
  initArtistSlider(pages);
}

function formatViews(num) {
  if (!num) return "0";
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toString();
}

function initArtistSlider(totalPages) {
  const slider = document.getElementById("artist-slider");
  const prev = document.getElementById("artist-prev");
  const next = document.getElementById("artist-next");
  if (!slider || !prev || !next) return;

  let current = 0;
  function update() {
    slider.style.transform = `translateX(-${current * 100}%)`;
    prev.disabled = current === 0;
    next.disabled = current >= totalPages - 1;
    prev.style.opacity = current === 0 ? "0.3" : "1";
    next.style.opacity = current >= totalPages - 1 ? "0.3" : "1";
  }
  prev.onclick = () => { if (current > 0) { current--; update(); } };
  next.onclick = () => { if (current < totalPages - 1) { current++; update(); } };
  update();
}

function attachClickEvents() {
  const items = document.querySelectorAll(".js-navigate-item");
  items.forEach(item => {
    item.onclick = (e) => {
      e.preventDefault();
      e.stopPropagation();
      const type = item.dataset.type;
      const id = item.dataset.id;
      if (type === "video") {
        window.history.pushState({ page: "video", id: id }, "", `/?page=video&id=${id}`);
        window.dispatchEvent(new Event("popstate"));
      }
    };
  });
}