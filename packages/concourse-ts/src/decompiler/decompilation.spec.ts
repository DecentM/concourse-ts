import test from 'ava'
import fs from 'node:fs/promises'
import path from 'node:path'

import {Decompilation} from './decompilation'

test('decompilation', async (t) => {
  const decompilation = new Decompilation()
  const pipelineFile = await fs.readFile(
    path.resolve(__dirname, 'test/pipeline.yml')
  )

  decompilation.set_input(pipelineFile.toString('utf8'))
  decompilation.set_name('pipeline')
  decompilation.set_prettier_config()

  t.notThrows(() => {
    decompilation.decompile()
  })
})

test('decompilation does not produce undefined assignments', async (t) => {
  const decompilation = new Decompilation()
  const pipelineFile = await fs.readFile(
    path.resolve(__dirname, 'test/pipeline.yml')
  )

  decompilation.set_input(pipelineFile.toString('utf8'))
  decompilation.set_name('pipeline')
  decompilation.set_prettier_config()

  const result = decompilation.decompile()

  t.assert(!result.pipeline.includes('undefined'), 'result contains undefined')
})
