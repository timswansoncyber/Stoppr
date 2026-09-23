import { useEffect } from 'react'
import { HashRouter, Navigate, Outlet, Route, Routes, useLocation } from 'react-router-dom'
import TabBar from './components/TabBar'
import { AppProvider, useApp } from './context/AppContext'
import Home from './pages/Home'
import Journal from './pages/Journal'
import { ArticlePage, Learn } from './pages/Learn'
import Onboarding from './pages/Onboarding'
import Panic from './pages/Panic'
import Progress from './pages/Progress'
import Settings from './pages/Settings'

function Shell() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return (
    <>
      <main className="mx-auto max-w-md px-5 pb-36">
        <Outlet />
      </main>
      <TabBar />
    </>
  )
}

function Routed() {
  const { state } = useApp()
  if (!state.onboarded) return <Onboarding />
  return (
    <Routes>
      <Route element={<Shell />}>
        <Route index element={<Home />} />
        <Route path="progress" element={<Progress />} />
        <Route path="learn" element={<Learn />} />
        <Route path="learn/:slug" element={<ArticlePage />} />
        <Route path="journal" element={<Journal />} />
        <Route path="settings" element={<Settings />} />
      </Route>
      <Route path="panic" element={<Panic />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <AppProvider>
      <HashRouter>
        <Routed />
      </HashRouter>
    </AppProvider>
  )
}
