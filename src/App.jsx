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
      <Popup
        position="center"
        backgroundColor="linear-gradient(135deg, #111827 0%, #1f2937 100%)"
        borderRadius="24px"
        color="linear-gradient(90deg, #3b82f6 0%, #8b5cf6 100%)"
        autoHide="true"
        title="ehsaan"
        titleTextColor="linear-gradient(90deg, #f43f5e 0%, #fb923c 100%)"
        messageTextColor="linear-gradient(90deg, #38bdf8 0%, #818cf8 100%)"
        message="Hello, Welcome to Qlib!"
        duration="6s"
      />


      {/* <QToast success="true" message="Coming From App" duration={3000} position="top-right" /> */}
    </>
  )
}

export default App