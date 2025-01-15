/**
 * Interface representing a Rule entity
 * Defines the structure and types for rule objects in the system
 */
export interface TRule {
    id: string;
    uuid: string;
    name: string;
    description: string;
    action: 'create' | 'read' | 'update' | 'delete';
    timing: 'before' | 'after';
    conditions: object[];
    type: 'mapping' | 'error' | 'script' | 'synchronization' | 'authentication' | 'download' | 'upload' | 'locking';
    configuration: object;
    order: number;
    created: string;
    updated: string;
}
