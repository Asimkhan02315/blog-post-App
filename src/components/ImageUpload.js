import axios from 'axios';
import React, { useState } from 'react'

const ImageUpload = () => {

    const [image, setImage] = useState('');

function handleImage () {
    console.log(e.target.file)
    setImage(e.target.file[0])
}

function handleClick() {
    const formData = new formData()
    formData.append('image', image)
    axios.post('url', formData)
    .then((res) => {
        console.log(res)
    })
}

  return (
    <div>
     <input type='file' name='file' onChange={handleImage}/>
<button onClick={handleClick}>Submit</button>
    </div>
  )
}

export default ImageUpload