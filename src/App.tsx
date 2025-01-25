import { Route, Routes } from "react-router";
import Home from "./pages/Home";
import Error from "./pages/Error";
import Dashboard from "./pages/Dashboard";
import { Toaster } from "./components/ui/toaster";

function App() {
	return (
		<main className='h-screen w-screen p-4 sm:px-[130px] lg:px-[250px] xl:px-[480px]'>
			<Routes>
				<Route path='/' element={<Home />} />
				<Route path='/dashboard' element={<Dashboard />} />
				<Route path='*' element={<Error />} />
			</Routes>
			<Toaster />
		</main>
	);
}

export default App;
