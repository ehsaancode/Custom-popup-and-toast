import Popup from './qlib/Popup'
import QToast from './qlib/QToast'
import TestForm from './TestForm'
import TestForm2 from './TestForm2'

function App() {

  return (
    <>
      {/* <TestForm /> */}
      <TestForm2 />

      <QToast />
      <Popup
        position="top-left"
        backgroundColor="linear-gradient(135deg, #111827 0%, #1f2937 100%)"
        borderRadius="30px"
        autoHide="true"
        title="Ehsaan"
        showTrigger="true"
        titleTextColor="linear-gradient(90deg, #f43f5e 0%, #fb923c 100%)"
        messageTextColor="linear-gradient(90deg, #38bdf8 0%, #818cf8 100%)"
        message="Hello, Welcome to Qlib!"
        duration="6s"
        buttonColor="linear-gradient(90deg, #5942cfff 0%, #e11d48 100%)"
        buttonTextColor="#ffffffff"
        progressColor="linear-gradient(90deg, #e20f4bff 0%, #df9c1eff 100%)"
      />


      <QToast
        // position="top-left"
        // backgroundColor="linear-gradient(135deg, #111827 0%, #1f2937 100%)"
        // borderRadius="8px"
        // // autoHide="true"
        // title="Ehsaan"
        showTrigger="true"
      // titleTextColor="linear-gradient(90deg, #f43f5e 0%, #fb923c 100%)"
      // messageTextColor="linear-gradient(90deg, #38bdf8 0%, #818cf8 100%)"
      // message="Hello, Welcome to Qlib Toast!"
      // duration="6s"
      // // buttonColor="linear-gradient(90deg, #5942cfff 0%, #e11d48 100%)"
      // buttonTextColor="#ffffffff"
      // progressColor="linear-gradient(90deg, #e20f4bff 0%, #df9c1eff 100%)"
      />
    </>
  )
}

export default App