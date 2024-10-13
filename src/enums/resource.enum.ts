// Resource represents the models in the application.
// It is used to restrict access to certain routes based on the user's role.
// It is an enum that contains the following values: USER, ROLE, PERMISSION, TRANSACTION.
//  The values are used in the auth middleware to check if the user's role is authorized to access a particular route.
export enum Resource {
    USER = 'user',
    ROLE = 'role',
    PERMISSION = 'permission',
    TRANSACTION = 'transaction',

    // Add more resources here.
}
