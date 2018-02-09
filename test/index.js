import test from 'ava'
import { isObject, extractFiles, ReactNativeFile } from '../src/index.js'

const mock = () => {
  const file = new ReactNativeFile({ name: '', type: '', uri: '' })
  return {
    file,
    originalTree: {
      a: null,
      b: {
        ba: file,
        bb: [file, file]
      },
      c: {
        ca: '',
        cb: {
          cba: true
        }
      }
    },
    modifiedTree: {
      a: null,
      b: {
        ba: '1',
        bb: ['2', '3']
      },
      c: {
        ca: '',
        cb: {
          cba: true
        }
      }
    }
  }
}

test('isObject identifies an enumerable object', t => {
  t.false(isObject(null))
  t.false(isObject(true))
  t.false(isObject(''))
  t.true(isObject({ foo: true }))
  t.true(isObject(['foo']))
})

test('extractFiles handles a non-object tree', t => {
  t.deepEqual(extractFiles(undefined), [])
  t.deepEqual(extractFiles(null), [])
})

test('extractFiles extracts files from an object tree', t => {
  const { file, originalTree, modifiedTree } = mock()
  const files = extractFiles(originalTree)

  t.deepEqual(
    originalTree,
    modifiedTree,
    'Extracted files should be removed from the original object tree'
  )

  t.deepEqual(
    files,
    [
      {
        path: 'b.ba',
        index: 1,
        file
      },
      {
        path: 'b.bb.0',
        index: 2,
        file
      },
      {
        path: 'b.bb.1',
        index: 3,
        file
      }
    ],
    'Should return an array of the extracted files'
  )
})

test('extractFiles with a tree path extracts files from an object tree', t => {
  const { file, originalTree, modifiedTree } = mock()
  const files = extractFiles(originalTree, 'treepath')

  t.deepEqual(
    originalTree,
    modifiedTree,
    'Extracted files should be removed from the original object tree'
  )

  t.deepEqual(
    files,
    [
      {
        path: 'treepath.b.ba',
        index: 1,
        file
      },
      {
        path: 'treepath.b.bb.0',
        index: 2,
        file
      },
      {
        path: 'treepath.b.bb.1',
        index: 3,
        file
      }
    ],
    'Should return an array of the extracted files'
  )
})
