import QrCode from "./components/QrCode";
import InputForm from "./components/inputForm";
import { createContext, useState } from "react";

// create context
export const InputContext= createContext();
function App() {
  const [inputValue , setInputValue] = useState({
    url:'',
    color:''
  });
  const value ={
    inputValue,
    setInputValue
  }

  return (
    <div className="bg-gradient-to-r from-cyan-500 to-blue-500 h-screen pt-36 px2">
      <div className="container mx-auto ax-w-4xl bg-white rounded-md shadow">
        <div className="md:grid md:grid-cols-3">
         
          <InputContext.Provider>
          <InputForm value={value} />
          <QrCode />
          </InputContext.Provider>
         
        </div>
      </div>
    </div>
  );
}

export default App;
