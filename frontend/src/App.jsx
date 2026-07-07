import { AuthProvider } from "./contexts/AuthContext.jsx";
import Authentication from "./pages/Authentication.jsx";
import Landing from "./pages/Landing.jsx";
import { BrowserRouter, Routes, Route } from "react-router-dom"
import VideoMeetComponent from "./pages/VideoMeet..jsx";
import HomeComponent from "./pages/Home.jsx";
import History from "./pages/History.jsx";

function App() {
  return (
    <BrowserRouter>

      <AuthProvider>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/auth" element={<Authentication />} />
          <Route path="/home" element={<HomeComponent/>} />
          <Route path="/history" element={<History/>} />

          <Route path="/:url" element={<VideoMeetComponent/>} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;