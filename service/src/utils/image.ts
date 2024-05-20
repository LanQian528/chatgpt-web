import fs from 'node:fs/promises'
import * as fileType from 'file-type'

fs.mkdir('uploads').then(() => {
  globalThis.console.log('Directory uploads created')
}).catch((e) => {
  if (e.code === 'EEXIST') {
    globalThis.console.log('Directory uploads already exists')
    return
  }
  globalThis.console.error('Error creating directory uploads, ', e)
})

export async function convertImageUrl(uploadFileKey: string): Promise<string> {
  const fileData = await fs.readFile(`uploads/${uploadFileKey}`)
  // 判断文件格式
	const fileTypeResult = await fileType.fileTypeFromBuffer(fileData);
	let mimeType: string | undefined; // 声明 mimeType 的类型为 string 或 undefined
	if (fileTypeResult) {
		mimeType = fileTypeResult.mime;
	} else {
		// 如果无法识别文件类型，则假设是文本文件
		mimeType = 'text/plain';
	}
	// 将文件数据转换为 Base64 编码的字符串
  const base64File = fileData.toString('base64')
  return `data:${mimeType};base64,${base64File}`
}
