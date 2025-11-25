const API_BASE_URL = "https://youtube-music.f8team.dev/api";

export default function MoodDetailPage() {
  return `
    <div class="pb-32 min-h-screen bg-black text-white animate-fade-in">
      <h1 id="mood-title" class="text-3xl md:text-4xl font-bold mb-6 capitalize text-white">Loading</h1>
      <div id="mood-container" class="flex flex-col gap-10">
      </div>
    </div>
  `;
}

export async function initMoodDetail(slug, type) {
  const container = document.getElementById("mood-container");
  const titleEl = document.getElementById("mood-title");

  if (!container) return;

  try {
    let sectionsHTML = "";

    if (type === 'categories') {
      const res = await fetch(`${API_BASE_URL}/categories/${slug}`);
      const data = await res.json();
      
      if (titleEl) titleEl.innerText = data.name || data.title || slug;

      if (data.subcategories && Array.isArray(data.subcategories)) {
        data.subcategories.forEach(sub => {
          if (sub.playlists && sub.playlists.length > 0) {
              sectionsHTML += renderSection(sub.name, sub.playlists, "playlist");
          }
        });
      }
    } 
    
    else if (type === 'lines') {
      const res = await fetch(`${API_BASE_URL}/lines/${slug}`);
      const info = await res.json();
      
      if (titleEl) titleEl.innerText = info.name || info.title || slug;

      const [songs, albums, playlists, videos] = await Promise.all([
         fetchData(`${API_BASE_URL}/lines/${slug}/songs?limit=20`),
         fetchData(`${API_BASE_URL}/lines/${slug}/albums?limit=20`),
         fetchData(`${API_BASE_URL}/lines/${slug}/playlists?limit=20`),
         fetchData(`${API_BASE_URL}/lines/${slug}/videos?limit=20`)
      ]);
      
      if (songs.length) sectionsHTML += renderSection("Top Songs", songs, "song");
      if (albums.length) sectionsHTML += renderSection("Albums", albums, "album");
      if (playlists.length) sectionsHTML += renderSection("Playlists", playlists, "playlist");
      if (videos.length) sectionsHTML += renderSection("Music Videos", videos, "video");
    }

    if (!sectionsHTML) {
      container.innerHTML = `<p class="text-gray-400">Không có dữ liệu cho mục này.</p>`;
    } else {
      container.innerHTML = sectionsHTML;
      attachClickEvents();
    }

  } catch (error) {
    console.error("Mood Error:", error);
    container.innerHTML = `<p class="text-red-500">Lỗi tải dữ liệu. Vui lòng thử lại.</p>`;
  }
}

async function fetchData(url) {
    try {
        const res = await fetch(url);
        const json = await res.json();
        return json.data || json.items || (Array.isArray(json) ? json : []);
    } catch { return []; }
}

function getImg(item) {
    if (item.thumb) return item.thumb;
    if (item.thumbnails && Array.isArray(item.thumbnails) && item.thumbnails.length > 0) {
        return item.thumbnails[0].url || item.thumbnails[0];
    }
    if (item.thumbnailUrl) return item.thumbnailUrl;
    return ;
}

function getArtists(item) {
    if (item.artists && Array.isArray(item.artists)) {
        return item.artists.map(a => a.name || a).join(", ");
    }
    return item.albumName || "Unknown Artist";
}

function renderSection(title, items, type) {
    if (!items || items.length === 0) return "";

    const itemsHTML = items.map(item => {
        const id = item.id || item._id || ""; 
        const slug = item.slug || "";
        
        const img = getImg(item);
        const name = item.title || item.name || "";
        const desc = getArtists(item);

        return `
            <div class="js-navigate-item min-w-[160px] w-[160px] md:min-w-[200px] md:w-[200px] cursor-pointer group" 
                 data-type="${type}" 
                 data-id="${id}" 
                 data-slug="${slug}">
                 
                <div class="w-full aspect-square rounded-lg overflow-hidden mb-3 relative bg-gray-800">
                    <img src="${img}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy">
                    <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <i class="fas fa-play text-white text-2xl"></i>
                    </div>
                </div>
                
                <h3 class="text-white font-medium truncate text-sm mb-1">${name}</h3>
                <p class="text-gray-400 text-xs truncate">${desc}</p>
            </div>
        `;
    }).join("");

    return `
        <section>
            <h2 class="text-xl font-bold text-white mb-4">${title}</h2>
            <div class="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                ${itemsHTML}
            </div>
        </section>
    `;
}

function attachClickEvents() {
    const items = document.querySelectorAll(".js-navigate-item");
    
    items.forEach(item => {
        item.onclick = (e) => {
            e.preventDefault();
            e.stopPropagation();

            const type = item.dataset.type;
            const id = item.dataset.id;
            const slug = item.dataset.slug;

            let url = "";
            let state = {};

            if (type === "song") {
                url = `/?page=song&id=${id}`; 
                state = { page: "song", id: id };
            } 
            else if (type === "video") {
                url = `/?page=video&id=${id}`; 
                state = { page: "video", id: id };
            } 
            else if (type === "album") {
                url = `/?page=detail&slug=${slug}&type=album`;
                state = { page: "detail", slug: slug, type: "album" };
            } 
            else if (type === "playlist") {
                url = `/?page=detail&slug=${slug}&type=playlist`;
                state = { page: "detail", slug: slug, type: "playlist" };
            }

            if (url) {
                window.history.pushState(state, "", url);
                window.dispatchEvent(new Event("popstate"));
            }
        };
    });
}