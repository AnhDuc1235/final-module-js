const Header = (user) => {

  const params = new URLSearchParams(window.location.search);
  const currentQuery = params.get('q') || '';

  const leftMenuHtml = `
    <div class="flex items-center gap-[20px]">
        <button class="js-hamburger w-[40px] h-[40px] flex items-center justify-center cursor-pointer">
            <img src="./public/hamburger.png" alt="" class="w-[24px]" />
        </button>
        <a href="/" class="js-spa-home flex items-center">
            <img src="//music.youtube.com/img/on_platform_logo_dark.svg" alt="" class="w-[90px]">
        </a>
    </div>
  `;

  const searchBarHtml = `
    <div class="js-searchbar flex relative group z-99"> 
      <div class="flex items-center bg-[#FFFFFF26] rounded-[5px] overflow-hidden">          
          <input 
            type="text" 
            value="${currentQuery}" 
            class="js-search w-[440px] h-[40px] placeholder-[rgba(255,255,255,0.5)] pl-3 text-white outline-none" 
            placeholder="Search songs, albums, artists, podcasts" 
            autocomplete="off" 
          />
      </div>

      <div class="js-suggest-box hidden absolute top-[50px] left-0 w-full bg-[#212121] rounded-lg shadow-lg py-2 border border-[#333]">
      </div>
    </div>
  `;

  //khi chưa đăng nhập
  if (!user) {
    return `
    <div class="js-header-inner flex justify-between items-center bg-black h-[64px] px-4 fixed top-0 left-0 right-0 z-[100] border-b border-[#333]">  
        ${leftMenuHtml}

        <div class="js-searchbar flex"> 
          ${searchBarHtml}
        </div>

        <div class="js-login w-auto flex justify-end mr-[20px]">
          <div class="js-open-auth-modal w-[74px] h-auto bg-white rounded-[100px] cursor-pointer hover:bg-gray-200">
            <p class="text-black text-center p-[5px] font-bold">Sign in</p>
          </div>
        </div>
    </div>`;
  }

  
  //khi đã đăng nhập
  return `
    <div class="js-header-inner flex justify-between items-center bg-black h-[64px] px-4 fixed top-0 left-0 right-0 z-[100] border-b border-[#333]">  
        ${leftMenuHtml}

        <div class="js-searchbar flex"> 
          ${searchBarHtml}
        </div>

        <div class="relative mr-[20px]">
            <div class="js-toggle-dropdown w-[35px] h-[35px] rounded-full bg-blue-300 flex items-center justify-center text-white font-bold cursor-pointer select-none border border-transparent hover:border-white">
                <span>OK</span>
            </div>

            <div class="js-dropdown-menu hidden absolute right-0 top-[45px] bg-[#282828] w-[280px] rounded-md shadow-xl z-50 border border-[#333] py-2">
                <div class="flex items-center px-4 py-3 border-b border-[#3e3e3e] mb-1">
                      <div class="w-[35px] h-[35px] rounded-full bg-blue-300 flex items-center justify-center text-white font-bold mr-3">
                        <span>OK</span>
                    </div>
                    <div class="overflow-hidden">
                        <p class="text-white font-bold text-sm truncate">${user.name}</p>
                        <p class="text-gray-400 text-xs truncate">${user.email}</p>
                    </div>
                </div>
                
                <div class="js-open-profile px-4 py-2 text-gray-200 hover:bg-[#3e3e3e] cursor-pointer flex items-center gap-3">
                    <span>Thông tin cá nhân</span>
                </div>
                <div class="js-logout px-4 py-2 text-gray-200 hover:bg-[#3e3e3e] cursor-pointer flex items-center gap-3">
                      <span class="text-red-400">Đăng xuất</span>
                </div>
            </div>
        </div>
    </div>`;
};

export default Header;