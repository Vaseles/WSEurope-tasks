import styles from './App.module.css'
import Button from '../components/ui/Button/Button'
import useFullScreen from '../hooks/useFullScreen'
import { useEffect, useState } from 'react'

const App = () => {
   const {fullScreen} = useFullScreen()

   const [file, setFile] = useState('')
   const [error, setError] = useState('')
   const [elements, setElements] = useState([])

   // run to create empty arrays
   useEffect(() => {
      createEmptyArrays()
   }, [])

   // create Empty arrays
   const createEmptyArrays  = ( ) => {
      const newArray = []

      for (let i = 1; i < 33; i++) {
         newArray.push({id: i, element: ''})
      }
      setElements(newArray)
   }

   // create base list of base users(Sans, Papyrus and Andyne)
   const baseList = () => {
      const updatedElements = elements.map((item) => {
         if (item.id < 4) {
            if (item.id === 1) {
               return { ...item, element: 'Sans' }
            } else if (item.id === 2) {
               return { ...item, element: 'Papyrus' }
            } else if (item.id === 3) {
               return { ...item, element: 'Andyne' }
            }
         } 
         return {...item, element: ''}
      })
      setElements(updatedElements)
      // localStorage.setItem('elements', elements)
   }

   // Начала перетаскивания, берем и перетаскиваем куды нада
   const handleDragStart = (e, element) =>   {
      e.dataTransfer.setData('text/plain', JSON.stringify(element))
   }

     // шо будит когда тащим
   const  handleDragOver  = (e) => {
      e.preventDefault()
      e.target.style = " backgroundColor: rgb(254,254,254,.2)"
   }

   const handleDrop = (e, id, element) => {
      e.preventDefault()
      let elem = JSON.parse(e.dataTransfer.getData('text'))
      console.log(id, element)

      let updateElements = elements.map((item) => {
        if (element == '') {
            if (item.id === elem.id) {
               return {...item, element: '' }
            } 
        } else {
            if (item.id === elem.id) {
               return {...item, element: element }
            } 
        }
         if (item.id ===  id) {
            return {...item, element: elem.element }
         } 
         return item
      })

      setElements(updateElements)
      // localStorage.setItem('elements', elements)
   }

   const GenerateStr = () => {
      let str = '# VIP List\n\n'
      
      elements.map(item => {
         str += ` - ${item.element} \n`
      }) 

      return str
   }

   // Copy
   const copy = () => {
      navigator.clipboard.writeText(GenerateStr())
   }

   // Download file
   const downloadFile = () => {
      const element = document.createElement("a");
      let str = GenerateStr()

      const file = new Blob([str], { type: "text/plain" });
      element.href = URL.createObjectURL(file);
      element.download = "concerts.txt";
      document.body.appendChild(element); // Required for Firefox
      element.click();
      document.body.removeChild(element); //
   }

   // file read
   const readFile = (e) => {
      const file = e.target.files[0]
      const reader = new FileReader()

      reader.onload = (e) => {
         const fileData  = e.target.result
         return fileData
      }

      reader.readAsText(file)
   }

   // drop file upload
   const getFileDrop = (e) => {
      const file = e.target.files[0]
      console.log(file)
   }

   // handleFileUpload
   const handleFileUpload = (e) => {
      const file = e.target.files[0]
      
      const reader = new FileReader()

      reader.onload = (e) => {
         const fileData  = e.target.result

         let massive = fileData.replace(/[\n\s\t]/g, ' ')
         massive = massive.split('-')
         if  (massive[0].includes('# VIP List')) {
            createEmptyArrays()
            massive.shift()

            setElements(massive)
         } else {
            setError('file error')
            setTimeout(() => {
               setError('')
            }, 3000)

            return ''
         }
      }
      reader.readAsText(file)
   }

  return (
    <div className={styles.page}>
      <div className={styles.page__header}>
         <Button onClick={baseList}>Base List</Button>
         <Button onClick={downloadFile}>Download</Button>
         <Button onClick={copy}>Copy</Button>
         <Button onClick={createEmptyArrays}>Clear Table</Button>
         <Button onClick={fullScreen}>Full Screen</Button>
      </div>
      {error? <div className='error'>{error}</div>: <></>}
      {elements? (
         <div className={styles.page__elements}>
            {elements.map((element) => 
            <div 
               key={element.id}
               className={styles.page__element}
               onDragOver={handleDragOver} 
               onDrop={(e) => handleDrop(e, element.id, element.element)}
               >
                  {element.element != '' ? (
                      <div 
                        className={styles.element}
                        draggable
                        onDragStart  = {(e) => handleDragStart(e, element)}
                      >{element.element}</div>
                  ): (<></>)}
               </div>
            )}
         </div>
      ): (<>not found</>)}
      <div className={styles.page__upload} onDrop={getFileDrop}>
         <input type="file"  onChange={handleFileUpload}  />
         <p>Upload your fucking file</p>
      </div>
    </div>
  )
}

export default App