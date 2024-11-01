
const Input = ({icon:Icon,...props}) => {
    //we are going to use the icon prop as a component , so we capitalize it , its an icon using lucide
  return (
    <div className="relative mb-6">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none ">
            <Icon className="size-5 text-green-500" />
        </div>
        <input {...props} className="w-full pl-10 pr-3 py-2 bg-gray-800 bg-opacity-50 rounded-lg border border-gray-700 focus:border-green-500 focus:ring-2 focus:ring-green-500 text-white placeholder-gray-400 transition duration-200"/>
    </div>
  )
}
//inset-y-0 makes the element centered on the y axis
//...props is neat for a quick destructure
//Icon , because its originally a component made by lucide

export default Input