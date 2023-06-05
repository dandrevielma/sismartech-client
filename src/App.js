import { useState, useEffect } from 'react';
import axios from 'axios';

import './index.css'

const App = () => {
  useEffect(() => {
    document.title = 'Sales System Organizer';
  }, []);
  const [files, setFiles] = useState();
  const [ loginData ] = useState({
    user: '',
    pass: '',
    files
  });
  const [currFiles, setCurrFiles] = useState(false)
  const [isDisabled, setIsDisable] = useState(true);

  const handleEmptyInputs = () => {
    if(loginData.user == '' || loginData.pass == '' || !currFiles){
      setIsDisable(true);
    } else {
      setIsDisable(false)
    }
  }

  const handleInput = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    if(name == 'user'){
      loginData.user = value
    }else {
      loginData.pass = value
    }
    handleEmptyInputs()
    
  }
  const handleFile = (event) => {
    const currentFiles = event.target.files;
    console.log(currentFiles.length)
    if(currentFiles.length == 0){
      setCurrFiles(false);
      handleEmptyInputs()
    } else {
      setCurrFiles(true);
      handleEmptyInputs()
    }
    let formData = new FormData();
    for (let i =0; i < currentFiles.length; i++) {
      formData.append("files", currentFiles[i]);
    }
    setFiles(formData);
    // console.log(files);
    console.log(formData);
  }

  function submitForm(e) {
    e.preventDefault();
    const files = document.getElementById("files");
    const formData = new FormData();
    formData.append("user", loginData.user);
    formData.append("pass", loginData.pass);
    for(let i = 0; i < files.files.length; i++) {
            formData.append("files", files.files[i]);
    }
    fetch("http://45.15.25.14:3000/auth-user", {
    // fetch("http://localhost:3000/auth-user", {
        method: 'POST',
        body: formData,
    })
    .then(response => {
      if (!response.ok){
        throw new Error('SOMETHING WENT WRONG')
      }
      const contentType = response.headers.get('content-type');
      if (contentType == 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'){
        response.blob().then(blob => {
          const date = new Date().toLocaleDateString('es').replace(/\//g, "-");
          let url = window.URL.createObjectURL(blob);
          let a = document.createElement('a');
          a.href = url;
          a.download = `List ${date}.xlsx`;
          document.body.appendChild(a);
          a.click();
          a.remove();
        });
      } else {
        response.text().then(text => {
          console.log('MESSAGE FROM SERVER: ', text);
        });
      }
    }).catch((err) => ("Error occured", err));
}
  return (
    <>
      <div className="h-screen flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img className="mx-auto h-10 w-auto" src="https://sismartech.com/wp-content/uploads/2023/02/cropped-logo-wLOGO-.png" alt="Sismartech" />
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">Type your credentials</h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form onSubmit={submitForm} className="space-y-6">
            <div>
              <label htmlFor="user" className="block text-sm font-medium leading-6 text-gray-900">Username</label>
              <div className="mt-2">
                <input onChange={handleInput} id="user" name="user" type="text"required className="p-4 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">Password</label>
              </div>
              <div className="mt-2">
                <input onChange={handleInput} id="password" name="password" type="password" autoComplete="current-password" required className="p-4 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
              </div>
            </div>
            
            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">Files</label>
                <div className="text-sm">
                  <span href="#" className="font-semibold text-[#004fee] hover:text-[#004fee]/90">Supported format: XLSX</span>
                </div>
              </div>
              
            </div>
            <div className="flex justify-between items-center w-full">
              
              <label className="block">
                <span className="sr-only cursor-pointer">Select files</span>
                <input id='files' onChange={handleFile} type="file" className="cursor-pointer block w-full text-sm text-[#004fee]
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-full file:border-0
                  file:text-sm file:font-semibold
                  file:bg-[#004fee]/10 file:text-[#004fee]" multiple required/>
              </label>
            </div>

            <div>
              <button type="submit" className="flex w-full justify-center rounded-md bg-[#004fee] px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-[#004fee]/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:[#004fee] disabled:opacity-50">Do your magic</button>
            </div>
          </form>

          <p className="mt-10 text-center text-sm text-gray-500">
            Remember to upload all the files you want to process
          </p>
        </div>
      </div>
    </>
  );
}

export default App;
