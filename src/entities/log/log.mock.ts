import { Log } from './log'
import { TLog } from './log.types'

export const mockLogData = (): TLog[] => [
    {
        id: "5137a1e5-b54d-43ad-abd1-4b5bff5fcd3f",
        type: "in",
        callId: "e2984465-190a-4562-829e-a8cca81aa35d",
        requestMethod: "GET",
        requestHeaders: [{ "Content-Type": "application/json" }],
        requestQuery: [{ "page": "1" }],
        requestPathInfo: "/api/users",
        requestLanguages: ["en-US", "en"],
        requestServer: { "SERVER_NAME": "example.com" },
        requestContent: "",
        session: "abc123",
        sessionValues: { "user_id": "123" },
        responseTime: 50
    },
    {
        id: "4c3edd34-a90d-4d2a-8894-adb5836ecde8",
        type: "out",
        callId: "f3984465-190a-4562-829e-a8cca81aa35e",
        requestMethod: "POST",
        requestHeaders: [{ "Content-Type": "application/json" }],
        requestQuery: [],
        requestPathInfo: "/api/users",
        requestLanguages: ["en-US", "en"],
        requestServer: { "SERVER_NAME": "example.com" },
        requestContent: '{"name": "John Doe"}',
        session: "def456",
        sessionValues: { "user_id": "456" },
        responseTime: 100
    }
]

export const mockLog = (data: TLog[] = mockLogData()): TLog[] => data.map(item => new Log(item))