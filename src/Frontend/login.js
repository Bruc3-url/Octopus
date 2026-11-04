import { useState } from 'react';
import { iniciarSesion, iniciarSesionOAuth } from '../Backend/index.js';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await iniciarSesion(email, password);
      setSuccess(true);
    } catch (error) {
      alert(`Error de autenticación: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-surface font-body-md text-body-md text-on-surface antialiased flex flex-col min-h-screen">
      {/* Header */}
      <header className="fixed top-0 inset-x-0 z-50 bg-surface/80 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] pt-safe">
        <div className="h-16 px-margin flex items-center justify-between">
          <button
            onClick={() => window.history.back()}
            className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full text-on-surface hover:bg-surface-container-high transition-colors -ml-space-xs"
            type="button"
          >
            <span className="material-symbols-outlined text-[20px]">arrow_back_ios_new</span>
          </button>
          <div className="flex items-center gap-space-xs">
            <div className="w-6 h-6 rounded-full bg-primary-container flex items-center justify-center">
              <span className="material-symbols-outlined text-on-primary text-[14px]">all_inclusive</span>
            </div>
            <span className="font-headline-sm text-headline-sm text-on-surface truncate">Sign In</span>
          </div>
          <div className="min-w-[44px] min-h-[44px] flex items-center justify-center">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-on-primary text-[18px]">person</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col relative w-full px-margin pt-16 bg-surface pb-safe">
        <div className="flex flex-col w-full pb-8">
          <div className="relative w-full overflow-hidden rounded-3xl bg-surface-container-low p-6 mb-6 shadow-sm">
            <div className="absolute -right-8 -top-8 w-36 h-36 rounded-full bg-primary-fixed/30 blur-2xl pointer-events-none"></div>
            <div className="absolute -left-6 -bottom-6 w-28 h-28 rounded-full bg-tertiary-fixed/20 blur-xl pointer-events-none"></div>
            <div className="relative flex items-center justify-between">
              <div className="space-y-1 pr-3">
                <h1 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface pt-1">
                  Bienvenido de vuelta
                </h1>
                <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                  Ingresa a tu santuario de productividad y cuida de Octy.
                </p>
              </div>
              <div className="relative flex-shrink-0 flex items-center justify-center w-20 h-20 rounded-full bg-surface-container-lowest shadow-md">
                <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-primary-container/20 to-tertiary-container/10"></div>
                <div className="relative flex flex-col items-center justify-center text-center">
                  <span className="material-symbols-outlined text-primary-container text-[38px] select-none transition-transform hover:rotate-12 duration-300">
                    cruelty_free
                  </span>
                  <span className="font-label-sm text-label-sm text-primary font-bold -mt-1 tracking-tight">Octy</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-surface-container-lowest rounded-3xl p-6 shadow-md space-y-5">
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="space-y-1.5">
                <label className="block font-label-md text-label-md text-on-surface-variant" htmlFor="emailInput">
                  Correo Electrónico
                </label>
                <div className="relative flex items-center">
                  <span className="material-symbols-outlined absolute left-4 text-outline text-[20px] pointer-events-none">
                    mail
                  </span>
                  <input
                    id="emailInput"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="alex@ejemplo.com"
                    className="w-full h-12 pl-12 pr-4 rounded-full bg-surface-container-low text-on-surface font-body-md text-body-md placeholder:text-outline/70 focus:outline-none focus:bg-surface-container-lowest focus:shadow-[0_0_0_3px_rgba(14,165,233,0.18)] transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block font-label-md text-label-md text-on-surface-variant" htmlFor="passwordInput">
                    Contraseña
                  </label>
                  <a className="font-label-md text-label-md text-primary font-semibold hover:underline focus:outline-none" href="#recovery">
                    ¿Olvidaste tu contraseña?
                  </a>
                </div>
                <div className="relative flex items-center">
                  <span className="material-symbols-outlined absolute left-4 text-outline text-[20px] pointer-events-none">
                    lock
                  </span>
                  <input
                    id="passwordInput"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full h-12 pl-12 pr-12 rounded-full bg-surface-container-low text-on-surface font-body-md text-body-md placeholder:text-outline/70 focus:outline-none focus:bg-surface-container-lowest focus:shadow-[0_0_0_3px_rgba(14,165,233,0.18)] transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 w-8 h-8 rounded-full flex items-center justify-center text-outline hover:text-on-surface focus:outline-none"
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      {showPassword ? 'visibility_off' : 'visibility'}
                    </span>
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full h-12 rounded-full text-on-primary font-label-lg text-label-lg flex items-center justify-center gap-2 shadow-lg transition-all hover:opacity-95 ${
                  success ? 'bg-tertiary-container' : 'bg-primary-container shadow-primary-container/25'
                }`}
              >
                {loading ? (
                  <>
                    <span className="material-symbols-outlined animate-spin text-[20px]">sync</span>
                    <span>Accediendo...</span>
                  </>
                ) : success ? (
                  <>
                    <span className="material-symbols-outlined text-[20px]">check_circle</span>
                    <span>¡Bienvenido!</span>
                  </>
                ) : (
                  <>
                    <span>Iniciar Sesión</span>
                    <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                  </>
                )}
              </button>
            </form>

            <div className="relative flex items-center justify-center py-1">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full h-px bg-surface-container-highest"></div>
              </div>
              <span className="relative px-4 bg-surface-container-lowest font-label-md text-label-md text-outline">
                O continúa con
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => iniciarSesionOAuth('google')}
                className="h-12 rounded-full bg-surface-container-low hover:bg-surface-container text-on-surface font-label-md text-label-md flex items-center justify-center gap-2.5 transition-colors focus:outline-none active:scale-[0.98]"
              >
                <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24">
                  <path d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.65v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.14z" fill="#4285F4"></path>
                  <path d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z" fill="#34A853"></path>
                  <path d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 10.03 0 12s.45 3.82 1.25 5.42l4.03-3.15z" fill="#FBBC05"></path>
                  <path d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z" fill="#EA4335"></path>
                </svg>
                <span>Google</span>
              </button>
              <button
                type="button"
                onClick={() => iniciarSesionOAuth('apple')}
                className="h-12 rounded-full bg-surface-container-low hover:bg-surface-container text-on-surface font-label-md text-label-md flex items-center justify-center gap-2.5 transition-colors focus:outline-none active:scale-[0.98]"
              >
                <svg className="w-4 h-4 flex-shrink-0 fill-current text-on-surface" viewBox="0 0 170 170">
                  <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.92-3.26-7.84-8-11.77-14.21-6.16-9.74-10.98-20.91-14.47-33.52-3.49-12.6-5.24-24.16-5.24-34.67 0-14.23 3.63-26.06 10.89-35.48 7.26-9.42 16.27-14.25 27.02-14.48 5.37 0 11.09 1.44 17.15 4.34 6.06 2.89 10.05 4.39 11.97 4.5 2.12-.22 6.43-1.85 12.92-4.88 6.5-3.03 12.28-4.32 17.36-3.89 13.06 1.08 23.36 6.13 30.9 15.15-11.53 6.96-17.18 16.51-16.96 28.66.22 9.57 3.91 17.65 11.09 24.23 7.17 6.57 15.64 10.32 25.41 11.23-2.17 6.3-4.67 12.39-7.51 18.27zM119.22 33.15c0-7.18 2.61-13.9 7.82-20.17 5.22-6.27 11.73-10.38 19.55-12.34-.11 1.74-.32 3.48-.65 5.22-1.41 7.28-4.88 13.78-10.42 19.49-5.54 5.71-11.97 9.07-19.28 10.09-.22-.76-.33-1.52-.33-2.29z"></path>
                </svg>
                <span>Apple</span>
              </button>
            </div>
          </div>

          <div className="mt-6 flex flex-col items-center justify-center gap-3 text-center">
            <p className="font-body-md text-body-md text-on-surface-variant">
              ¿No tienes una cuenta?
              <a className="font-label-lg text-label-lg text-primary font-bold hover:underline focus:outline-none ml-1" href="#register">
                Regístrate aquí
              </a>
            </p>
            <div className="inline-flex items-center gap-1.5 text-outline">
              <span className="font-label-sm text-label-sm uppercase tracking-widest text-outline">
                Octopus Habit Engine
              </span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}