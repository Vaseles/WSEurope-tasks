
const useFullScreen = () => {
   const fullScreen = () => {
      if (document.documentElement.requestFullscreen()) {
         document.exitFullscreen()
      } else {
         document.documentElement.requestFullscreen()
      }
   }
   return {fullScreen}
}

export default useFullScreen