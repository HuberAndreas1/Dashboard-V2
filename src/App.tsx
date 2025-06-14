import {BrowserRouter, Route, Routes} from 'react-router-dom'
import Layout from "@/components/ui/layout.tsx";
import Students from "@/components/pages/students.tsx";


function App() {

  return (
        <BrowserRouter>
            <Layout>
                <Routes>
                    <Route path="/" element={<Students />} />
                    <Route path="/students" element={<Students />} />
                </Routes>
            </Layout>
        </BrowserRouter>
  )
}

export default App
