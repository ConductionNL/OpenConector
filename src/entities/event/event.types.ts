export type TEvent = {
    id: string
    name: string
    description: string
    eventType: string
    payload: object
    priority: number
    timeout: number
    isAsync: boolean
    allowDuplicates: boolean
    isEnabled: boolean
    oneTime: boolean
    scheduleAfter: string
    userId: string
    eventGroupId: string
    retentionPeriod: number
    errorRetention: number
    lastTriggered: string
    nextTrigger: string
    created: string
    updated: string
}
