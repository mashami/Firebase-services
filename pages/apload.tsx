
import { Button, Card, Input, List, message, Image, Progress } from 'antd'
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage'
import React, { useState } from 'react'
import { storage } from '.././utils/firebase'

const UploadImageToStorage = () => {
  const [imageFiles, setImageFiles] = useState<File[]>([])
  const [downloadURLs, setDownloadURLs] = useState<string[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [progressUpload, setProgressUpload] = useState(0)

  const handleSelectedFiles = (files: FileList) => {
    const validFiles: File[] = Array.from(files).filter(
      (file: File) => file.size < 10000000 && file.type.startsWith('image/')
    );
    setImageFiles(validFiles);
    console.log(validFiles);
  };

  const handleUploadFiles = () => {
    setIsUploading(true)

    const uploadPromises = imageFiles.map((imageFile) => {
      const name = imageFile.name
      const storageRef = ref(storage, `image/${name}`)
      const uploadTask = uploadBytesResumable(storageRef, imageFile)

      return new Promise<string>((resolve, reject) => {
        uploadTask.on(
          'state_changed',
          (snapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100

            setProgressUpload(progress) // to show progress upload

            switch (snapshot.state) {
              case 'paused':
                console.log('Upload is paused')
                break
              case 'running':
                console.log('Upload is running')
                break
            }
          },
          (error) => {
            reject(error.message)
          },
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then((url) => {
              // url is download url of file
              resolve(url)
            })
          },
        )
      })
    })

    Promise.all(uploadPromises)
      .then((urls: string[]) => {
        setIsUploading(false)
        setDownloadURLs(urls)
        message.success(`${urls.length} files uploaded successfully!`)
      })
      .catch((error) => {
        setIsUploading(false)
        message.error(error.message)
      })
  }

  const handleRemoveFile = (file: File) => {
    setImageFiles((prevFiles) => prevFiles.filter((prevFile) => prevFile !== file))
    setDownloadURLs((prevURLs) => prevURLs.filter((prevURL) => !prevURL.includes(file.name)))
  }

  return (
    <div className="container mt-5">
      <div className="col-lg-8 offset-lg-2">
        <Input
          type="file"
          placeholder="Select file(s) to upload"
          accept="image/png,image/jpeg,image/gif"
          multiple
          onChange={(event: any) => handleSelectedFiles(event.target.files)}
        />

        <div className="mt-5">
          <Card>
            {imageFiles.map((file, index) => (
              <List.Item
                key={index}
                extra={[
                  <Button
                    key="btnRemoveFile"
                    onClick={() => handleRemoveFile(file)}
                    type="text"
                    icon={<i className="fas fa-times"></i>}
                  />,
                ]}
              >
                <List.Item.Meta
                  title={file.name}
                  description={`Size: ${file.size}`}
                />
              </List.Item>
            ))}

            <div className="text-right mt-3">
              <Button
          type="primary"
          disabled={imageFiles.length === 0 || isUploading}
          onClick={handleUploadFiles}
        >
          Upload
        </Button>
        </div>

        {isUploading && (
          <div className="mt-3">
            <Progress percent={progressUpload} />
          </div>
        )}

        <div className="mt-3">
          {downloadURLs.map((url: string, index: number) => (
            <Image
              key={index}
              src={url}
              width={200}
              style={{ marginRight: 10, marginBottom: 10 }}
            />
          ))}
        </div>
      </Card>
    </div>
  </div>
</div>
  )
}
export default UploadImageToStorage