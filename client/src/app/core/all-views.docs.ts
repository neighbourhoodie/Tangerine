const emit = (key, value?:any) => {
  return true;
}

export const allViews = [
  {
    _id: '_design/allViews',
    views: {
      'byType': {
        map: function (doc) {
          emit(doc.type, true)
        }.toString()
      },
      'case-events-by-all-days': {
        map: function (doc) {
          if (doc.collection === 'TangyFormResponse' && doc.type === 'case' && doc.events && doc.events.length > 0) {
            for (let event of doc.events) {
              if (event.scheduledDay) {
                emit(event.scheduledDay, { caseId: doc._id, eventId: event.id })
              }
              if (event.occuredOnDay) {
                emit(event.occuredOnDay, { caseId: doc._id, eventId: event.id })
              }
              if (event.estimatedDay) {
                emit(event.estimatedDay, { caseId: doc._id, eventId: event.id })
              }
            }
          }
        }.toString()
      },
      'responsesUnLockedAndNotUploaded': {
        map: function (doc) {
          if (doc.collection === 'TangyFormResponse' && doc.complete === false && (!doc.uploadDatetime || doc.lastModified > doc.uploadDatetime)) {
            emit(doc.form.id, true)
          }
        }.toString()
      },
      'search': {
        // add ddoc
      },
      'sync-conflicts': {
        map: function (doc) {
          if (doc._conflicts) {
            emit(true)
          }
        }.toString()
      },
      'sync-queue': {
        map: function (doc) {
          if (doc.collection === 'TangyFormResponse') {
            let needsUploading = (!doc.tangerineSyncedOn || doc.tangerineSyncedOn < doc.tangerineModifiedOn) ? true : false
            let formId = doc.form.id
            let isComplete = doc.complete
            emit([needsUploading, formId, isComplete], true)
          }
        }.toString()
      },
      'tangy-form/responsesByFormIdAndStartDatetime': {
        map: function (doc) {
          if (doc.collection !== 'TangyFormResponse') return
          emit(`${doc.form.id}-${doc.startUnixtime}`, true)
        }.toString()
      },
      'tangy-form/responsesByYearMonthLocationId': {
        map: function (doc) {
          if (doc.hasOwnProperty('collection') && doc.collection === 'TangyFormResponse') {
            if (doc.form.id === 'user-profile' || doc.form.id === 'reports') return
            // @TODO Take into account timezone.
            const startDatetime = new Date(doc.startUnixtime);
            let inputs = [];
            doc.items.forEach(item => inputs = [...inputs, ...item.inputs])
            let location = inputs.find(input => (input.tagName === 'TANGY-LOCATION') ? true : false)
            if (location) {
              const lowestLevelLocation = location.value.pop()
              const thisLocationId = lowestLevelLocation.value;
              emit(`${thisLocationId}-${startDatetime.getDate()}-${startDatetime.getMonth()}-${startDatetime.getFullYear()}`, true);
            }
          }
        }.toString()
      },
      'tangy-form/responsesByLocationId': {
        map: function (doc) {
          if (doc.hasOwnProperty('collection') && doc.collection === 'TangyFormResponse') {
            if (doc.form.id === 'user-profile' || doc.form.id === 'reports') return
            let inputs = [];
            doc.items.forEach(item => inputs = [...inputs, ...item.inputs])
            let location = inputs.find(input => (input.tagName === 'TANGY-LOCATION') ? true : false)
            if (location) {
              let lowestLevelLocation = location.value.pop()
              emit(lowestLevelLocation.value, true);
            }
          }
        }.toString()
      },
      'tangy-form/responsesCompleted': {
        map: function (doc) {
          if ((doc.collection === 'TangyFormResponse' && doc.complete === true ||
            (doc.collection === 'TangyFormResponse' && doc.form.id === 'user-profile'))) {
            emit(doc._id, true)
          }
        }.toString()
      },
      'tangy-form/responsesByFormId': {
        map: function (doc) {
          if (doc.collection !== 'TangyFormResponse') return
          emit(`${doc.form.id}`, true)
        }.toString()
      },
      // @TODO These views are for Sync Protocol 1 only. We should move these to another module specific to SP1.
      'tangy-form/responsesLockedAndNotUploaded': {
        map: function (doc) {
          if (doc.collection === 'TangyFormResponse' && doc.complete === true && !doc.uploadDatetime) {
            emit(doc.form.id, true)
          }
        }.toString()
      },
      'tangy-form/responsesUnLockedAndNotUploaded': {
        map: function (doc) {
          if (doc.collection === 'TangyFormResponse' && doc.complete === false && !doc.uploadDatetime) {
            emit(doc.form.id, true)
          }
        }.toString()
      },
      'tangy-form/responsesLockedAndUploaded': {
        map: function (doc) {
          if (doc.collection === 'TangyFormResponse' && doc.complete === true && doc.uploadDatetime) {
            emit(doc.form.id, true)
          }
        }.toString()
      },
      'tangy-form/responsesUnLockedAndUploaded': {
        map: function (doc) {
          if (
            (doc.collection === 'TangyFormResponse' && doc.complete === false && doc.uploadDatetime && ((doc.uploadDatetime > doc.lastModified) || (doc.uploadDatetime > doc.tangerineModifiedOn)))
          ) {
            emit(doc.form.id, true)
          }
        }.toString()
      },
      'tangy-form/responseByUploadDatetime': {
        map: function (doc) {
          if (doc.collection !== 'TangyFormResponse' || !doc.uploadDatetime) return
          emit(doc.uploadDatetime, true)
        }.toString()
      }
    }
  }
]