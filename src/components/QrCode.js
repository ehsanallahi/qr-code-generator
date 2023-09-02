
const QrCode = () => {
  return (
    <div className="bg-gray-100 rounded-r-md flex flex-col items-center justify-center">
        <img className="w-48" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTpNVCh1ZZvRwg6iVHWGnnVFKgvcSrpPG28EQTAjnFn4A&s" alt="QrCode Image"/>
        <button className="bg-blue-400 text-white mt-2 px-4 py-1 w-full">Download</button>
    </div>
  )
}

export default QrCode