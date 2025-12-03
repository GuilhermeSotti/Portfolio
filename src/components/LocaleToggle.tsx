import React, { useEffect, useState } from 'react';

function setCookie(name: string, value: string, days = 365) {
  const d = new Date();
  d.setTime(d.getTime() + days*24*60*60*1000);
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; expires=${d.toUTCString()}; SameSite=Lax`;
}

function readCookie(name: string) {
  const m = document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)');
  return m ? decodeURIComponent(m[2]) : null;
}

export default function ThemeToggle(){
  const [theme, setTheme] = useState<'light'|'dark'>(()=>{
    if (typeof window === 'undefined') return 'light';
    const c = readCookie('theme');
    if (c==='dark' || c==='light') return c as any;
    return (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) ? 'dark' : 'light';
  });

  useEffect(()=>{
    document.documentElement.setAttribute('data-theme', theme);
    setCookie('theme', theme, 365);
  },[theme]);

  return (
    <button className="theme-toggle" onClick={()=>setTheme(t=> t==='light' ? 'dark' : 'light')}>
      {theme === 'light' ? 'Claro' : 'Escuro'}
    </button>
  );
}