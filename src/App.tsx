import { BrowserRouter, Routes, Route } from "react-router-dom"
import "./App.css"
import { Counter } from "./features/counter/Counter"
import { Quotes } from "./features/quotes/Quotes"
import logo from "./logo.svg"
import AddingOffer from "./pages/adding-offer/AddingOffer"
import OfferList from "./pages/display-list/OfferList"

const App = () => {
  return (
    <BrowserRouter>
		<Routes>
			<Route path="/" element={<AddingOffer />} />
			<Route path="/offers" element={<OfferList />} />
			{/* <Route path="users/:id" element={<Users />} /> */}
		</Routes>
	</BrowserRouter>
  )
}

export default App
