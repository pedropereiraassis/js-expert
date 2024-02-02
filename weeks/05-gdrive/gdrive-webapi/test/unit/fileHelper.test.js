import { describe, test, expect, jest } from '@jest/globals'
import fs from 'fs'
import FileHelper from '../../src/fileHelper.js'

describe('FileHelper test suite', () => {
  describe('#getFilesStatus', () => {
    test('should return files status in correct format', async () => {
      const statsMock = {
        dev: 194941,
        mode: 33204,
        nlink: 1,
        uid: 1000,
        gid: 1000,
        rdev: 0,
        blksize: 4096,
        ino: 9438009,
        size: 194941,
        blocks: 8,
        atimeMs: 1706195606006.8857,
        mtimeMs: 1706195601009.5964,
        ctimeMs: 1706195605934.8674,
        birthtimeMs: 1706195601009.5964,
        atime: '2024-01-25T15:13:26.007Z',
        mtime: '2024-01-25T15:13:21.010Z',
        ctime: '2024-01-25T15:13:25.935Z',
        birthtime: '2024-01-25T15:13:21.010Z',
      }
      const mockUser = 'pedroassis'
      process.env.USER = mockUser
      const filename = 'file.png'
      jest.spyOn(fs.promises, fs.promises.readdir.name).mockResolvedValue([filename])
      jest.spyOn(fs.promises, fs.promises.stat.name).mockResolvedValue(statsMock)
      
      const result = await FileHelper.getFilesStatus('/tmp')

      const expectedResult = [
        {
          size: '195 kB', // 194941 bytes
          lastModified: statsMock.birthtime,
          owner: mockUser,
          file: filename,
        }
      ]
      
      expect(fs.promises.stat).toHaveBeenCalledWith(`/tmp/${filename}`)
      expect(result).toMatchObject(expectedResult)
    })
  })
})