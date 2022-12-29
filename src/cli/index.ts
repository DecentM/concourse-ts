import {runApp} from './app'

runApp()

const noop = () => {}

process.addListener('uncaughtException', noop)
process.addListener('unhandledRejection', noop)
