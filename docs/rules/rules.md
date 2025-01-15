# Rules

Rules are components that can be associated with endpoints to add additional functionality. Based on the current codebase, rules are stored as string IDs and can be attached to multiple endpoints.

## Adding Rules to Endpoints

Rules can be added to endpoints through the AddEndpointRule modal component. The process works as follows:

1. Select a rule from the available rule options dropdown
2. The rule ID is added to the endpoint's `rules` array property
3. The endpoint is updated with the new rule association
4. On success, the modal closes automatically after 2 seconds

## Rule Properties

Rules have several key properties that define their behavior:

- uuid: A unique identifier string for the rule
- name: The display name of the rule
- description: A detailed description of the rule's purpose
- action: Specifies when the rule triggers (create, read, update, delete)
- timing: Controls if rule runs 'before' or 'after' the action (defaults to 'before')
- conditions: JSON Logic format conditions that determine when rule applies
- type: The rule type (mapping, error, script, synchronization, authentication, download, upload, locking)
- configuration: Type-specific configuration stored as JSON
- order: Integer determining execution order when multiple rules exist

The properties work together to define:

1. When the rule executes (action + timing)
2. Under what conditions it runs (conditions)
3. What functionality it provides (type + configuration) 
4. The sequence of execution (order)

Rules are stored in a structured format but referenced by endpoints using their UUID strings in an array format.

## Rule Implementation

The current implementation shows:

- Rules are managed through a dedicated API endpoint at `/api/rules`
- Rules can be retrieved and managed through the Rules resource controller
- Rule IDs are stored and validated as strings within endpoints
- The endpoint entity ensures rules are always stored as an array

## Rule Types

### Authentication Rules

Authentication rules control access to endpoints by validating user credentials and permissions. Configuration options include:

- type: The authentication method to use
  - basic: Basic HTTP authentication
  - jwt: JSON Web Token authentication
  - jwt-zgw: ZGW-specific JWT authentication
  - oauth: OAuth 2.0 authentication
- users: Array of specific users allowed to access the endpoint
- groups: Array of user groups allowed to access the endpoint

### Download Rules

Download rules handle file access and retrieval. Configuration includes:

- fileIdPosition: Specifies the position of the file ID in the URL path
- Automatic validation of user access rights to requested files

### Upload Rules

Upload rules manage file upload functionality and restrictions. Configuration includes:

- path: The target directory path for uploaded files
- allowedTypes: Comma-separated list of allowed file extensions (e.g., jpg,png,pdf)
- maxSize: Maximum allowed file size in megabytes

### Locking Rules

Locking rules provide exclusive access control for resources. Configuration includes:

- action: The locking operation to perform
  - lock: Lock a resource for exclusive access
  - unlock: Release a previously locked resource
- timeout: Duration in minutes before the lock automatically expires

## Rule Validation

When adding rules to an endpoint:

- The rules array is initialized if it doesn't exist
- Existing rule IDs are converted to strings
- New rule IDs are validated before being added
- The endpoint is revalidated after rule changes

## Error Handling

The rule addition process includes:

- Validation that a rule is selected before saving
- Error catching and display if the save fails
- Loading state management during the save process
- Success/error message display to the user
