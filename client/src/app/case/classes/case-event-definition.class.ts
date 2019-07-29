import { EventFormDefinition } from './event-form-definition.class'

class CaseEventDefinition {

  id:string
  name:string
  description:string
  repeatable:boolean
  required:boolean
  templateListItem:string
  estimatedTimeFromCaseOpening:number
  estimatedTimeWindow:number
  eventFormDefinitions:Array<EventFormDefinition> = []

  constructor(init:CaseEventDefinition) {
    Object.assign(this, init)
  }

}

export { CaseEventDefinition }
