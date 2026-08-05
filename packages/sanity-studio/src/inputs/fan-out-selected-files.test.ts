import type {AssetSource, InputOnSelectFileFunctionProps, SchemaType} from 'sanity'
import {describe, expect, it, vi} from 'vitest'
import {fanOutSelectedFiles} from './fan-out-selected-files'

const imageMember = {name: 'galleryImage', jsonType: 'object'} as unknown as SchemaType
const assetSource = {name: 'sanity-default'} as unknown as AssetSource

const makeFile = (name: string, type: string): File => new File(['x'], name, {type})

describe('fanOutSelectedFiles', () => {
  it('calls onSelectFile once per file, synchronously, in picker order', () => {
    const calls: string[] = []
    const onSelectFile = vi.fn((props: InputOnSelectFileFunctionProps) => {
      calls.push(props.file.name)
    })
    const files = [
      makeFile('a.jpg', 'image/jpeg'),
      makeFile('b.png', 'image/png'),
      makeFile('c.webp', 'image/webp'),
    ]

    fanOutSelectedFiles(files, {imageMember, assetSource, onSelectFile})

    expect(calls).toEqual(['a.jpg', 'b.png', 'c.webp'])
    expect(onSelectFile).toHaveBeenCalledWith({
      file: files[0],
      schemaType: imageMember,
      assetSource,
    })
  })

  it('skips non-image files', () => {
    const onSelectFile = vi.fn()
    const files = [
      makeFile('a.jpg', 'image/jpeg'),
      makeFile('notes.txt', 'text/plain'),
      makeFile('clip.mp4', 'video/mp4'),
      makeFile('b.png', 'image/png'),
    ]

    fanOutSelectedFiles(files, {imageMember, assetSource, onSelectFile})

    expect(onSelectFile).toHaveBeenCalledTimes(2)
    expect(onSelectFile.mock.calls.map((c) => (c[0] as InputOnSelectFileFunctionProps).file.name)).toEqual([
      'a.jpg',
      'b.png',
    ])
  })

  it('is a no-op when onSelectFile is undefined', () => {
    expect(() =>
      fanOutSelectedFiles([makeFile('a.jpg', 'image/jpeg')], {
        imageMember,
        assetSource,
        onSelectFile: undefined,
      }),
    ).not.toThrow()
  })
})
