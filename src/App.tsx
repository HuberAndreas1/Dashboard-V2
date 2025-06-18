import {BrowserRouter, Route, Routes} from 'react-router-dom'
import Layout from "@/components/ui/layout.tsx";
import Students from "@/components/pages/students.tsx";
import StopGroups from "@/components/pages/stopgroups.tsx";


function App() {

  return (
        <BrowserRouter>
            <Layout>
                <Routes>
                    <Route path="/" element={<Students />} />
                    <Route path="/students" element={<Students />} />
                    <Route path="/stop-groups" element={<StopGroups />} />
                </Routes>
            </Layout>
        </BrowserRouter>
  )
}

export default App
