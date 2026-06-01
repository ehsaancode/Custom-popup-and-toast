import Popup from './qlib/Popup'
import QToast from './qlib/QToast'
import TestForm from './TestForm'
import TestForm2 from './TestForm2'

function App() {

  return (
    <>
      {/* <TestForm /> */}
      <TestForm2 />

      {/* <QToast /> */}
      <Popup position="center" backgroundColor="#b8a7a7ff" color="#841c6cff" autoHide='true' title="Welcome" message="This is a pop" duration={5000} />


      {/* <QToast success="true" message="Coming From App" duration={3000} position="top-right" /> */}
    </>
  )
}

export default App