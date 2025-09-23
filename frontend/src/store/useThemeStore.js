import { create } from 'zustand'

export const useThemeStore = create((set) => ({
  theme: localStorage.getItem("mockmates-theme") || "night",
  setTheme:(theme)=>{
    localStorage.setItem("mockmates-theme",theme)
    set({theme})
  }
}))