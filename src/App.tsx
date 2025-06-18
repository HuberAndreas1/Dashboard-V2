import {BrowserRouter, Route, Routes} from 'react-router-dom'
import Layout from "@/components/ui/layout.tsx";
import Students from "@/components/pages/students.tsx";
import DashboardHome from "@/components/pages/Home.tsx";


function App() {

  return (
        <BrowserRouter>
            <Layout>
                <Routes>
                    <Route path="/" element={<DashboardHome />}></Route>
                    <Route path="/students" element={<Students />} />
                    <Route path="/stopgroups" element={<div>Stop Groups Page</div>} />
                </Routes>
            </Layout>
        </BrowserRouter>
  )
}

export default App
