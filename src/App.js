import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./paths/Home"
import Login from "./paths/auth/Login";
import Register from "./paths/auth/Register";
import Notifications from "./paths/Notifications";
import AllGames from "./paths/AllGames";
import MyProfile from "./paths/MyProfile";
import SingleGame from "./paths/SingleGame";
import OfferTrade from "./paths/OfferTrade";
import MyFriends from "./paths/MyFriends";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/all_games" element={<AllGames />} />
        <Route path="/my_profile" element={<MyProfile />} />
        <Route path="/game/:id" element={<SingleGame />} />
        <Route path="/offer_trade/:id" element={<OfferTrade />} />
        <Route path="/my_friends" element={<MyFriends />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
