const API_BASE_URL = "https://youtube-music.f8team.dev/api";

export default function NewReleasePage() {
  return `
    <div class="px-8 py-6 pb-24 min-h-screen animate-fade-in">
      <div class="flex items-center gap-4 mb-8">
        <h1 class="text-white text-4xl font-bold">New releases</h1>
      </div>

      <section class="mb-12">
        <div class="flex justify-between items-center mb-4">
             <h2 class="text-white text-xl font-bold">Top Albums</h2>
             <div class="flex gap-2">
                <button id="nr-prev" class="text-white text-xl px-3 py-1 hover:bg-gray-800 rounded-full disabled:opacity-30">⟨</button>
                <button id="nr-next" class="text-white text-xl px-3 py-1 hover:bg-gray-800 rounded-full disabled:opacity-30">⟩</button>
            </div>
        </div>
        <div class="overflow-hidden">
            <div id="nr-slider" class="flex gap-6 transition-transform duration-300 min-h-[200px] items-center">
                <p class="text-gray-500 pl-4">Loading albums...</p>
            </div>
        </div>
      </section>

      <section class="mb-12">
        <div class="flex justify-between items-center mb-4">
          <p class="text-white text-2xl font-bold">Music videos</p>
          <div class="flex gap-2">
              <button id="mv-prev" class="text-white text-xl px-3 py-1 hover:bg-gray-800 rounded-full disabled:opacity-30">⟨</button>
              <button id="mv-next" class="text-white text-xl px-3 py-1 hover:bg-gray-800 rounded-full disabled:opacity-30">⟩</button>
          </div>
        </div>
        <div class="overflow-hidden">
          <div id="mv-slider" class="flex gap-6 transition-transform duration-300 min-h-[200px] items-center">
             <p class="text-gray-500 pl-4">Loading videos...</p>
          </div>
        </div>
      </section>
    </div>
  `;
}

export async function initNewReleaseData() {
  setTimeout(async () => {
      
      const albumContainer = document.getElementById("nr-slider");
      const videoContainer = document.getElementById("mv-slider");

      if (!albumContainer && !videoContainer) return;

      try {
        const [albumRes, videoRes] = await Promise.all([
            fetch(`${API_BASE_URL}/explore/new-releases`),
            fetch(`${API_BASE_URL}/explore/videos`)
        ]);

        const albumData = await albumRes.json();
        const videoData = await videoRes.json();

        const albumList = Array.isArray(albumData) ? albumData : (albumData.items || []);
        if (albumContainer) {
            albumContainer.innerHTML = albumList.slice(0, 10).map(item => `
                <div class="js-navigate-item w-48 flex-shrink-0 cursor-pointer group" 
                     data-type="album" 
                     data-slug="${item.encodeId || item.id}"> 
                 <div class="relative w-full aspect-square rounded-md overflow-hidden mb-3">
                    <img src="${item.thumb || item.thumbnail}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
                    <div class="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors"></div>
                    <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <div class="bg-black/40 rounded-full p-3 backdrop-blur-sm">
                            <svg class="w-8 h-8 text-white fill-current" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                          </div>
                    </div>
                 </div>
                 <p class="text-white font-bold text-base truncate leading-tight">${item.title || item.name}</p>
                 <p class="text-gray-400 text-sm mt-1">${item.albumType || 'Album'}</p>
                </div>
            `).join("");
            setupSlider("nr-slider", "nr-prev", "nr-next", 216);
        }

        const videoList = (videoData.items || []).map(v => ({
            title: v.name || v.title, 
            thumbnail: v.thumb || v.thumbnail, 
            views: v.views || 0, 
            id: v.encodeId || v.id
        }));
        
        if (videoContainer) {
            videoContainer.innerHTML = videoList.map(v => `
                <div class="js-navigate-item w-80 flex-shrink-0 cursor-pointer group" 
                     data-type="video" 
                     data-slug="${v.id}">
                  <div class="w-full h-44 bg-gray-800 rounded-lg overflow-hidden mb-3 relative">
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
                </div>
            `).join("");
            setupSlider("mv-slider", "mv-prev", "mv-next", 344);
        }

        attachClickEvents();

      } catch (error) {
        console.error("Error loading New Releases:", error);
        if(albumContainer) albumContainer.innerHTML = `<p class="text-white">Lỗi tải dữ liệu</p>`;
      }
  }, 0);
}

function setupSlider(sliderId, prevId, nextId, itemWidth) {
    const slider = document.getElementById(sliderId);
    const prev = document.getElementById(prevId);
    const next = document.getElementById(nextId);
    if (!slider || !prev || !next) return;

    let current = 0;
    const newPrev = prev.cloneNode(true);
    const newNext = next.cloneNode(true);
    prev.parentNode.replaceChild(newPrev, prev);
    next.parentNode.replaceChild(newNext, next);

    const update = () => {
        if(!slider.parentElement) return;
        const containerWidth = slider.parentElement.offsetWidth;
        const visibleItems = Math.floor(containerWidth / itemWidth);
        const maxIndex = Math.max(0, slider.children.length - visibleItems);
        if (current > maxIndex) current = maxIndex;
        if (current < 0) current = 0;
        
        slider.style.transform = `translateX(-${current * itemWidth}px)`;
        newPrev.disabled = current === 0;
        newNext.disabled = current >= maxIndex;
        newPrev.style.opacity = current === 0 ? "0.3" : "1";
        newNext.style.opacity = current >= maxIndex ? "0.3" : "1";
    }
    newPrev.addEventListener('click', () => { if (current > 0) { current--; update(); }});
    newNext.addEventListener('click', () => { current++; update(); });
    const resizeObserver = new ResizeObserver(() => update());
    resizeObserver.observe(slider.parentElement);
    
    update();
}

function attachClickEvents() {
    const items = document.querySelectorAll(".js-navigate-item");
    items.forEach(item => {
        item.onclick = (e) => {
            e.preventDefault();
            e.stopPropagation();
            const type = item.dataset.type;
            const slug = item.dataset.slug;

            if (!slug) return;

            let url = "";
            let state = {};

            if (type === "video") {
                url = `/?page=video&id=${slug}`;
                state = { page: "video", id: slug };
            } else if (type === "album") {
                url = `/?page=detail&type=album&slug=${slug}`;
                state = { page: "detail", type: "album", slug: slug };
            }

            if (url) {
                window.history.pushState(state, "", url);
                window.dispatchEvent(new Event("popstate"));
            }
        };
    });
}