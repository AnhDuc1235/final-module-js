//debound search
const debounce = (callback, timeout = 500) => {
    let timeoutID;
    return (...args) => {
        clearTimeout(timeoutID);
        timeoutID = setTimeout(() => {
            callback(...args);
        }, timeout);
    }
}

export const initSearchLogic = () => {
    const searchInput = document.querySelector(".js-search");
    const suggestBox = document.querySelector(".js-suggest-box");
    if (!searchInput || !suggestBox) return;

    // Sang trang searchPage
    const goToSearch = (keyword) => {
        if (!keyword) return;
        window.history.pushState({}, "", `/search?q=${encodeURIComponent(keyword)}`);
        window.dispatchEvent(new PopStateEvent('popstate'));
        suggestBox.classList.add("hidden");
    };
    searchInput.addEventListener("input", debounce(async (e) => {
        const keyword = e.target.value.trim();

        if (!keyword) {
            suggestBox.classList.add("hidden");
            return;
        }

        try {
            //api
            const res = await fetch(`https://youtube-music.f8team.dev/api/search/suggestions?q=${encodeURIComponent(keyword)}`);
            const data = await res.json();
            const suggestions = data.data?.suggestions || data.suggestions || [];

            if (suggestions.length === 0) {
                suggestBox.classList.add("hidden");
            } else {
                //list gợi ý
                suggestBox.innerHTML = suggestions.map(text => `
                    <div class="js-suggest-item px-4 py-2 hover:bg-[#3e3e3e] cursor-pointer text-white truncate text-sm">
                        ${text}
                    </div>
                `).join('');
                suggestBox.classList.remove("hidden");

                document.querySelectorAll('.js-suggest-item').forEach(item => {
                    item.addEventListener('click', () => {
                        const text = item.innerText.trim();
                        searchInput.value = text;
                        goToSearch(text);
                    });
                });
            }
        } catch (err) {
            console.error(err);
            suggestBox.classList.add("hidden");
        }
    }, 400));

    //enter để tìm 
    searchInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            goToSearch(searchInput.value.trim());
        }
    });

    document.addEventListener("click", (e) => {
        if (!searchInput.contains(e.target) && !suggestBox.contains(e.target)) {
            suggestBox.classList.add("hidden");
        }
    });
    searchInput.addEventListener("focus", () => {
        if (searchInput.value.trim() && suggestBox.innerHTML.trim()) {
            suggestBox.classList.remove("hidden");
        }
    });
};