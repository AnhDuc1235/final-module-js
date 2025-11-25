const API_BASE_URL = "https://youtube-music.f8team.dev/api";

export default function NewMusicVideosPage() {
  return `
    <div class="main-layout-wrapper flex flex-col min-h-screen bg-black text-white">
      <div class="w-full">
          <h1 class="text-3xl font-bold mb-6">Music videos</h1>
          <div id="new-videos-grid" class="w-full min-h-[200px]">
             <div class="flex h-40 items-center justify-center">
               <p class="text-3xl md:text-4xl font-bold mb-6 capitalize text-white">Loading</p>
             </div>
          </div>
      </div>
    </div>
  `;
}

export async function initNewVideoData() {
  const container = document.getElementById("new-videos-grid");
  if (!container) return;

  try {
    const response = await fetch(`${API_BASE_URL}/explore/videos`);
    const data = await response.json();
    const videoList = data.items || [];

    if (videoList.length > 0) {
      container.className = "grid grid-cols-2 lg:grid-cols-4 gap-6 w-full";
      
      container.innerHTML = videoList.map(v => `
        <div class="flex flex-col gap-2 cursor-pointer group js-video-item" data-id="${v.id}">
           <div class="relative w-full aspect-video bg-gray-800 rounded-lg overflow-hidden">
              <img src="${v.thumb}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" alt="${v.name}">
              <div class="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                  <div class="w-12 h-12 bg-black/60 rounded-full flex items-center justify-center backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity transform scale-75 group-hover:scale-100">
                      <div class="w-0 h-0 border-t-[8px] border-t-transparent border-l-[14px] border-l-white border-b-[8px] border-b-transparent ml-1"></div>
                  </div>
              </div>
           </div>
           <div>
              <h3 class="text-white font-bold text-base truncate pr-2" title="${v.name}">${v.name}</h3>
              <p class="text-gray-400 text-sm truncate">
                ${v.author || 'null'} • ${(v.views || 0).toLocaleString()} views
              </p>
           </div>
        </div>
      `).join("");

      const items = container.querySelectorAll(".js-video-item");
      items.forEach(item => {
          item.onclick = (e) => {
              e.preventDefault();
              const id = item.dataset.id;
              window.history.pushState({ page: "video", id: id }, "", `/?page=video&id=${id}`);
              window.dispatchEvent(new Event("popstate"));
          };
      });

    } else {
      container.innerHTML = `<p class="text-gray-400">Không có video nào</p>`;
    }

  } catch (error) {
    console.error("Error loading videos:", error);
    container.innerHTML = `
        <div class="text-center col-span-full py-10">
            <p class="text-white mb-2">Không thể tải video</p>
        </div>`;
  }
}