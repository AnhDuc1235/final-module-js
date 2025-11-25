export const AuthModalHTML = () => `
<div id="auth-modal" class="fixed inset-0 flex items-center justify-center bg-black/80 z-[100] hidden">
    <div class="bg-[#121212] w-[400px] p-8 rounded-xl shadow-2xl border border-[#333] relative">
        <button class="js-close-modal absolute top-3 right-4 text-gray-400 text-2xl">&times;</button>
        
        <div class="flex mb-6">
            <button id="tab-login" class="flex-1 py-2 text-white font-bold">Đăng nhập</button>
            <button id="tab-register" class="flex-1 py-2 text-gray-500 font-bold">Đăng ký</button>
        </div>

        <form id="form-login" class="flex flex-col gap-4">
            <input type="email" name="email" placeholder="Email" class="bg-[#0f0f0f] text-white p-3 rounded border border-[#393838]" required />
            <input type="password" name="password" placeholder="Mật khẩu" class="bg-[#0f0f0f] text-white p-3 rounded border border-[#393838]" required />
            <p id="login-error" class="text-red-500 text-sm hidden"></p>
            <button class="bg-white text-black font-bold py-2 rounded hover:bg-gray-200">Đăng nhập</button>
        </form>

        <form id="form-register" class="flex flex-col gap-4 hidden">
            <input type="text" name="name" placeholder="Tên" class="bg-[#0f0f0f] text-white p-3 rounded border border-[#333]" required />
            <input type="email" name="email" placeholder="Email" class="bg-[#0f0f0f] text-white p-3 rounded border border-[#333]" required />
            <input type="password" name="password" placeholder="Mật khẩu" class="bg-[#0f0f0f] text-white p-3 rounded border border-[#333]" required />
            <input type="password" name="confirmPassword" placeholder="Xác nhận mật khẩu" class="bg-[#0f0f0f] text-white p-3 rounded border border-[#333]" required />
            <p id="register-error" class="text-red-500 text-sm hidden"></p>
            <button class="bg-white text-black font-bold py-2 rounded hover:bg-gray-200">Đăng ký</button>
        </form>
    </div>
</div>`;

export const ProfileModalHTML = (user) => {
    if(!user) return '';
    return `
<div id="profile-modal" class="fixed inset-0 bg-black z-[100] hidden overflow-auto">
    <div class="max-w-3xl mx-auto mt-10 p-6">
        <button class="js-close-profile text-white text-xl mb-4">Back</button>
        <h1 class="text-3xl font-bold text-white mb-8">Thông tin cá nhân</h1>
        
        <div class="grid grid-cols-1 gap-8">
            <div class="bg-[#1e1e1e] p-6 rounded-lg">
                <h2 class="text-xl text-white font-bold mb-4">Hồ sơ</h2>
                <form id="form-update-profile" class="flex flex-col gap-4">
                    <div>
                        <label class="text-gray-400 text-sm">Email</label>
                        <input type="email" name="email" value="${user.email}" class="w-full bg-[#121212] text-white p-3 rounded border border-[#333] required" />
                    </div>
                    <div>
                        <label class="text-gray-400 text-sm">Tên</label>
                        <input type="text" name="name" value="${user.name}" class="w-full bg-[#121212] text-white p-3 rounded border border-[#333]" required />
                    </div>
                    <button class="bg-white text-black font-bold py-2 px-6 rounded w-max hover:bg-blue-700">Cập nhật hồ sơ</button>
                </form>
                <h2 class="text-xl text-white font-bold mb-4 pt-10">Đổi mật khẩu</h2>
                <form id="form-change-pass" class="flex flex-col gap-4">
                    <input type="password" name="oldPassword" placeholder="Mật khẩu cũ" class="bg-[#121212] text-white p-3 rounded border border-[#333]" required />
                    <input type="password" name="password" placeholder="Mật khẩu mới" class="bg-[#121212] text-white p-3 rounded border border-[#333]" required />
                    <input type="password" name="confirmPassword" placeholder="Xác nhận mật khẩu mới" class="bg-[#121212] text-white p-3 rounded border border-[#333]" required />
                    <button class="bg-white text-black font-bold py-2 px-6 rounded w-max hover:bg-gray-500">Đổi mật khẩu</button>
                </form>
            </div>
        </div>
    </div>
</div>`;
}