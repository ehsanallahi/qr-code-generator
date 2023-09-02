import InputColor from "./InputColor"
import InputField from "./InputField"


const InputForm = () => {
  return (
    <div className="col-span-2 p-6 grid gap-4">
      <InputField />
      < InputColor />
      <button
       
      className="bg-blue-400  max-w-xs ml-auto p-4 py-4 py-2 text-white 
      rounded-sm mt-4 hover:bg-blue-500 disabled:bg-gray-300">
        Generate QrCode
      </button>
    </div>
  )
}

export default InputForm