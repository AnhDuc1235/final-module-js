import { authService } from "../service/auth";

export const initGlobalAuthEvents = () => {
    const authModal = document.getElementById('auth-modal');
    const btnOpenLogin = document.querySelector('.js-open-auth-modal'); // Nút Sign in ở Header
    const btnCloseAuth = document.querySelector('.js-close-modal');
    if (btnOpenLogin) {
        btnOpenLogin.onclick = (e) => {
            e.preventDefault();
            if (authModal) authModal.classList.remove('hidden');
        };
    }
    if (btnCloseAuth) {
        btnCloseAuth.onclick = () => authModal.classList.add('hidden');
    }

    // chuyển Tab login/register
    const tabLogin = document.getElementById('tab-login');
    const tabRegister = document.getElementById('tab-register');
    const formLogin = document.getElementById('form-login');
    const formRegister = document.getElementById('form-register');

    if (tabLogin && tabRegister) {
        tabLogin.onclick = () => {
            formLogin.classList.remove('hidden');
            formRegister.classList.add('hidden');
            tabLogin.classList.add('border-white', 'text-white');
            tabLogin.classList.remove('text-gray-500');
            tabRegister.classList.remove('border-white', 'text-white');
            tabRegister.classList.add('text-gray-500');
        };
        tabRegister.onclick = () => {
            formRegister.classList.remove('hidden');
            formLogin.classList.add('hidden');
            tabRegister.classList.add('border-white', 'text-white');
            tabRegister.classList.remove('text-gray-500');
            tabLogin.classList.remove('border-white', 'text-white');
            tabLogin.classList.add('text-gray-500');
        };
    }

    //login
    if (formLogin) {
        formLogin.onsubmit = async (e) => {
            e.preventDefault();
            const res = await authService.login(formLogin.elements.email.value, formLogin.elements.password.value);
            if (res.success) window.location.reload();
            else {
                const err = document.getElementById('login-error');
                if(err) { 
                    err.innerText = res.message; err.classList.remove('hidden'); 
                }
            }
        };
    }

    //register
    if (formRegister) {
        formRegister.onsubmit = async (e) => {
            e.preventDefault();
            const res = await authService.register(
                formRegister.elements.name.value,
                formRegister.elements.email.value,
                formRegister.elements.password.value,
                formRegister.elements.confirmPassword.value
            );
            if (res.success) { 
                alert("Đăng ký thành công"); window.location.reload(); 
            }
            else {
                const err = document.getElementById('register-error');
                if(err) { 
                    err.innerText = res.message; err.classList.remove('hidden'); 
                }
            }
        };
    }

    // dropdown + profile
    const btnAvatar = document.querySelector('.js-toggle-dropdown');
    const dropdown = document.querySelector('.js-dropdown-menu');
    const profileModal = document.getElementById('profile-modal');
    const btnOpenProfile = document.querySelector('.js-open-profile');
    const btnCloseProfile = document.querySelector('.js-close-profile');

    if (btnAvatar && dropdown) {
        btnAvatar.onclick = (e) => {
            e.stopPropagation();
            dropdown.classList.toggle('hidden');
        };
        document.addEventListener('click', () => {
            if (!dropdown.classList.contains('hidden')) dropdown.classList.add('hidden');
        });
    }

    //mở profile
    if (btnOpenProfile && profileModal) {
        btnOpenProfile.onclick = () => {
            profileModal.classList.remove('hidden');
            if(dropdown) dropdown.classList.add('hidden');
        };
    }
    if (btnCloseProfile) {
        btnCloseProfile.onclick = () => profileModal.classList.add('hidden');
    }

    //update profile
    const formUpdate = document.getElementById('form-update-profile');
    if (formUpdate) {
        formUpdate.onsubmit = async (e) => {
            e.preventDefault();
            const res = await authService.updateProfile(formUpdate.elements.name.value, formUpdate.elements.email.value);
            if (res.success) { 
                alert("Cập nhật thành công"); window.location.reload(); 
            }
            else alert(res.message);
        };
    }

    //đổi mật khẩu
    const formChangePass = document.getElementById('form-change-pass');
    if(formChangePass) {
         formChangePass.onsubmit = async (e) => {
            e.preventDefault();
            const res = await authService.changePassword(
                formChangePass.elements.oldPassword.value,
                formChangePass.elements.password.value,
                formChangePass.elements.confirmPassword.value
            );
            if (res.success) { 
                alert("Đổi mật khẩu thành công"); formChangePass.reset(); 
            }
            else alert(res.message);
        }
    }

    //logout
    const btnLogout = document.querySelector('.js-logout');
    if (btnLogout) {
        btnLogout.onclick = () => authService.logout();
    }
};