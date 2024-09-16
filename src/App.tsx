import { BrowserRouter, Routes, Route } from "react-router-dom"
import "./App.css"
import { Counter } from "./features/counter/Counter"
import { Quotes } from "./features/quotes/Quotes"
import logo from "./logo.svg"
import AddingOffer from "./pages/adding-offer/AddingOffer"
import OfferList from "./pages/display-list/OfferList"
import EditOffer from "./pages/edit-offer/EditOffer"
import HomePage from "./pages/home-page/HomePage"

const App = () => {
  return (
    <BrowserRouter>
		<Routes>
			<Route path="/" element={<HomePage />} />
			<Route path="/view-offers" element={<OfferList />} />
			<Route path="/edit/:id" element={<EditOffer />} />
			<Route path="/create-offer" element={<AddingOffer />} />
			{/* <Route path="users/:id" element={<Users />} /> */}
		</Routes>
	</BrowserRouter>
  )
}

export default App
