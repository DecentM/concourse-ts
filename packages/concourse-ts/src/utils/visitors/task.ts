import {Identifier} from '../identifier'
import * as Type from '../../declarations/types'

export type TaskVisitor = {
  Command?: (component: Type.Command) => void
}

export const visit_task = (
  task: Type.Task<Identifier, Identifier>,
  visitor: TaskVisitor
) => {
  if (task.run && visitor.Command) {
    visitor.Command(task.run)
  }
}
