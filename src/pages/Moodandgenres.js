const API_BASE_URL = "https://youtube-music.f8team.dev/api";

function renderGridSection(title, list = []) {
  if (!Array.isArray(list) || list.length === 0) return "";
  return `
    <section class="mb-12">
      <div class="mb-4">
        <p class="text-white text-2xl font-bold">${title}</p>
      </div>
      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        ${list.map(item => `
          <button 
            class="mood-btn-detail bg-gray-900 hover:bg-gray-800 rounded-r-lg rounded-l-sm px-4 py-3 text-left text-white text-sm truncate border-l-[6px] transition-all hover:pl-5 cursor-pointer"
            style="border-left-color: ${item.color || '#fff'};"
            data-slug="${item.slug}" 
            data-type="${item.type}" 
          >
            ${item.name}
          </button>`
        ).join("")}
      </div>
    </section>
  `;
}

export default function MoodsOverview() {
  return `
    <div class="main-layout-wrapper flex flex-col min-h-screen bg-black">
      <div class="top-section flex flex-grow overflow-hidden">
        <div class="content-area flex flex-col flex-1 overflow-hidden bg-black">
          <div class="flex-1 overflow-auto scroll-smooth" id="moods-real-content">
             <div class="flex h-full items-center justify-center">
               <p class="text-white">Loading</p>
             </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

export async function initMoodsData() {
  const container = document.getElementById("moods-real-content");
  if (!container) return;

  try {
    const [categoriesRes, linesRes] = await Promise.all([
        fetch(`${API_BASE_URL}/categories`),
        fetch(`${API_BASE_URL}/lines`)
    ]);

    const categoriesData = await categoriesRes.json();
    const linesData = await linesRes.json();

    const moodList = (categoriesData.items || []).map(item => ({
        name: item.name,
        color: item.color || "#FF4081",
        slug: item.slug,
        type: 'categories'
    }));

    const genreList = (linesData.items || []).map(item => ({
        name: item.name,
        color: item.color || "#00E5FF",
        slug: item.slug,
        type: 'lines'
    }));

    container.innerHTML = 
        renderGridSection("Moods & moments", moodList) + 
        renderGridSection("Genres", genreList) +
        `<div class="h-20"></div>`;

  } catch (error) {
    console.error("Error loading moods:", error);
    container.innerHTML = `<p class="text-white text-center mt-10">Lỗi tải dữ liệu.</p>`;
  }
}