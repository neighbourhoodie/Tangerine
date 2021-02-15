export class EventFormDefinition {

  id:string
  formId:string
  name:string
  // @TODO: roles[string]
  forCaseRole?:string = ''
  // Wether or not multiple EventForm Instances can be created in the same EventForm for the same Participant.
  repeatable?: boolean = false
  // Wether or not EventForm Instance is marked as required when created.
  required?:boolean = false
  // Create an EventForm Instance when a qualifying participant is added or when parent CaseEvent is created.
  autoPopulate?:boolean = false
  // @TODO Document.
  templateListItem?:string
  templateListItemIcon?:string
  templateListItemPrimary?:string
  templateListItemSecondary?:string
  // @TODO... These are strings? Shouldn't they be boolean? Also what's their default? 
  allowDeleteIfFormNotCompleted?:string
  allowDeleteIfFormNotStarted?:string

  constructor() {
  }
}

export enum EventFormAccessOperation {
  CREATE = 'CREATE',
  READ = 'READ',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE'
}

export interface EventFormAccess {
  create:Array<string>
  read:Array<string>
  update:Array<string>
  delete:Array<string>
}